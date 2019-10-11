'use strict';

var DESCRIPTION_TEMPLATE = {
  COMMENTS:
  ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
  LIKES: {
    MIN: 15,
    MAX: 200
  },
  NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон']
};

var EFFECT_NAME_TO_FILTER_MAP = {
  chrome: 'grayscale',
  sepia: 'sepia',
  marvin: 'invert',
  phobos: 'blur',
  heat: 'brightness',
  none: 'none'
};

var EFFECT_FILTER_VALUE_RANGE = {
  grayscale: {
    min: 0,
    max: 1,
    default: 0,
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    default: 0,
    unit: ''
  },
  invert: {
    min: 0,
    max: 100,
    default: 0,
    unit: '%'
  },
  blur: {
    min: 0,
    max: 3,
    default: 0,
    unit: 'px'
  },
  brightness: {
    min: 0,
    max: 3,
    default: 1,
    unit: ''
  }
};

var AMOUNT_DESCRIPTIONS = 25;
var KeyCode = {
  ESC: 27,
  ENTER: 13
};

var pictureTemplate = document.querySelector('#picture').content;
var picturesList = document.querySelector('.pictures');
var commentsList = document.querySelector('.social__comments');
var comment = document.querySelector('.social__comment');
var bigPictureImg = document.querySelector('.big-picture__img');
var likesCount = document.querySelector('.likes-count');
var commentsCount = document.querySelector('.comments-count');
var socialCaption = document.querySelector('.social__caption');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadFile = document.querySelector('#upload-file');
var imgUploadCancel = document.querySelector('.img-upload__cancel');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelLine = document.querySelector('.effect-level__line');
var imgUploadPreview = document.querySelector('.img-upload__preview img');
var imgUploadPreviewWrap = document.querySelector('.img-upload__preview');
var imgUploadForm = document.querySelector('.img-upload__form');

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

var getPhotosData = function (amount) {
  var descriptions = [];
  for (var i = 0; i < amount; i++) {
    descriptions.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomInteger(DESCRIPTION_TEMPLATE.LIKES.MIN, DESCRIPTION_TEMPLATE.LIKES.MAX),
      comments: [{
        avatar: 'img/avatar-' + getRandomInteger(1, 6) + '.svg',
        message: getRandomArrayElement(DESCRIPTION_TEMPLATE.COMMENTS),
        name: getRandomArrayElement(DESCRIPTION_TEMPLATE.NAMES)
      }]
    });
  }
  return descriptions;
};

var photosData = getPhotosData(AMOUNT_DESCRIPTIONS);

var getPhotoNode = function (template, photoData) {
  var newNode = template.cloneNode(true);
  newNode.querySelector('.picture__img').src = photoData.url;
  newNode.querySelector('.picture__likes').textContent = photoData.likes;
  newNode.querySelector('.picture__comments').textContent = photoData.comments.length;
  return newNode;
};

var accumulateNode = function (amount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < amount; i++) {
    var newNode = getPhotoNode(pictureTemplate, photosData[i]);
    fragment.appendChild(newNode);
  }
  return fragment;
};

var picturesNode = accumulateNode(AMOUNT_DESCRIPTIONS);

picturesList.appendChild(picturesNode);

var showBigPicture = function (photoData) {
  bigPictureImg.src = photoData.url;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  var fragment = document.createDocumentFragment();

  photoData.comments.forEach(function (elem) {
    var newComment = comment.cloneNode(true);
    newComment.querySelector('.social__picture').src = elem.avatar;
    newComment.querySelector('.social__picture').alt = elem.name;
    newComment.querySelector('.social__text').textContent = elem.message;
    fragment.appendChild(newComment);
  });

  commentsList.innerHTML = '';
  commentsList.appendChild(fragment);
};

