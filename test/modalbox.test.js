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
    const $stuffToDisplayInModalbox = $('<div>').prop('id', 'someStuff').appendTo('body');
    const $button = $('<button>').prop('id', 'myButton').appendTo('body');

    createModal('#myButton', '#someStuff');
    $button.trigger('click');

    assert.equal($('body > #someStuff').length, 0);
    assert.equal($('.js-modal-box-content-div #someStuff').length, 1);
  });

  context('when two modalboxes on same page', () => {
    it('should move each content to corresponding modalbox div');
    it('should attach different event handlers for each');
  });
});
