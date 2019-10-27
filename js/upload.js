'use strict';
(function () {
  var imgUploadForm = document.querySelector('.img-upload__form');

  var imgUploadSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.initRequestUpload(new FormData(imgUploadForm), function () {
      window.imageEditingForm.closeImageUploadOverlay();
    });
    window.alert.successMessage();
  };

  imgUploadForm.addEventListener('submit', imgUploadSubmitHandler);
})();
