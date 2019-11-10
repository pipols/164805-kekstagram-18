'use strict';

(function () {
  var classNameToFilterName = {
    chrome: 'grayscale',
    sepia: 'sepia',
    marvin: 'invert',
    phobos: 'blur',
    heat: 'brightness',
    none: 'none'
  };

  var filterNameToValueRange = {
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
  var DEFAULT_LINE_DEPTH = '100%';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadCancel = document.querySelector('.img-upload__cancel');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var imgUploadPreviewWrap = document.querySelector('.img-upload__preview');
  var textHashtagsField = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var effectsList = document.querySelector('.effects__list');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var slider = document.querySelector('.img-upload__effect-level');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectsPreview = document.querySelectorAll('.effects__preview');

  var effectName;
  var previousEffectName;

  var isFocusedTextHashtags = function () {
    return document.activeElement === textHashtagsField;
  };

  var isFocusedTextDescription = function () {
    return document.activeElement === textDescription;
  };

  var closeImageUploadOverlay = function () {
    imgUploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', imgUploadOverlayEscHandler);
    setImageEffect(classNameToFilterName.none);
    hideSlider();
    uploadFile.value = '';
    imgUploadPreview.style.filter = '';
    imgUploadPreviewWrap.style.transform = '';
    window.formValidation.removeFormValidationHandler();
  };

  var openImageUploadOverlay = function () {
    var file = uploadFile.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          imgUploadPreview.src = reader.result;
          effectsPreview.forEach(function (elem) {
            elem.style.backgroundImage = 'url(' + reader.result + ')';
          });
        });
        reader.readAsDataURL(file);
      }
    }
    imgUploadPreviewWrap.style.height = 'auto';
    imgUploadOverlay.classList.remove('hidden');
    setScaleControlValue(DEFAULT_SCALE_CONTROL_VALUE);
    document.addEventListener('keydown', imgUploadOverlayEscHandler);
    window.formValidation.addFormValidationHandler();
  };

  uploadFile.addEventListener('change', function () {
    openImageUploadOverlay();
  });

  imgUploadCancel.addEventListener('click', function () {
    closeImageUploadOverlay();
  });

  var imgUploadOverlayEscHandler = function (evt) {
    if (evt.keyCode === window.util.keyCode.ESC && !isFocusedTextHashtags() && !isFocusedTextDescription()) {
      closeImageUploadOverlay();
    }
  };

  var hideSlider = function () {
    slider.classList.add('hidden');
  };

  var showSlider = function () {
    slider.classList.remove('hidden');
  };

  var getValueFromPinPosition = function (effect) {
    var widthLine = effectLevelLine.offsetWidth;
    var pinPosition = effectLevelPin.offsetLeft;
    var effectStyleName = classNameToFilterName[effect];
    var valuePosition = pinPosition / widthLine * filterNameToValueRange[effectStyleName].max;
    var unit = filterNameToValueRange[effectStyleName].unit;
    var value;

    if (unit === '') {
      value = valuePosition.toFixed(2);
    }

    if (unit === '%' || unit === 'px') {
      value = Math.floor(valuePosition);
    }

    effectLevelValue.value = value;
    imgUploadPreview.style.filter = classNameToFilterName[effect] + '(' + value + unit + ')';
  };

  var setDefaultImageEffect = function (effect) {
    if (effect === 'none') {
      imgUploadPreview.style.filter = 'none';
    } else {
      var property = classNameToFilterName[effect];
      var value = filterNameToValueRange[property].default;
      var unit = filterNameToValueRange[property].unit;
      imgUploadPreview.style.filter = property + '(' + value + unit + ')';
    }
  };

  var setDefaultPinPosition = function () {
    var defaultPosition = effectLevelPin.offsetParent.clientWidth;
    effectLevelPin.style.left = defaultPosition + 'px';
  };

  var setDefaultLineDepth = function () {
    effectLevelDepth.style.width = DEFAULT_LINE_DEPTH;
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
    if (effectName === classNameToFilterName.none) {
      hideSlider();
    } else {
      showSlider();
      setDefaultPinPosition();
      setDefaultLineDepth();
    }
  };

  hideSlider();

  effectsList.addEventListener('change', effectsRadioChangeHandler);

  // перемещение пина у слайдера

  var setLineDepth = function () {
    var widthLine = effectLevelLine.offsetWidth;
    var pinPosition = effectLevelPin.offsetLeft;
    var valuePosition = Math.floor(pinPosition / widthLine * 100);
    effectLevelDepth.style.width = valuePosition + '%';
  };

  var mouseDownHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var pinMotionRestriction = {
      x: {
        min: effectLevelPin.offsetParent.clientLeft,
        max: effectLevelPin.offsetParent.clientWidth
      }
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      getValueFromPinPosition(effectName);
      setLineDepth();

      pinMotionRestriction.x.min = effectLevelPin.offsetParent.clientLeft;
      pinMotionRestriction.x.max = effectLevelPin.offsetParent.clientWidth;

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var positionX = effectLevelPin.offsetLeft - shift.x;
      if (positionX < pinMotionRestriction.x.min) {
        positionX = pinMotionRestriction.x.min;
      }
      if (positionX > pinMotionRestriction.x.max) {
        positionX = pinMotionRestriction.x.max;
      }

      effectLevelPin.style.left = positionX + 'px';
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  effectLevelPin.addEventListener('mousedown', mouseDownHandler);

  // Редактирование размера изображения

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

  window.imageEditingForm = {
    closeImageUploadOverlay: closeImageUploadOverlay
  };
})();
