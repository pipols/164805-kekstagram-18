'use strict';

(function () {
  window.download = {
    data: []
  };
  var start = function () {
    window.backend.download(getData, window.alert.getErrorMessage);
  };

  var getData = function (data) {
    window.gallery.renderGallery(data);
    window.download.data = data;
    window.filter.showFilters();
  };

  start();
})();
