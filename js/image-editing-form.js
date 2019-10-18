'use strict';

(function () {
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

  var SCALE_CONTROL_VALUE_STEP = 25;
  var MAX_SCALE_CONTROL_VALUE = 100;
  var MIN_SCALE_CONTROL_VALUE = 25;
  var DEFAULT_SCALE_CONTROL_VALUE = 100;

  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadCancel = document.querySelector('.img-upload__cancel');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var imgUploadPreviewWrap = document.querySelector('.img-upload__preview');
  var textHashtagsField = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');


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
})();
