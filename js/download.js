'use strict';

(function () {
  window.download = {
    data: [],
    filteredData: []
  };
  var start = function () {
    window.backend.download(getData, window.alert.getErrorMessage);
  };

  var getData = function (data) {
    window.gallery.renderGallery(data);
    window.download.data = data;
    window.download.filteredData = data;
    window.filter.show();
  };

  start();
})();
