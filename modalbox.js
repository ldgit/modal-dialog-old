module.exports = function makeCreateModal($, options) {
  var globalConfig = $.extend({
    cssClass: false,
    copyContent: false,
  }, options);

  return createModal.bind(null, $, globalConfig);
};

function createModal($, globalConfig, selector, modalContentSelector, specificOptions) {
  var options = $.extend({}, globalConfig, specificOptions);

  var $modalDiv = $('<div>').addClass('js-modal-box-content-div').css('display', 'none').appendTo('body');

  if(options.cssClass) {
    $modalDiv.addClass(options.cssClass);
  }

  var $modalContent = options.copyContent ? $(modalContentSelector).clone() : $(modalContentSelector);
  $modalContent.appendTo($modalDiv);

  $(selector).on('click', function() {
    if($modalDiv.css('display') === 'none') {
      $modalDiv.css('display', 'block');
    } else {
      $modalDiv.css('display', 'none');
    }
  });
}
