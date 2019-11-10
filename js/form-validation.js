'use strict';

(function () {
  // Валидация хеш-тегов

  var HashtagValidationMessage = {
    FIRST_SYMBOL: 'хэш-тег должен начинатся с символа # (решётка)',
    NOT_ONLY_HASH: 'хеш-тег не может состоять только из одной решётки',
    SPACE_REQUIRE: 'хеш-теги должны разделяться пробелами',
    UNIQUE: 'один и тот же хэш-тег не может быть использован дважды',
    TO_MANY: 'Нельзя указать больше пяти хэш-тегов',
    TO_LONG: 'максимальная длина одного хэш-тега 20 символов, включая решётку'
  };

  var DescriptionValidationMessage = {
    TO_LONG: 'длина комментария не может составлять больше 140 символов'
  };

  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG = 20;
  var MAX_LENGTH_COMMENT = 140;

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
    var result = hashtags.trim().toLowerCase().split(' ').filter(Boolean);

    if (searchIdenticalValue(result)) {
      textHashtagsField.setCustomValidity(HashtagValidationMessage.UNIQUE);
    }

    if (result.length > MAX_HASHTAGS) {
      textHashtagsField.setCustomValidity(HashtagValidationMessage.TO_MANY);
    }

    result.forEach(function (elem) {
      if (elem.charAt(0) !== '#') {
        textHashtagsField.setCustomValidity(HashtagValidationMessage.FIRST_SYMBOL);
      }

      if (elem.length === 1 && elem.charAt(0) === '#') {
        textHashtagsField.setCustomValidity(HashtagValidationMessage.NOT_ONLY_HASH);
      }

      if (elem.split('#').length > 2) {
        textHashtagsField.setCustomValidity(HashtagValidationMessage.SPACE_REQUIRE);
      }

      if (elem.length > MAX_HASHTAG) {
        textHashtagsField.setCustomValidity(HashtagValidationMessage.TO_LONG);
      }
    });
  };

  var hashtagsInputHandler = function (evt) {
    var hashtags = evt.target.value;
    validateHashtags(hashtags);
  };

  // валидация комментария

  var descriptionValidation = function (message) {
    if (message.length > MAX_LENGTH_COMMENT) {
      textDescription.setCustomValidity(DescriptionValidationMessage.TO_LONG);
    }
  };

  var descriptionInputHandler = function (evt) {
    var message = evt.target.value;
    descriptionValidation(message);
  };

  var clearCustomValidity = function () {
    textDescription.setCustomValidity('');
    textHashtagsField.setCustomValidity('');
  };

  var addFormValidationHandler = function () {
    textHashtagsField.addEventListener('input', hashtagsInputHandler);
    textDescription.addEventListener('input', descriptionInputHandler);
  };

  var removeFormValidationHandler = function () {
    textHashtagsField.removeEventListener('input', hashtagsInputHandler);
    textDescription.removeEventListener('input', descriptionInputHandler);
    clearCustomValidity();
  };

  window.formValidation = {
    addFormValidationHandler: addFormValidationHandler,
    removeFormValidationHandler: removeFormValidationHandler
  };
})();
