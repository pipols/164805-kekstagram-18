'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
  };

  var errorTemplate = document.querySelector('#error').content;
  var newErrorMessage = errorTemplate.cloneNode(true);
  var successTemplate = document.querySelector('#success').content;
  var newSuccessMessage = successTemplate.cloneNode(true);

  var main = document.querySelector('main');
  var body = document.querySelector('body');

  var closeErrorMessage = function () {
    var node = document.querySelector('.error');
    node.style.display = 'none';
    body.removeEventListener('keydown', mainEscHandler);
  };

  var openErrorMessage = function () {
    main.appendChild(newErrorMessage);
    main.addEventListener('click', errorButtonClickHandler);
    body.addEventListener('keydown', mainEscHandler);
  };

  var errorButtonClickHandler = function (evt) {
    var errorNode = document.querySelector('.error');

    if (evt.target.classList.contains('error__button')) {
      closeErrorMessage();
    }
    if (evt.target === errorNode) {
      closeErrorMessage();
    }
  };

  var mainEscHandler = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closeErrorMessage();
    }
  };

  var errorMessage = function (message) {
    newErrorMessage.querySelector('.error__title').textContent = message;
    openErrorMessage();
  };
  // ////////////////
  var closeSuccessMessage = function () {
    var node = document.querySelector('.success');
    node.style.display = 'none';
    body.removeEventListener('keydown', mainEscHandler2);
  };

  var mainEscHandler2 = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closeSuccessMessage();
    }
  };

  var successButtonClickHandler = function () {
    closeSuccessMessage();
  };

  var successClickHandler = function () {
    closeSuccessMessage();
  };

  var openSuccessMessage = function () {
    main.appendChild(newSuccessMessage);
    var successButton = document.querySelector('.success__button');
    var success = document.querySelector('.success');
    successButton.addEventListener('click', successButtonClickHandler);
    success.addEventListener('click', successClickHandler);
    body.addEventListener('keydown', mainEscHandler2);
  };

  window.alert = {
    errorMessage: errorMessage,
    successMessage: openSuccessMessage
  };
})();
