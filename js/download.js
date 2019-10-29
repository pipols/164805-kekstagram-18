'use strict';

(function () {
  window.download = {
    uploadedData: undefined
  };

  var getData = function (data) {
    window.download.uploadedData = data;

    if (!(data)) {
      window.backend.download(getData, window.alert.getErrorMessage);
    } else {
      window.gallery.renderGallery(data);
    }
  };

  getData(window.download.uploadedData);

})();
