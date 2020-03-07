'use strict';

/* ------------------------------ НЕОБХОДИМЫЕ ДАННЫЕ ------------------------------ */

// Необходимые DOM-элементы
var offersMap = document.querySelector('.map'); // карта с объявлениями
var pinTemplate = document.querySelector('#pin').content.querySelector('button'); // шаблон метки объявления
var mapPins = document.querySelector('.map__pins'); // элемент, куда добавлять метки объявлений
var adForm = document.querySelector('.ad-form'); // форма объявления
var adFormHeader = document.querySelector('.ad-form-header'); // заголовок формы
var adFormElements = document.querySelectorAll('.ad-form__element'); // элементы формы
var mapFilters = document.querySelector('.map__filters'); // форма с фильтрами
var addressInput = document.querySelector('#address'); // инпут адреса
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // шаблон карточки объявления
var mapFiltersContainer = offersMap.querySelector('.map__filters-container'); // контейнер с фильтрами на карте

// Размеры меток
var pinWidth = 50; // ширина обычной метки
var pinHeight = 70; // высота обычной метки

var pinMain = {// главная метка
  element: document.querySelector('.map__pin--main'),
  width: 65,
  height: 65,
  pointHeight: 15,
};

/* ------------------------------ ГЕНЕРАЦИЯ И ОТРИСОВКА МЕТОК ------------------------------ */

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

/* ------------------------------ ГЕНЕРАЦИЯ И ОБРАБОТЧИКИ КАРТОЧЕК ------------------------------ */

// Обработчик открытия карточки по клику по метке
var pinClickHandler = function () {
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

// Обработчик открытия карточки по нажатию на Enter (на пробел почему-то тоже реагирует)
var pinEnterPressHandler = function () {
  var userPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  userPins.forEach(function (element, i) {
    element.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        var popup = document.querySelector('.popup');
        if (popup) {
          popup.remove();
        }
        var cardElement = cardTemplate.cloneNode(true);
        var cardsFragment = document.createDocumentFragment();
        cardsFragment.appendChild(window.card.getCard(window.data.adverts[i], cardElement));
        offersMap.insertBefore(cardsFragment, mapFiltersContainer);
        closePopup();
      }
    });
  });
};

// Обработчик закрытия карточки по клику или нажатию на Enter/ESC (почему-то реагирует и на пробел)
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

/* ------------------------------ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ СОСТОЯНИЯ СТРАНИЦЫ ------------------------------ */

// Функция получения координат главной метки
var getMainPinCoordinatesValue = function (pin, isActive) {
  var left = parseInt(pin.element.style.left, 10);
  var top = parseInt(pin.element.style.top, 10);
  var pinMainLocationX = left + pin.width / 2;
  var pinMainLocationY;
  if (!isActive) {
    pinMainLocationY = top + pin.height / 2;
  } else {
    pinMainLocationY = top + pin.height + pin.pointHeight;
  }
  return Math.round(pinMainLocationX) + ', ' + Math.round(pinMainLocationY);
};

/* ------------------------------ НЕАКТИВНОЕ СОСТОЯНИЕ СТРАНИЦЫ ------------------------------ */

// Добавление атрибута disabled для элементов fieldset (блокируются поля формы в группе)
adFormHeader.setAttribute('disabled', 'disabled'); // для заголовка формы
mapFilters.setAttribute('disabled', 'disabled'); // для формы с фильтрами
adFormElements.forEach(function (element) { // для всех элементов формы
  element.setAttribute('disabled', 'disabled');
});

// Заполнение поля адреса координатами центра метки в неактивном состоянии
addressInput.value = getMainPinCoordinatesValue(pinMain, false);

/* ------------------------------ АКТИВАЦИЯ И ОБРАБОТЧИКИ ------------------------------ */

// Функция активации страницы
var activatePage = function () {
  offersMap.classList.remove('map--faded'); // удаление класса map--faded у карты с объявлениями для ее активации
  adForm.classList.remove('ad-form--disabled'); // удаление класса ad-form--disabled у формы объявления для ее активации
  getPins(); // вызов функции добавления меток
  pinClickHandler(); // обработчик по клику по метке
  pinEnterPressHandler(); // обработчик по нажатию на метку
  addressInput.value = getMainPinCoordinatesValue(pinMain, true); // получение координат метки
  adFormHeader.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с заголовка формы
  mapFilters.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с формы с фильтрами
  adFormElements.forEach(function (element) { // удаление атрибута disabled с элементов формы
    element.removeAttribute('disabled', 'disabled');
  });
};

// Обработчик активации страницы по нажатию на левую клавишу мыши
pinMain.element.addEventListener('mousedown', function (evt) {
  window.util.isLeftMouseButtonEvent(evt, activatePage);
});

// Обработчик активации страницы по нажатию на Enter
pinMain.element.addEventListener('keydown', function (evt) {
  window.util.isEnterEvent(evt, activatePage);
});
