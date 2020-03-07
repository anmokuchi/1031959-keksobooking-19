'use strict';

(function () {
  // Необходимые DOM-элементы
  var offersMap = document.querySelector('.map'); // карта с объявлениями
  var pinTemplate = document.querySelector('#pin').content.querySelector('button'); // шаблон метки объявления
  var mapPins = document.querySelector('.map__pins'); // элемент, куда добавлять метки объявлений
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // шаблон карточки объявления
  var mapFiltersContainer = offersMap.querySelector('.map__filters-container'); // контейнер с фильтрами на карте

  // Размеры меток
  var pinWidth = 50; // ширина обычной метки
  var pinHeight = 70; // высота обычной метки

  // Функция добавления меток во фрагмент и затем на страницу
  var getPins = function () {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.adverts.length; i++) {
      var pinElement = pinTemplate.cloneNode(true);
      offersMap.appendChild(pinElement);
      pinsFragment.appendChild(window.pin.getPin(window.data.adverts[i], pinElement, pinWidth, pinHeight));
    }
    mapPins.appendChild(pinsFragment);
  };

  // Функция открытия карточки
  var openPopup = function () {
    var userPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    userPins.forEach(function (element, i) {
      element.addEventListener('click', function () {
        var popup = document.querySelector('.popup');
        if (popup) {
          popup.remove();
        }
        var cardElement = cardTemplate.cloneNode(true);
        var cardsFragment = document.createDocumentFragment();
        cardsFragment.appendChild(window.card.getCard(window.data.adverts[i], cardElement));
        offersMap.insertBefore(cardsFragment, mapFiltersContainer);
        closePopup();
      });
    });
  };

  // Функция закрытия карточки
  var closePopup = function () {
    var popup = document.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      popup.remove();
    });

    popupClose.addEventListener('keydown', function (evt) {
      window.util.isEnterRemoveEvent(evt, popup);
    });

    document.addEventListener('keydown', function (evt) {
      window.util.isEscRemoveEvent(evt, popup);
    });
  };

  window.map = {
    getPins: getPins,
    openPopup: openPopup,
  };
})();
