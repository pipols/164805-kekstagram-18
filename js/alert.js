'use strict';

(function () {
  var KeyCode = {
    esc: 27,
  };

  var errorTemplate = document.querySelector('#error').content;
  var newErrorMessage = errorTemplate.cloneNode(true);

  var successTemplate = document.querySelector('#success').content;
  var newSuccessMessage = successTemplate.cloneNode(true);

  var errorNode;
  var successNode;

  var main = document.querySelector('main');
  var body = document.querySelector('body');

  var closeErrorMessage = function () {
    var node = document.querySelector('.error');
    node.style.display = 'none';
    body.removeEventListener('keydown', closeError);
  };

  var openErrorMessage = function (message) {
    if (body.contains(errorNode)) {
      errorNode.style.display = 'flex';
    } else {
      newErrorMessage.querySelector('.error__title').textContent = message;
      main.appendChild(newErrorMessage);
    }
    main.addEventListener('click', errorButtonClickHandler);
    body.addEventListener('keydown', closeError); // naming
  };

  var errorButtonClickHandler = function (evt) {
    errorNode = document.querySelector('.error');
    if (evt.target.classList.contains('error__button') || evt.target === errorNode) {
      closeErrorMessage();
    }
  };

  var mainEscHandler = function (closingModal) { // naming
    return function (evt) {
      if (evt.keyCode === KeyCode.esc) {
        closingModal();
      }
    };
  };

  var closeError = mainEscHandler(closeErrorMessage); // naming

  // ---------------

  var closeSuccessMessage = function () {
    successNode = document.querySelector('.success');
    successNode.style.display = 'none';
    body.removeEventListener('keydown', closeSuccess); // naming
  };

  var closeSuccess = mainEscHandler(closeSuccessMessage);

  var successButtonClickHandler = function () { // бред
    closeSuccessMessage();
  };

  var successClickHandler = function () { // бред
    closeSuccessMessage();
  };

  var getSuccessMessage = function () {
    window.imageEditingForm.closeImageUploadOverlay();
    if (body.contains(successNode)) {
      successNode.style.display = 'flex';
    } else {
      main.appendChild(newSuccessMessage);
    }
    var successButton = document.querySelector('.success__button');
    var success = document.querySelector('.success');
    successButton.addEventListener('click', successButtonClickHandler);
    success.addEventListener('click', successClickHandler);
    body.addEventListener('keydown', closeSuccess);
  };

  var getUploadErrorMessage = function (message) {
    openErrorMessage(message);
    window.imageEditingForm.closeImageUploadOverlay();
  };

  window.alert = {
    getErrorMessage: openErrorMessage,
    getSuccessMessage: getSuccessMessage,
    getUploadErrorMessage: getUploadErrorMessage
  };
})();
