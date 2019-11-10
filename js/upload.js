'use strict';
(function () {
  var imgUploadForm = document.querySelector('.img-upload__form');

  var imgUploadSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(imgUploadForm), window.alert.getSuccessMessage, window.alert.getUploadErrorMessage);
    imgUploadForm.reset();
  };

  imgUploadForm.addEventListener('submit', imgUploadSubmitHandler);
})();
