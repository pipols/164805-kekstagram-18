'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
  };

  var errorTemplate = document.querySelector('template#error').content;
  var newMessage = errorTemplate.cloneNode(true);
  var main = document.querySelector('main');
  var body = document.querySelector('body');

  var closeErrorMessage = function () {
    var node = document.querySelector('.error');
    node.style.display = 'none';
    body.removeEventListener('keydown', mainEscHandler);
  };

  var openErrorMessage = function () {
    main.appendChild(newMessage);
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
    newMessage.querySelector('.error__title').textContent = message;
    openErrorMessage();
  };

  window.alert = {
    errorMessage: errorMessage
  };
})();
