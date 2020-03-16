'use strict';

(function () {
  var MAP_MAX_PINS = 5;

  var offersMap = document.querySelector('.map'); // карта с объявлениями
  var pinTemplate = document.querySelector('#pin').content.querySelector('button'); // шаблон метки объявления
  var mapPins = document.querySelector('.map__pins'); // элемент, куда добавлять метки объявлений

  // Размеры меток
  var pinWidth = 50; // ширина обычной метки
  var pinHeight = 70; // высота обычной метки

  // Функция отрисовки метки
  var getPin = function (offer, element, width, height, index) {
    var left = offer.location.x - (width / 2);
    var top = offer.location.y - height;
    var pinPosition = 'left: ' + left + 'px; top: ' + top + 'px;';

    element.style = pinPosition;
    element.querySelector('img').src = offer.author.avatar;
    element.querySelector('img').alt = offer.offer.title;
    element.dataset.index = index;

    return element;
  };

  var removePins = function () {
    var userPins = document.querySelectorAll('.map__pin');
    userPins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
  };

  // Функция добавления меток во фрагмент и затем на страницу
  var addPins = function (data) {
    removePins();
    var pinsFragment = document.createDocumentFragment();
    var pinsOnMap = data.length > MAP_MAX_PINS ? MAP_MAX_PINS : data.length;
    for (var i = 0; i < pinsOnMap; i++) {
      var pinElement = pinTemplate.cloneNode(true);
      offersMap.appendChild(pinElement);
      pinsFragment.appendChild(getPin(data[i], pinElement, pinWidth, pinHeight, i));
    }
    mapPins.appendChild(pinsFragment);
  };

  window.pin = {
    addPins: addPins,
  };
})();
