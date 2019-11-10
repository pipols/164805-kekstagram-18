'use strict';

(function () {
  var REQUEST_TIMEOUT = 10000;

  var Url = {
    POST: 'https://js.dump.academy/kekstagram',
    GET: 'https://js.dump.academy/kekstagram/data'
  };

  var RequestStatus = {
    OK: 200
  };

  var initRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_TIMEOUT;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RequestStatus.OK) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout);
    });

    return xhr;
  };

  var upload = function (data, onLoad, onError) {
    var xhr = initRequest(onLoad, onError);
    xhr.open('POST', Url.POST);
    xhr.send(data);
  };

  var download = function (onLoad, onError) {
    var xhr = initRequest(onLoad, onError);
    xhr.open('GET', Url.GET);
    xhr.send();
  };

  window.backend = {
    upload: upload,
    download: download,
  };
})();
