'use strict';

(function () {
  var MAP_MAX_PINS = 5;

  var selector = {
    map: '.map',
    pinTemplate: '#pin',
    pinButton: 'button',
    mapPins: '.map__pins',
    mapPin: '.map__pin',
  };

  var cssClass = {
    mapPinActive: 'map__pin--active',
    mapPinMapPinActive: 'map__pin map__pin--active',
    mapPinMain: 'map__pin--main',
  };

  var domElement = {
    offersMap: document.querySelector(selector.map),
    pinTemplate: document.querySelector(selector.pinTemplate).content.querySelector(selector.pinButton),
    mapPins: document.querySelector(selector.mapPins),
  };

  var pinSize = {
    width: 50,
    height: 70,
  };

  /* ------------------------------ СОЗДАНИЕ ОДНОЙ МЕТКИ ПО ШАБЛОНУ ------------------------------ */

  var getPin = function (offer, index) {
    var left = offer.location.x - (pinSize.width / 2);
    var top = offer.location.y - pinSize.height;
    var pinPosition = 'left: ' + left + 'px; top: ' + top + 'px;';

    var pinElement = domElement.pinTemplate.cloneNode(true);
    pinElement.style = pinPosition;
    pinElement.querySelector('img').src = offer.author.avatar;
    pinElement.querySelector('img').alt = offer.offer.title;
    pinElement.dataset.index = index;

    return pinElement;
  };

  /* ------------------------------ ОТРИСОВКА ВСЕХ МЕТОК НА КАРТЕ ------------------------------ */

  // Удаление меток с карты
  var removePins = function () {
    var userPins = document.querySelectorAll(selector.mapPin);
    userPins.forEach(function (pin) {
      if (!pin.classList.contains(cssClass.mapPinMain)) {
        pin.remove();
      }
    });
  };

  // Отрисовка всех меток
  var showPins = function (data) {
    removePins();

    var pinsFragment = document.createDocumentFragment();
    var pinsOnMap = data.length > MAP_MAX_PINS ? MAP_MAX_PINS : data.length;
    for (var i = 0; i < pinsOnMap; i++) {
      pinsFragment.appendChild(getPin(data[i], i));
    }
    domElement.mapPins.appendChild(pinsFragment);
  };

  /* ------------------------------ ОБРАБОТЧИКИ И СТАТУС МЕТОК ------------------------------ */

  // Функция удаления активного класса с меток
  var userPinsLiveCollection = domElement.offersMap.getElementsByClassName(cssClass.mapPinMapPinActive);
  var cleanAllPinActiveClass = function () {
    Array.from(userPinsLiveCollection).forEach(function (pin) {
      pin.classList.remove(cssClass.mapPinActive);
    });
  };

  // Обработчик открытия карточки по нажатию на метку
  var onPinClick = function (callback) {
    domElement.offersMap.addEventListener('click', function (evt) {
      var pin = evt.target.closest('.map__pin:not(.map__pin--main)');
      if (!pin) {
        return;
      }

      cleanAllPinActiveClass();
      pin.classList.add(cssClass.mapPinActive);

      var index = pin.dataset.index;
      callback(index);
    });
  };

  window.pin = {
    showPins: showPins,
    removePins: removePins,
    cleanAllPinActiveClass: cleanAllPinActiveClass,
    onPinClick: onPinClick,
  };
})();
