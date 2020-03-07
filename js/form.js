'use strict';

(function () {
  var adForm = document.querySelector('.ad-form'); // форма объявления
  var houseType = document.querySelector('#type'); // выпадающее меню типа жилья
  var formPriceInput = adForm.querySelector('#price'); // инпут цены
  var roomsNumber = adForm.querySelector('#room_number'); // выпадающее меню количества комнат
  var guestsNumber = adForm.querySelector('#capacity'); // выпадающее меню количества гостей
  var timeIn = adForm.querySelector('#timein'); // выпадающее меню времени заезда
  var timeOut = adForm.querySelector('#timeout'); // выпадающее меню времени выезда

  // Валидация цены в зависимости от типа жилья
  var houseTypeMinValue = {
    bungalo: {min: 0},
    flat: {min: 1000},
    house: {min: 5000},
    palace: {min: 10000},
  };

  houseType.addEventListener('change', function () {
    var value = houseTypeMinValue[houseType.value].min;
    formPriceInput.setAttribute('min', value);
    formPriceInput.placeholder = value;
  });

  // Валидация соответствия количества гостей (спальных мест) с количеством комнат
  adForm.addEventListener('change', function () {
    if (roomsNumber.value < guestsNumber.value && roomsNumber.value !== '100' && guestsNumber.value !== '0') {
      guestsNumber.setCustomValidity('Количество гостей не должно превышать количество комнат');
    } else if (roomsNumber.value === '100' && guestsNumber.value !== '0') {
      guestsNumber.setCustomValidity('Данное количество комнат не предназначено для гостей');
    } else if (guestsNumber.value === '0' && roomsNumber.value !== '100') {
      roomsNumber.setCustomValidity('Для нежилого помещения необходимо выбрать максимальное количество комнат');
    } else {
      roomsNumber.setCustomValidity('');
      guestsNumber.setCustomValidity('');
    }
  });

  // Синхронизация времени въезда и времени выезда
  var onCheckInTimeChange = function () {
    timeOut.value = timeIn.value;
  };

  var onCheckOutTimeChange = function () {
    timeIn.value = timeOut.value;
  };

  timeIn.addEventListener('change', onCheckInTimeChange);
  timeOut.addEventListener('change', onCheckOutTimeChange);
})();
