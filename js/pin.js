'use strict';

(function () {
  // Функция отрисовки метки
  var getPin = function (offer, element, width, height) {
    var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

    element.style = pinPosition;
    element.querySelector('img').src = offer.author.avatar;
    element.querySelector('img').alt = offer.offer.title;

    return element;
  };

  window.pin = {
    getPin: getPin,
  };
})();
