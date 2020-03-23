'use strict';

(function () {
  var selector = {
    adForm: '.ad-form',
    houseType: '#type',
    price: '#price',
    roomNumber: '#room_number',
    capacity: '#capacity',
    timeIn: '#timein',
    timeOut: '#timeout',
  };

  var domElement = {
    adForm: document.querySelector(selector.adForm),
    houseType: document.querySelector(selector.houseType),
    formPriceInput: document.querySelector(selector.price),
    roomsNumber: document.querySelector(selector.roomNumber),
    guestsNumber: document.querySelector(selector.capacity),
    timeIn: document.querySelector(selector.timeIn),
    timeOut: document.querySelector(selector.timeOut),
  };

  /* ------------------------------ ВАЛИДАЦИЯ ЦЕНЫ И ТИПА ЖИЛЬЯ ------------------------------ */

  var houseTypeMinValue = {
    bungalo: {min: 0},
    flat: {min: 1000},
    house: {min: 5000},
    palace: {min: 10000},
  };

  domElement.houseType.addEventListener('change', function () {
    var value = houseTypeMinValue[domElement.houseType.value].min;
    domElement.formPriceInput.setAttribute('min', value);
    domElement.formPriceInput.placeholder = value;
  });

  /* ------------------------------ ВАЛИДАЦИЯ КОЛИЧЕСТВА КОМНАТ И КОЛИЧЕСТВА ГОСТЕЙ ------------------------------ */

  var roomSetting = {
    1: {
      minGuest: 1,
      maxGuest: 1,
      errorMessage: 'Выберите «для 1 гостя»',
    },
    2: {
      minGuest: 1,
      maxGuest: 2,
      errorMessage: 'Выберите «для 2 гостей» или «для 1 гостя»',
    },
    3: {
      minGuest: 1,
      maxGuest: 3,
      errorMessage: 'Выберите «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
    },
    100: {
      minGuest: 0,
      maxGuest: 0,
      errorMessage: 'Выберите «не для гостей»',
    },
  };

  var validateRoomsNumber = function () {
    var roomValue = domElement.roomsNumber.value;
    var guestValue = domElement.guestsNumber.value;
    var maxGuest = roomSetting[roomValue].maxGuest;
    var minGuest = roomSetting[roomValue].minGuest;

    if (guestValue >= minGuest && guestValue <= maxGuest) {
      domElement.guestsNumber.setCustomValidity('');
    } else {
      domElement.guestsNumber.setCustomValidity(roomSetting[roomValue].errorMessage);
    }
  };

  validateRoomsNumber();

  domElement.roomsNumber.addEventListener('change', validateRoomsNumber);
  domElement.guestsNumber.addEventListener('change', validateRoomsNumber);

  /* ------------------------------ СИНХРОНИЗАЦИЯ ВРЕМЕНИ ВЪЕЗДА И ВРЕМЕНИ ВЫЕЗДА ------------------------------ */

  var onCheckInTimeChange = function () {
    domElement.timeOut.value = domElement.timeIn.value;
  };

  var onCheckOutTimeChange = function () {
    domElement.timeIn.value = domElement.timeOut.value;
  };

  domElement.timeIn.addEventListener('change', onCheckInTimeChange);
  domElement.timeOut.addEventListener('change', onCheckOutTimeChange);
})();
