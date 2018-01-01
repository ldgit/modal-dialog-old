const assert = require('assert');
const jQueryWithoutWindow = require('jquery');
const { JSDOM } = require('jsdom');
const makeCreateModal = require('../modalbox');

function createJqueryWithDom(window) {
  return jQueryWithoutWindow(window);
}

describe('modal box', () => {
  let $;
  let createModal;
  let jsdom;

  beforeEach(() => {
    jsdom = new JSDOM(
      `<html>
        <body>
        </body>
      </html>`
    );

    $ = createJqueryWithDom(jsdom.window);
    createModal = makeCreateModal($);
  });

  it('should append a new hidden modal div to html body when called', () => {
    createModal();
    assert.equal($('.js-modal-box-content-div').length, 1);
    assert.equal($('.js-modal-box-content-div').css('display'), 'none');
  });

  it('should attach an event to given css selector that toggles the modal div visibility', () => {
    const $button = $('<button>').prop('id', 'myButton').appendTo('body');
    createModal('#myButton');
    $button.trigger('click');
    assert.equal($('.js-modal-box-content-div').css('display'), 'block');
  });

  it('should move everything from second selector parameter to created div', () => {
    $('<div>').prop('id', 'someStuff').appendTo('body');
    const $button = $('<button>').prop('id', 'myButton').appendTo('body');

    createModal('#myButton', '#someStuff');
    $button.trigger('click');

    assert.equal($('body > #someStuff').length, 0);
    assert.equal($('.js-modal-box-content-div #someStuff').length, 1);
  });

  context('when two modalboxes on same page', () => {
    let button1;
    let button2;

    beforeEach(() => {
      $('<div>').prop('id', 'someStuff1').appendTo('body');
      $('<div>').prop('id', 'someStuff2').appendTo('body');
      assert.equal($('body > #someStuff1').length, 1);
      assert.equal($('body > #someStuff2').length, 1);
      $button1 = $('<button>').prop('id', 'myButton1').appendTo('body');
      $button2 = $('<button>').prop('id', 'myButton2').appendTo('body');
    });

    it('should move each content to corresponding modalbox div', () => {
      createModal('#myButton1', '#someStuff1');
      createModal('#myButton2', '#someStuff2');

      assert.equal($('body > #someStuff1').length, 0);
      assert.equal($('body > #someStuff2').length, 0);
      assert.equal($('.js-modal-box-content-div').eq(0).find('#someStuff1').length, 1);
      assert.equal($('.js-modal-box-content-div').eq(1).find('#someStuff2').length, 1);
    });

    it('should attach different event handlers for each');
  });
});