showBigPicture(photosData[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

var closeImageUploadOverlay = function () {
  imgUploadOverlay.classList.add('hidden');
  imgUploadCancel.removeEventListener('keydown', imgUploadOverlayEnterHandler);
  document.removeEventListener('keydown', imgUploadOverlayEscHandler);
  uploadFile.value = '';
};

var openImageUploadOverlay = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', imgUploadOverlayEscHandler);
};

uploadFile.addEventListener('change', function () {
  openImageUploadOverlay();
});

imgUploadCancel.addEventListener('click', function () {
  closeImageUploadOverlay();
});


var imgUploadOverlayEnterHandler = function (evt) {
  if (evt.keyCode === KeyCode.ENTER) {
    closeImageUploadOverlay();
  }
};

var imgUploadOverlayEscHandler = function (evt) {
  if (evt.keyCode === KeyCode.ESC) {
    closeImageUploadOverlay();
  }
};

// ////////

imgUploadCancel.addEventListener('keydown', imgUploadOverlayEnterHandler);

var effectsList = document.querySelector('.effects__list');
var effectLevelValue = document.querySelector('.effect-level__value');
var slider = document.querySelector('.img-upload__effect-level');

var effectName;

var hiddenSlider = function () {
  slider.classList.add('hidden');
};

var showSlider = function () {
  slider.classList.remove('hidden');
};

var getValueFromPinPosition = function (effect) { // rename!!!
  var widthLine = effectLevelLine.offsetWidth;
  var pinPosition = effectLevelPin.offsetLeft;
  var effectStyleName = EFFECT_NAME_TO_FILTER_MAP[effect];
  var valuePosition = pinPosition / widthLine * EFFECT_FILTER_VALUE_RANGE[effectStyleName].max;
  var unit = EFFECT_FILTER_VALUE_RANGE[effectStyleName].unit;
  var value;

  if (unit === '') {
    value = Math.floor(valuePosition * 100) / 100;
  }
  if (unit === '%' || unit === 'px') {
    value = Math.floor(valuePosition);
  }

  effectLevelValue.value = value; // ¯\(°_o)/¯
  imgUploadPreview.style.filter = EFFECT_NAME_TO_FILTER_MAP[effect] + '(' + value + unit + ')';
};

var setImageEffect = function (effect) {
  imgUploadPreview.className = '';
  imgUploadPreview.classList.add('effects__preview--' + effect);
};

var effectsRadioChangeHandler = function (evt) {
  effectName = evt.target.value;
  imgUploadPreview.style.filter = ''; // !
  setImageEffect(effectName);
  if (effectName === 'none') {
    hiddenSlider();
  } else {
    showSlider();
  }
};

hiddenSlider();

effectsList.addEventListener('change', effectsRadioChangeHandler);

effectLevelPin.addEventListener('mouseup', function () {
  getValueFromPinPosition(effectName);
});

// Редактирование размера изображения

var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');

var scaleControlValueStep = 25;
var maxScaleControlValue = 100;
var minScaleControlValue = 25;
var defaultScaleControlValue = 100;

var setImgUploadPreviewTransformStyle = function (value) {
  imgUploadPreviewWrap.style.transform = 'scale' + '(' + (value / 100) + ')';
};

var getScaleControlValue = function () {
  var value = scaleControlValue.value;
  return +value.split('%').join('');
};

var setScaleControlValue = function (value) {
  if (value > maxScaleControlValue) {
    value = maxScaleControlValue;
  }
  if (value < minScaleControlValue) {
    value = minScaleControlValue;
  }
  scaleControlValue.value = value;
  setImgUploadPreviewTransformStyle(value);
};

var scaleControlSmallerClickHandler = function () {
  var value = getScaleControlValue() - scaleControlValueStep;
  setScaleControlValue(value);
};

var scaleControlBiggerClickHandler = function () {
  var value = getScaleControlValue() + scaleControlValueStep;
  setScaleControlValue(value);
};

setScaleControlValue(defaultScaleControlValue);

scaleControlSmaller.addEventListener('click', scaleControlSmallerClickHandler);
scaleControlBigger.addEventListener('click', scaleControlBiggerClickHandler);

// Валидация хеш-тегов

imgUploadForm.action = 'https://js.dump.academy/kekstagram'; //

var HASHTAG_VALIDATION_MESSAGE = {
  firstSymbol: 'хэш-тег должен начинатся с символа # (решётка)',
  notOnlyHash: 'хеш-тег не может состоять только из одной решётки',
  spaceRequire: 'хеш-теги должны разделяться пробелами',
  unique: 'один и тот же хэш-тег не может быть использован дважды',
  toMany: 'Нельзя указать больше пяти хэш-тегов',
  toLong: 'максимальная длина одного хэш-тега 20 символов, включая решётку'
};

var textHashtags = document.querySelector('.text__hashtags');

var identical = function (arr) {
  arr.sort();
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      return true;
    }
  }
  return false;
};

var hashtagsValidation = function (hashtags) {
  var result = hashtags.trim().toLowerCase().split(' ');

  result.forEach(function (elem) { // 1!
    if (elem.charAt(0) !== '#') {
      textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.firstSymbol);
    }
  });

  result.forEach(function (elem) { // 2!
    if (elem.length === 1 && elem.charAt(0) === '#') {
      textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.notOnlyHash);
    }
  });

  result.forEach(function (elem) { // 3!
    if (elem.split('#').length > 2) {
      textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.spaceRequire);
    }
  });

  if (identical(result)) {
    textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.unique);
  }

  if (result.length > 5) { // 5!
    textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.toMany);
  }

  result.forEach(function (elem) {
    if (elem.length > 20) {
      textHashtags.setCustomValidity(HASHTAG_VALIDATION_MESSAGE.toLong);
    }
  });
};

var hashtagsInputHandler = function (evt) {
  var hashtags = evt.target.value;
  hashtagsValidation(hashtags);
};

textHashtags.addEventListener('input', hashtagsInputHandler);

// валидация комментария

var textDescription = document.querySelector('.text__description');

var DESCRIPTION_VALIDATION_MESSAGE = {
  toLong: 'длина комментария не может составлять больше 140 символов'
};

var descriptionValidation = function (message) {
  if (message.length > 140) {
    textDescription.setCustomValidity(DESCRIPTION_VALIDATION_MESSAGE.toLong);
  }
};

var descriptionInputHandler = function (evt) {
  var message = evt.target.value;
  descriptionValidation(message);
};

textDescription.addEventListener('input', descriptionInputHandler);
