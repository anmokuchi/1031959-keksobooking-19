'use strict';

(function () {
  // Необходимые DOM-элементы
  var offersMap = document.querySelector('.map'); // карта с объявлениями
  var adForm = document.querySelector('.ad-form'); // форма объявления
  var adFormHeader = document.querySelector('.ad-form-header'); // заголовок формы
  var adFormElements = document.querySelectorAll('.ad-form__element'); // элементы формы
  var mapFilters = document.querySelector('.map__filters'); // форма с фильтрами
  var addressInput = document.querySelector('#address'); // инпут адреса

  var ClientSize = {
    MIN_Y: 130,
    MAX_Y: 630,
  };

  var pinMain = {// главная метка
    element: document.querySelector('.map__pin--main'),
    width: 65,
    height: 65,
    pointHeight: 15,
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

  var deactivateForm = function () {
    adFormElements.forEach(function (element) {
      element.setAttribute('disabled', 'disabled');
    });
  };

  var deactivatePage = function () {
    offersMap.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adFormHeader.setAttribute('disabled', 'disabled');
    mapFilters.setAttribute('disabled', 'disabled');
    adForm.reset();
    deactivateForm();

    var userPins = offersMap.querySelectorAll('.map__pin:not(.map__pin--main)');
    userPins.forEach(function (pin) {
      pin.classList.add('hidden');
    });

    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }

    addressInput.value = getMainPinCoordinatesValue(pinMain, false);
  };

  deactivatePage();

  var onSuccess = function (data) {
    window.backend.offers = data;
    window.pin.addPins(window.backend.offers);
  };

  var activateForm = function () {
    adFormElements.forEach(function (element) {
      element.removeAttribute('disabled', 'disabled');
    });
  };

  // Функция активации страницы
  var activatePage = function () {
    offersMap.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.backend.load(onSuccess, window.util.onError);
    adFormHeader.removeAttribute('disabled', 'disabled');
    mapFilters.removeAttribute('disabled', 'disabled');
    activateForm();
    addressInput.value = getMainPinCoordinatesValue(pinMain, true);
  };

  // Обработчик активации страницы по нажатию на левую клавишу мыши
  pinMain.element.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      activatePage();
    }
  });

  // Обработчик активации страницы по нажатию на Enter
  pinMain.element.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  });

  // Обработчик перетаскивания главного пина
  var onPinMain = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var clientWidth = offersMap.clientWidth;

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

      addressInput.value = getMainPinCoordinatesValue(pinMain, true);
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

  window.page = {
    deactivatePage: deactivatePage,
  };
})();
