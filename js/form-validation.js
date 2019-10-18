'use strict';

(function () {
  // Валидация хеш-тегов

  var HASHTAG_VALIDATION_MESSAGE = {
    firstSymbol: 'хэш-тег должен начинатся с символа # (решётка)',
    notOnlyHash: 'хеш-тег не может состоять только из одной решётки',
    spaceRequire: 'хеш-теги должны разделяться пробелами',
    unique: 'один и тот же хэш-тег не может быть использован дважды',
    toMany: 'Нельзя указать больше пяти хэш-тегов',
    toLong: 'максимальная длина одного хэш-тега 20 символов, включая решётку'
  };

  var DESCRIPTION_VALIDATION_MESSAGE = {
    toLong: 'длина комментария не может составлять больше 140 символов'
  };

  var THE_MAXIMUM_LENGTH_OF_A_HASHTAGS = 5;
  var THE_MAXIMUM_LENGTH_OF_A_HASHTAG = 20;
  var THE_MAXIMUM_LENGTH_OF_THE_COMMENT = 140;

  var textHashtagsField = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');

  var searchIdenticalValue = function (hashtags) {
    var sortedHashtags = hashtags.slice().sort();
    for (var i = 0; i < sortedHashtags.length - 1; i++) {
      if (sortedHashtags[i] === sortedHashtags[i + 1]) {
        return true;
      }
    }
    return false;
  };

  var validateHashtags = function (hashtags) {
    textHashtagsField.setCustomValidity('');

    var result = hashtags.trim().toLowerCase().split(' ').filter(Boolean);

    if (searchIdenticalValue(result)) {
      textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.unique);
    }

    if (result.length > THE_MAXIMUM_LENGTH_OF_A_HASHTAGS) {
      textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.toMany);
    }

    result.forEach(function (elem) {
      if (elem.charAt(0) !== '#') {
        textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.firstSymbol);
      }

      if (elem.length === 1 && elem.charAt(0) === '#') {
        textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.notOnlyHash);
      }

      if (elem.split('#').length > 2) {
        textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.spaceRequire);
      }

      if (elem.length > THE_MAXIMUM_LENGTH_OF_A_HASHTAG) {
        textHashtagsField.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.toLong);
      }
    });
  };

  var hashtagsInputHandler = function (evt) {
    var hashtags = evt.target.value;
    validateHashtags(hashtags);
  };

  textHashtagsField.addEventListener('input', hashtagsInputHandler);

  // валидация комментария

  var descriptionValidation = function (message) {
    textDescription.setCustomValidity('');
    if (message.length > THE_MAXIMUM_LENGTH_OF_THE_COMMENT) {
      textDescription.setCustomValidity(DESCRIPTION_VALIDATION_MESSAGE.toLong);
    }
  };

  var descriptionInputHandler = function (evt) {
    var message = evt.target.value;
    descriptionValidation(message);
  };

  textDescription.addEventListener('input', descriptionInputHandler);
})();
