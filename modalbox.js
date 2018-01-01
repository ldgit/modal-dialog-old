module.exports = function makeCreateModal($) {

  return createModal.bind(null, $);
};

function createModal($, selector, modalContentSelector) {
  var $modalDiv = $('<div>').addClass('js-modal-box-content-div').css('display', 'none').appendTo('body');
  $(modalContentSelector).appendTo($modalDiv);

  $(selector).on('click', function() {
    $modalDiv.css('display', 'block');
  });
}
