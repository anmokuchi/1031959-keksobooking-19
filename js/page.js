'use strict';

(function () {
  var MAP_MAX_PINS = 5;
  var DEBOUNCE_INTERVAL = 500; // ms

  var selector = {
    map: '.map',
    adForm: '.ad-form',
    adFormHeader: '.ad-form-header',
    adFormElement: '.ad-form__element',
    mapFilters: '.map__filters',
    address: '#address',
    mapPinMain: '.map__pin--main',
    successTemplate: '#success',
    success: '.success',
    errorTemplate: '#error',
    error: '.error',
    errorButton: '.error__button',
    errorMessage: '.error__message',
    adFormReset: '.ad-form__reset',
    housingType: '#housing-type',
    housingPrice: '#housing-price',
    housingRooms: '#housing-rooms',
    housingGuests: '#housing-guests',
    checkedCheckbox: '.map__checkbox:checked',
  };

  var cssClass = {
    mapFaded: 'map--faded',
    adFormDisabled: 'ad-form--disabled',
    hidden: 'hidden',
  };

  var domElement = {
    offersMap: document.querySelector(selector.map),
    adForm: document.querySelector(selector.adForm),
    adFormHeader: document.querySelector(selector.adFormHeader),
    adFormElements: document.querySelectorAll(selector.adFormElement),
    mapFilters: document.querySelector(selector.mapFilters),
    addressInput: document.querySelector(selector.address),
    resetButton: document.querySelector(selector.adFormReset),
    housingTypeFilter: document.querySelector(selector.housingType),
    housingPriceFilter: document.querySelector(selector.housingPrice),
    housingRoomsFilter: document.querySelector(selector.housingRooms),
    housingGuestsFilter: document.querySelector(selector.housingGuests),
  };

  /* ------------------------------ КООРДИНАТЫ ГЛАВНОЙ МЕТКИ ------------------------------ */

  var ClientSize = {
    MIN_Y: 130,
    MAX_Y: 630,
  };

  var pinMain = {
    element: document.querySelector(selector.mapPinMain),
    width: 65,
    height: 65,
    pointHeight: 15,
  };

  // Положение главной метки по умолчанию
  var setDefaultPinMainPosition = function () {
    pinMain.element.style.left = '570px';
    pinMain.element.style.top = '375px';
  };

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

  /* ------------------------------ НЕАКТИВНЫЙ РЕЖИМ СТРАНИЦЫ ------------------------------ */

  // Перевод формы в неактивный режим
  var deactivateForm = function () {
    domElement.adFormElements.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });
  };

  // Перевод фильтров в неактивный режим
  var mapFiltersCollection = domElement.mapFilters.children;
  var disableMapFilters = function () {
    Array.from(mapFiltersCollection).forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });
  };

  // Функция деактивации страницы
  var deactivatePage = function () {
    domElement.offersMap.classList.add(cssClass.mapFaded);
    domElement.mapFilters.reset();
    disableMapFilters();
    window.pin.removePins();
    window.card.closeCard();
    setDefaultPinMainPosition();

    domElement.adForm.classList.add(cssClass.adFormDisabled);
    domElement.adFormHeader.setAttribute('disabled', 'disabled');
    domElement.adForm.reset();
    deactivateForm();
    domElement.addressInput.value = getMainPinCoordinatesValue(pinMain, false);
  };

  deactivatePage();

  /* ------------------------------ АКТИВНЫЙ РЕЖИМ СТРАНИЦЫ ------------------------------ */

  // Коллбэк успешной загрузки данных
  var onSuccess = function (data) {
    window.data = data;
    filterAdverts(data);
  };

  // Внешний вид сообщения об ошибке при загрузке с сервера
  var onLoadError = function (message) {
    var loadErrorTemplate = document.querySelector(selector.errorTemplate).content.querySelector(selector.error);
    var loadErrorElement = loadErrorTemplate.cloneNode(true);

    var loadErrorButton = loadErrorElement.querySelector(selector.errorButton);
    loadErrorButton.classList.add(cssClass.hidden);

    var loadErrorMessage = loadErrorElement.querySelector(selector.errorMessage);
    loadErrorMessage.textContent = message;
    document.body.appendChild(loadErrorElement);
  };

  // Перевод формы в активный режим
  var activateForm = function () {
    domElement.adFormElements.forEach(function (element) {
      element.removeAttribute('disabled', 'disabled');
    });
  };

  // Перевод фильтров в неактивный режим
  var enableMapFilters = function () {
    Array.from(mapFiltersCollection).forEach(function (element) {
      element.removeAttribute('disabled', 'disabled');
    });
  };

  // Функция активации страницы
  var activatePage = function () {
    domElement.offersMap.classList.remove(cssClass.mapFaded);
    enableMapFilters();
    window.backend.load(onSuccess, onLoadError);

    domElement.adForm.classList.remove(cssClass.adFormDisabled);
    domElement.adFormHeader.removeAttribute('disabled', 'disabled');
    activateForm();
    domElement.addressInput.value = getMainPinCoordinatesValue(pinMain, true);
  };

  // Показ карточки по клику на пин
  window.pin.onPinClick(function (index) {
    window.card.showCard(index);
  });

  /* ------------------------------ ОБРАБОТЧИКИ АКТИВАЦИИ ------------------------------ */

  // Обработчик активации страницы по нажатию на левую клавишу мыши
  var onPinMainLeftButtonClick = function (evt) {
    if (evt.button === 0) {
      activatePage();
    }
  };

  // Обработчик активации страницы по нажатию на Enter
  var onPinMainEnterPress = function (evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  };

  pinMain.element.addEventListener('mousedown', onPinMainLeftButtonClick);
  pinMain.element.addEventListener('keydown', onPinMainEnterPress);

  /* ------------------------------ УСТРАНЕНИЕ ДРЕБЕЗГА ------------------------------ */

  var lastTimeout;

  var debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };

  /* ------------------------------ ФИЛЬТРАЦИЯ МЕТОК И ОБЪЯВЛЕНИЙ ------------------------------ */

  var PriceRange = {
    MIN: 10000,
    MAX: 50000,
  };

  // Фильтрация по типу жилья
  var filterByType = function (advert) {
    var housingTypeFilterValue = domElement.housingTypeFilter.value;
    return housingTypeFilterValue === 'any' ? true : housingTypeFilterValue === advert.offer.type;
  };

  // Фильтрация по стоимости
  var filterByPrice = function (advert) {
    var housingPriceFilterValue = domElement.housingPriceFilter.value;

    if (housingPriceFilterValue === 'any') {
      return true;
    } else if (housingPriceFilterValue === 'middle') {
      return advert.offer.price <= PriceRange.MAX && advert.offer.price >= PriceRange.MIN;
    } else if (housingPriceFilterValue === 'low') {
      return advert.offer.price < PriceRange.MIN;
    } else if (housingPriceFilterValue === 'high') {
      return advert.offer.price > PriceRange.MAX;
    }
    return false;
  };

  // Фильтрация по количеству комнат
  var filterByRooms = function (advert) {
    var housingRoomsFilterValue = domElement.housingRoomsFilter.value;
    return housingRoomsFilterValue === 'any' ? true : parseInt(housingRoomsFilterValue, 10) === advert.offer.rooms;
  };

  // Фильтрация по количеству гостей
  var filterByGuests = function (advert) {
    var housingGuestsFilterValue = domElement.housingGuestsFilter.value;
    return housingGuestsFilterValue === 'any' ? true : parseInt(housingGuestsFilterValue, 10) === advert.offer.guests;
  };

  // Собрать выбранные доп. характеристики
  var getSelectedFeatures = function () {
    return Array.from(document.querySelectorAll(selector.checkedCheckbox)).map(function (element) {
      return element.value;
    });
  };

  // Фильтрация по доп. характеристикам
  var filterByFeatures = function (advert) {
    return getSelectedFeatures().every(function (feature) {
      return advert.offer.features.includes(feature);
    });
  };

  // Функция фильтрации объявлений
  var filterAdverts = function (data) {
    var indexesToShow = [];

    indexesToShow = data.reduce(function (acc, advert, index) {

      if (filterByType(advert)
        && filterByPrice(advert)
        && filterByRooms(advert)
        && filterByGuests(advert)
        && filterByFeatures(advert)) {
        acc.push(index);
      }
      if (acc.length >= MAP_MAX_PINS) {
        acc.splice(5);
      }

      return acc;
    }, []);
    window.pin.showPins(data, indexesToShow);
  };

  // Обработчик фильтрации объявлений
  var onFiltersChange = function () {
    debounce(function () {
      window.card.closeCard();
      filterAdverts(window.data);
    });
  };

  domElement.mapFilters.addEventListener('change', onFiltersChange);

  /* ------------------------------ ПЕРЕМЕЩЕНИЕ ГЛАВНОЙ МЕТКИ ПО КАРТЕ ------------------------------ */

  // Обработчик перетаскивания главной метки
  var onPinMain = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var clientWidth = domElement.offersMap.clientWidth;

    var pinMainPointCoords = {
      x: pinMain.width / 2,
      y: pinMain.height + pinMain.pointHeight,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var delta = {
        x: pinMain.element.offsetLeft - shift.x,
        y: pinMain.element.offsetTop - shift.y,
      };

      pinMain.element.style.top = delta.y + 'px';
      if (delta.y < ClientSize.MIN_Y - pinMainPointCoords.y) {
        pinMain.element.style.top = (ClientSize.MIN_Y - pinMainPointCoords.y) + 'px';
      }
      if (delta.y > ClientSize.MAX_Y - pinMainPointCoords.y) {
        pinMain.element.style.top = (ClientSize.MAX_Y - pinMainPointCoords.y) + 'px';
      }

      pinMain.element.style.left = delta.x + 'px';
      if (delta.x < 0 - pinMainPointCoords.x) {
        pinMain.element.style.left = -pinMainPointCoords.x + 'px';
      }
      if (delta.x > clientWidth - pinMainPointCoords.x) {
        pinMain.element.style.left = (clientWidth - pinMainPointCoords.x) + 'px';
      }

      domElement.addressInput.value = getMainPinCoordinatesValue(pinMain, true);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  pinMain.element.addEventListener('mousedown', onPinMain);

  /* ------------------------------ ОБРАБОТЧИК ДЛЯ ОЧИСТКИ ФОРМЫ ------------------------------ */

  var onResetButtonClick = function () {
    deactivatePage();
  };

  domElement.resetButton.addEventListener('click', onResetButtonClick);

  domElement.resetButton.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      deactivatePage();
    }
  });

  /* ------------------------------ ОТПРАВКА ФОРМЫ ОБЪЯВЛЕНИЯ ------------------------------ */

  // Сообщение об успешной отправке формы
  var successTemplate = document.querySelector(selector.successTemplate).content.querySelector(selector.success);
  var successElement = successTemplate.cloneNode(true);
  var onLoad = function () {
    document.body.appendChild(successElement);
    deactivatePage();
    addListenersOnSuccessMessage();
  };

  var removeSuccessMessage = function () {
    document.body.removeChild(successElement);
  };

  var addListenersOnSuccessMessage = function () {
    document.addEventListener('click', function () {
      removeSuccessMessage();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        removeSuccessMessage();
      }
    });
  };

  // Сообщение об ошибке отправки формы
  var errorTemplate = document.querySelector(selector.errorTemplate).content.querySelector(selector.error);
  var errorElement = errorTemplate.cloneNode(true);
  var onError = function () {
    document.body.appendChild(errorElement);
    addListenersOnErrorMessage();
  };

  var removeErrorMessage = function () {
    document.body.removeChild(errorElement);
  };

  var addListenersOnErrorMessage = function () {
    var errorButton = document.querySelector(selector.errorButton);

    document.addEventListener('click', function () {
      removeErrorMessage();
    });

    errorButton.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        removeErrorMessage();
      }
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        removeErrorMessage();
      }
    });
  };

  // Обработчик отправки данных
  domElement.adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(domElement.adForm), onLoad, onError);
    evt.preventDefault();
  });
})();
