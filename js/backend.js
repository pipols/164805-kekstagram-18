'use strict';

(function () {

  var SEND_FORM = 'https://js.dump.academy/kekstagram';
  var GET_DATA = 'https://js.dump.academy/kekstagram/data';
  var REQUEST_STATUS = {
    OK: 200
  };

  var initRequestDownload = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === REQUEST_STATUS.OK) {
        callback(xhr.response);
      } else {
        window.alert.errorMessage('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('GET', GET_DATA);
    xhr.send();
  };

  var initRequestUpload = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === REQUEST_STATUS.OK) {
        callback(xhr.response);
      } else {
        window.alert.errorMessage('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', SEND_FORM);
    xhr.send(data);

  };

  window.backend = {
    initRequestDownload: initRequestDownload,
    initRequestUpload: initRequestUpload
  };

})();
