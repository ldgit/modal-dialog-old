const assert = require('assert');
const jQueryWithoutWindow = require('jquery');
const { JSDOM } = require('jsdom');
const makeCreateModal = require('../modalbox');

function createJqueryWithDom(window) {
  return jQueryWithoutWindow(window);
}

describe('modal box', () => {
  let document;
  let $;
  let createModal;

  beforeEach(() => {
    let jsdom = new JSDOM(`<html><body></body></html>`);
    $ = createJqueryWithDom(jsdom.window);
    document = jsdom.window.document;
    createModal = makeCreateModal($);
  });

  it('should append a new hidden modal div to html body when called', () => {
    createModal();

    const modalBoxContent = document.querySelector('.js-modal-box-content-div');
    assert.notEqual(modalBoxContent, null);
    assert.equal(modalBoxContent.style.display, 'none');
  });

  it('should attach an event to given css selector that toggles the modal div visibility', () => {
    const { button } = createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');

    createModal('#myButton', '#someStuff');

    const modalBoxContent = document.querySelector('.js-modal-box-content-div');
    button.click();
    assert.equal(modalBoxContent.style.display, 'block');
    button.click();
    assert.equal(modalBoxContent.style.display, 'none');
  });

  it('should move everything under second selector parameter to created modal div', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');

    createModal('#myButton', '#someStuff');

    // assert modal content moved from original location
    assert.strictEqual(document.querySelector('body > #someStuff'), null);
    // assert modal content moved to modal box div
    assert.notEqual(document.querySelector('.js-modal-box-content-div > #someStuff'), null);
  });

  it('should allow for custom modalbox styling via makeCreateModal() function', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');
    const createStyledModal = makeCreateModal($, { cssClass: 'mySpecialClass' });

    createStyledModal('#myButton', '#someStuff');

    assert.strictEqual(document.querySelector('.js-modal-box-content-div').classList.contains('mySpecialClass'), true);
  });

  context('when two modalboxes on same page', () => {
    let button1;
    let button2;

    beforeEach(() => {
      button1 = createModalContentAndButtonThatActivatesIt('someStuff1', 'myButton1').button;
      button2 = createModalContentAndButtonThatActivatesIt('someStuff2', 'myButton2').button;
      assert.notEqual(document.querySelector('body > #someStuff1'), null);
      assert.notEqual(document.querySelector('body > #someStuff2'), null);
    });

    it('should move each content to corresponding modalbox div', () => {
      createModal('#myButton1', '#someStuff1');
      createModal('#myButton2', '#someStuff2');

      assert.notEqual(document.querySelectorAll('.js-modal-box-content-div')[0].querySelector('#someStuff1'), null);
      assert.strictEqual(document.querySelectorAll('.js-modal-box-content-div')[0].querySelector('#someStuff2'), null);

      assert.notEqual(document.querySelectorAll('.js-modal-box-content-div')[1].querySelector('#someStuff2'), null);
      assert.strictEqual(document.querySelectorAll('.js-modal-box-content-div')[1].querySelector('#someStuff1'), null);
    });

    it('should attach different event handlers for each modal box call', () => {
      createModal('#myButton1', '#someStuff1');
      createModal('#myButton2', '#someStuff2');

      button1.click();
      assert.equal(document.querySelectorAll('.js-modal-box-content-div')[0].style.display, 'block');
      assert.equal(document.querySelectorAll('.js-modal-box-content-div')[1].style.display, 'none');

      button2.click();
      assert.equal(document.querySelectorAll('.js-modal-box-content-div')[0].style.display, 'block');
      assert.equal(document.querySelectorAll('.js-modal-box-content-div')[1].style.display, 'block');
    });
  });

  it('should allow individual functions to override global config', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');
    createModal('#myButton', '#someStuff', { cssClass: 'itcanbedone'});
    assert.strictEqual(document.querySelector('.js-modal-box-content-div').classList.contains('itcanbedone'), true);
  });

  function createModalContentAndButtonThatActivatesIt(contentId, buttonId) {
    const body = document.getElementsByTagName('body')[0];

    const content = document.createElement('div');
    content.id = contentId;
    body.appendChild(content);

    const button = document.createElement('button');
    button.id = buttonId;
    body.appendChild(button);

    assert.notEqual(document.querySelector('body > #' + contentId), null);

    return { button, content };
  }
});
