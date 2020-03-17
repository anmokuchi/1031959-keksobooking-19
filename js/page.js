'use strict';

(function () {
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
  };

  var cssClass = {
    mapFaded: 'map--faded',
    adFormDisabled: 'ad-form--disabled',
  };

  var domElement = {
    offersMap: document.querySelector(selector.map),
    adForm: document.querySelector(selector.adForm),
    adFormHeader: document.querySelector(selector.adFormHeader),
    adFormElements: document.querySelectorAll(selector.adFormElement),
    mapFilters: document.querySelector(selector.mapFilters),
    addressInput: document.querySelector(selector.address),
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

  // Функция деактивации страницы
  var deactivatePage = function () {
    domElement.offersMap.classList.add(cssClass.mapFaded);
    domElement.mapFilters.setAttribute('disabled', 'disabled');
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

  // Перевод формы в активный режим
  var activateForm = function () {
    domElement.adFormElements.forEach(function (element) {
      element.removeAttribute('disabled', 'disabled');
    });
  };

  // Коллбэк успешной загрузки данных
  var onSuccess = function (data) {
    window.data = data;
    window.pin.showPins(window.data);
  };

  // Функция активации страницы
  var activatePage = function () {
    domElement.offersMap.classList.remove(cssClass.mapFaded);
    domElement.mapFilters.removeAttribute('disabled', 'disabled');
    window.backend.load(onSuccess, window.util.onError);

    domElement.adForm.classList.remove(cssClass.adFormDisabled);
    domElement.adFormHeader.removeAttribute('disabled', 'disabled');
    activateForm();
    domElement.addressInput.value = getMainPinCoordinatesValue(pinMain, true);

    pinMain.element.removeEventListener('mousedown', onPinMainLeftButtonClick);
    pinMain.element.removeEventListener('keydown', onPinMainEnterPress);
  };

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
