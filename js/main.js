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
    default: 1,
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    default: 1,
    unit: ''
  },
  invert: {
    min: 0,
    max: 100,
    default: 100,
    unit: '%'
  },
  blur: {
    min: 0,
    max: 3,
    default: 3,
    unit: 'px'
  },
  brightness: {
    min: 1,
    max: 3,
    default: 3,
    unit: ''
  }
};

var AMOUNT_DESCRIPTIONS = 25;
var KeyCode = {
  ESC: 27,
  ENTER: 13
};

var SCALE_CONTROL_VALUE_STEP = 25;
var MAX_SCALE_CONTROL_VALUE = 100;
var MIN_SCALE_CONTROL_VALUE = 25;
var DEFAULT_SCALE_CONTROL_VALUE = 100;

var pictureTemplate = document.querySelector('#picture').content;
var picturesList = document.querySelector('.pictures');
var commentsList = document.querySelector('.social__comments');
var comment = document.querySelector('.social__comment');
var bigPictureImg = document.querySelector('.big-picture__img img');
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
var bigPicture = document.querySelector('.big-picture');

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

var getPhotoNode = function (template, photoData, counter) {
  var newNode = template.cloneNode(true);
  newNode.querySelector('.picture__img').src = photoData.url;
  newNode.querySelector('.picture__img').dataset.imageNumber = counter; // .setAttribute('data-image_number', counter);
  newNode.querySelector('.picture__likes').textContent = photoData.likes;
  newNode.querySelector('.picture__comments').textContent = photoData.comments.length;
  return newNode;
};

var accumulateNode = function (amount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < amount; i++) {
    var newNode = getPhotoNode(pictureTemplate, photosData[i], i);
    fragment.appendChild(newNode);
  }
  return fragment;
};

var picturesNode = accumulateNode(AMOUNT_DESCRIPTIONS);

picturesList.appendChild(picturesNode);

