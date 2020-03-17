'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

  var StatusCode = {
    OK: 200
  };

  var RESPONSE_TYPE = 'json';
  var TIMEOUT_IN_MS = 10000; // 10 s;

  var sendRequest = function (options, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = options.responseType || RESPONSE_TYPE;
    xhr.timeout = options.timeout > 0 ? options.timeout : TIMEOUT_IN_MS;
    xhr.open(options.method, options.url);
    xhr.send(options.data);

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  window.backend = {
    load: function (onLoad, onError) {
      sendRequest({
        method: 'GET',
        url: LOAD_URL,
      }, onLoad, onError);
    },
    save: function (data, onLoad, onError) {
      sendRequest({
        method: 'POST',
        url: SAVE_URL,
        data: data,
      }, onLoad, onError);
    },
  };
})();
