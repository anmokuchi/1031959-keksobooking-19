'use strict';

(function () {
  var offersMap = document.querySelector('.map'); // карта с объявлениями
  var pinTemplate = document.querySelector('#pin').content.querySelector('button'); // шаблон метки объявления
  var mapPins = document.querySelector('.map__pins'); // элемент, куда добавлять метки объявлений

  // Функция отрисовки метки
  var getPin = function (offer, element, width, height, index) {
    // WH вынести
    var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

    element.style = pinPosition;
    element.querySelector('img').src = offer.author.avatar;
    element.querySelector('img').alt = offer.offer.title;
    element.dataset.index = index;

    return element;
  };

  // Размеры меток
  var pinWidth = 50; // ширина обычной метки
  var pinHeight = 70; // высота обычной метки

  // Функция добавления меток во фрагмент и затем на страницу
  var addPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < window.mock.adverts.length; i++) {
      var pinElement = pinTemplate.cloneNode(true);
      offersMap.appendChild(pinElement);
      pinsFragment.appendChild(getPin(window.mock.adverts[i], pinElement, pinWidth, pinHeight, i));
    }
    mapPins.appendChild(pinsFragment);
  };

  window.pin = {
    addPins: addPins,
  };
})();