var renderBigPicture = function (photoData) {
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


document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

var isFocusedTextHashtags = function () {
  return (document.activeElement === textHashtagsField);
};

var isFocusedTextDescription = function () {
  return (document.activeElement === textDescription);
};

var closeImageUploadOverlay = function () {
  imgUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', imgUploadOverlayEscHandler);
  setImageEffect(EFFECT_NAME_TO_FILTER_MAP.none);
  hideSlider();
  uploadFile.value = '';
  imgUploadPreview.style.filter = '';
  imgUploadPreviewWrap.style.transform = '';
};

var openImageUploadOverlay = function () {
  imgUploadOverlay.classList.remove('hidden');
  setScaleControlValue(DEFAULT_SCALE_CONTROL_VALUE);
  document.addEventListener('keydown', imgUploadOverlayEscHandler);
};

uploadFile.addEventListener('change', function () {
  openImageUploadOverlay();
});

imgUploadCancel.addEventListener('click', function () {
  closeImageUploadOverlay();
});

var imgUploadOverlayEscHandler = function (evt) {
  if (evt.keyCode === KeyCode.ESC && !isFocusedTextHashtags() && !isFocusedTextDescription()) {
    closeImageUploadOverlay();
  }
};

// ////////

var effectsList = document.querySelector('.effects__list');
var effectLevelValue = document.querySelector('.effect-level__value');
var slider = document.querySelector('.img-upload__effect-level');

var effectName;
var previousEffectName;

var hideSlider = function () {
  slider.classList.add('hidden');
};

var showSlider = function () {
  slider.classList.remove('hidden');
};

var getValueFromPinPosition = function (effect) {
  var widthLine = effectLevelLine.offsetWidth;
  var pinPosition = effectLevelPin.offsetLeft;
  var effectStyleName = EFFECT_NAME_TO_FILTER_MAP[effect];
  var valuePosition = pinPosition / widthLine * EFFECT_FILTER_VALUE_RANGE[effectStyleName].max;
  var unit = EFFECT_FILTER_VALUE_RANGE[effectStyleName].unit;
  var value;

  if (unit === '') {
    value = valuePosition.toFixed(2);
  }
  if (unit === '%' || unit === 'px') {
    value = Math.floor(valuePosition);
  }

  effectLevelValue.value = value;
  imgUploadPreview.style.filter = EFFECT_NAME_TO_FILTER_MAP[effect] + '(' + value + unit + ')';
};

var setDefaultImageEffect = function (effect) {
  if (effect === 'none') {
    imgUploadPreview.style.filter = 'none';
  } else {
    var property = EFFECT_NAME_TO_FILTER_MAP[effect];
    var value = EFFECT_FILTER_VALUE_RANGE[property].default;
    var unit = EFFECT_FILTER_VALUE_RANGE[property].unit;
    imgUploadPreview.style.filter = property + '(' + value + unit + ')';
  }
};

var setImageEffect = function (currentEffect) {
  imgUploadPreview.classList.remove(previousEffectName);
  previousEffectName = 'effects__preview--' + currentEffect;
  imgUploadPreview.classList.add(previousEffectName);
};

var effectsRadioChangeHandler = function (evt) {
  effectName = evt.target.value;
  setDefaultImageEffect(effectName);
  setImageEffect(effectName);
  if (effectName === EFFECT_NAME_TO_FILTER_MAP.none) {
    hideSlider();
  } else {
    showSlider();
  }
};

hideSlider();

effectsList.addEventListener('change', effectsRadioChangeHandler);

effectLevelPin.addEventListener('mouseup', function () {
  getValueFromPinPosition(effectName);
});

// Редактирование размера изображения

var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');

var setImgUploadPreviewTransformStyle = function (value) {
  imgUploadPreviewWrap.style.transform = 'scale' + '(' + (value / 100) + ')';
};

var getScaleControlValue = function () {
  return +scaleControlValue.value.slice(0, -1);
};

var setScaleControlValue = function (value) {
  if (value > MAX_SCALE_CONTROL_VALUE) {
    value = MAX_SCALE_CONTROL_VALUE;
  }
  if (value < MIN_SCALE_CONTROL_VALUE) {
    value = MIN_SCALE_CONTROL_VALUE;
  }
  scaleControlValue.value = value + '%';
  setImgUploadPreviewTransformStyle(value);
};

var scaleControlSmallerClickHandler = function () {
  var value = getScaleControlValue() - SCALE_CONTROL_VALUE_STEP;
  setScaleControlValue(value);
};

var scaleControlBiggerClickHandler = function () {
  var value = getScaleControlValue() + SCALE_CONTROL_VALUE_STEP;
  setScaleControlValue(value);
};

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

var THE_MAXIMUM_LENGTH_OF_A_HASHTAGS = 5;
var THE_MAXIMUM_LENGTH_OF_A_HASHTAG = 20;
var THE_MAXIMUM_LENGTH_OF_THE_COMMENT = 140;

var textHashtagsField = document.querySelector('.text__hashtags');

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

var textDescription = document.querySelector('.text__description');

var DESCRIPTION_VALIDATION_MESSAGE = {
  toLong: 'длина комментария не может составлять больше 140 символов'
};

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

// просмотра любой фотографии в полноразмерном режиме

var PICTURE_IMAGE_CLASS_NAME = 'picture__img';
var PICTURE_CLASS_NAME = 'picture';

var pictures = document.querySelector('.pictures');
var bigPictureCancel = document.querySelector('.big-picture__cancel');

var pictureImageClickHandler = function (evt) {
  var number;
  if (evt.target.classList.contains(PICTURE_CLASS_NAME)) {
    number = evt.target.querySelector('.picture__img').dataset.imageNumber;
  } else if (evt.target.classList.contains(PICTURE_IMAGE_CLASS_NAME)) {
    number = evt.target.dataset.imageNumber;
  } else {
    return;
  }
  renderBigPicture(photosData[Number(number)]);
  openBigPicture();
};

var openBigPicture = function () {
  bigPicture.classList.remove('hidden');
  window.addEventListener('keydown', bigPictureEscHandler);
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  window.removeEventListener('keydown', bigPictureEscHandler);
};

var bigPictureEscHandler = function (evt) {
  if (evt.keyCode === KeyCode.ESC) {
    closeBigPicture();
  }
};

var bigPictureCancelClickHandler = function () {
  bigPicture.classList.add('hidden');
};

pictures.addEventListener('click', pictureImageClickHandler);
bigPictureCancel.addEventListener('click', bigPictureCancelClickHandler);
