'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomArrayElement = function (elements) {
    return elements[getRandomInteger(0, elements.length - 1)];
  };

  var shuffleArray = function (array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
      randomIndex = getRandomInteger(0, currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  // https://up.htmlacademy.ru/javascript/18/criteries#b26
  var clearNodeList = function (selector) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.remove();
    });
  };

  var removeClassFromNodeList = function (nodeList, deletedSelector) {
    nodeList.forEach(function (element) {
      element.classList.remove(deletedSelector);
    });
  };

  window.util = {
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement,
    shuffleArray: shuffleArray,
    clearNodeList: clearNodeList,
    removeClassFromNodeList: removeClassFromNodeList,
    keyCode: KeyCode
  };
})();
