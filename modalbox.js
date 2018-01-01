module.exports = function makeCreateModal($) {
  return createModal.bind(null, $);
};

function createModal($, selector, modalContentSelector) {
  var $modalDiv = $('<div>').addClass('js-modal-box-content-div').css('display', 'none').appendTo('body');
  $(modalContentSelector).appendTo($modalDiv);

  $(selector).on('click', function() {
    if($modalDiv.css('display') === 'none') {
      $modalDiv.css('display', 'block');
    } else {
      $modalDiv.css('display', 'none');
    }
  });
}
