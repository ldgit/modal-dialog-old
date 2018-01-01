const assert = require('assert');
const jQueryWithoutWindow = require('jquery');
const { JSDOM } = require('jsdom');
const makeCreateModal = require('../modalbox');

function createJqueryWithDom(window) {
  return jQueryWithoutWindow(window);
}

describe('modal box', () => {
  let jsdom;
  let $;
  let createModal;

  beforeEach(() => {
    jsdom = new JSDOM(`<html><body></body></html>`);
    $ = createJqueryWithDom(jsdom.window);
    createModal = makeCreateModal($);
  });

  it('should append a new hidden modal div to html body when called', () => {
    createModal();
    assert.equal($('.js-modal-box-content-div').length, 1);
    assert.equal($('.js-modal-box-content-div').css('display'), 'none');
  });

  it('should attach an event to given css selector that toggles the modal div visibility', () => {
    const $button = createModalContentAndButtonThatActivatesIt('someStuff', 'myButton').$button;

    createModal('#myButton', '#someStuff');

    $button.trigger('click');
    assert.equal($('.js-modal-box-content-div').css('display'), 'block');
    $button.trigger('click');
    assert.equal($('.js-modal-box-content-div').css('display'), 'none');
  });

  it('should move everything from second selector parameter to created div', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');

    createModal('#myButton', '#someStuff');

    assert.equal($('body > #someStuff').length, 0);
    assert.equal($('.js-modal-box-content-div #someStuff').length, 1);
  });

  it('should allow for custom modalbox styling via makeCreateModal() function', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');
    const createStyledModal = makeCreateModal($, { cssClass: 'mySpecialClass' });

    createStyledModal('#myButton', '#someStuff');

    assert.strictEqual($('.js-modal-box-content-div').hasClass('mySpecialClass'), true);
  });

  context('when copyContent option is true', () => {
    it('should copy modalbox contents instead of moving it', () => {
      createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');
      const copyContentCreateModal = makeCreateModal($, { copyContent: true });

      copyContentCreateModal('#myButton', '#someStuff');

      assert.equal($('body > #someStuff').length, 1);
      assert.equal($('.js-modal-box-content-div div').length, 1);
    });
  });

  context('when two modalboxes on same page', () => {
    let button1;
    let button2;

    beforeEach(() => {
      $button1 = createModalContentAndButtonThatActivatesIt('someStuff1', 'myButton1').$button;
      $button2 = createModalContentAndButtonThatActivatesIt('someStuff2', 'myButton2').$button;
      assert.equal($('body > #someStuff1').length, 1);
      assert.equal($('body > #someStuff2').length, 1);
    });

    it('should move each content to corresponding modalbox div', () => {
      createModal('#myButton1', '#someStuff1');
      createModal('#myButton2', '#someStuff2');

      assert.equal($('body > #someStuff1').length, 0);
      assert.equal($('body > #someStuff2').length, 0);
      assert.equal($('.js-modal-box-content-div').eq(0).find('#someStuff1').length, 1);
      assert.equal($('.js-modal-box-content-div').eq(1).find('#someStuff2').length, 1);
    });

    it('should attach different event handlers for each modal box call', () => {
      createModal('#myButton1', '#someStuff1');
      createModal('#myButton2', '#someStuff2');

      $button1.trigger('click');
      assert.equal($('.js-modal-box-content-div').eq(0).css('display'), 'block');
      assert.equal($('.js-modal-box-content-div').eq(1).css('display'), 'none');

      $button2.trigger('click');
      assert.equal($('.js-modal-box-content-div').eq(0).css('display'), 'block');
      assert.equal($('.js-modal-box-content-div').eq(1).css('display'), 'block');
    });
  });

  it('should allow individual functions to override global config', () => {
    createModalContentAndButtonThatActivatesIt('someStuff', 'myButton');

    createModal('#myButton', '#someStuff', { copyContent: true, cssClass: 'itcanbedone'});

    assert.equal($('body > #someStuff').length, 1);
    assert.strictEqual($('.js-modal-box-content-div').hasClass('itcanbedone'), true);
  });

  function createModalContentAndButtonThatActivatesIt(contentId, buttonId) {
    const $content = $('<div>').prop('id', contentId).appendTo('body');
    const $button = $('<button>').prop('id', buttonId).appendTo('body');

    assert.equal($('body > #' + contentId).length, 1);

    return { $button, $content };
  }
});
