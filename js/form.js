'use strict';

(function () {
  // Необходимые DOM-элементы
  var adForm = document.querySelector('.ad-form'); // форма объявления
  var houseType = document.querySelector('#type'); // выпадающее меню типа жилья
  var formPriceInput = adForm.querySelector('#price'); // инпут цены
  var roomsNumber = adForm.querySelector('#room_number'); // выпадающее меню количества комнат
  var guestsNumber = adForm.querySelector('#capacity'); // выпадающее меню количества гостей
  var timeIn = adForm.querySelector('#timein'); // выпадающее меню времени заезда
  var timeOut = adForm.querySelector('#timeout'); // выпадающее меню времени выезда
  var resetButton = adForm.querySelector('.ad-form__reset');

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

  var roomsNumberValidity = function () {
    var roomValue = roomsNumber.value;
    var guestValue = guestsNumber.value;
    var maxGuest = roomSetting[roomValue].maxGuest;
    var minGuest = roomSetting[roomValue].minGuest;
    if (guestValue >= minGuest && guestValue <= maxGuest) {
      guestsNumber.setCustomValidity('');
    } else {
      guestsNumber.setCustomValidity(roomSetting[roomValue].errorMessage);
    }
  };

  roomsNumberValidity();

  roomsNumber.addEventListener('change', roomsNumberValidity);
  guestsNumber.addEventListener('change', roomsNumberValidity);

  // Синхронизация времени въезда и времени выезда
  var onCheckInTimeChange = function () {
    timeOut.value = timeIn.value;
  };

  var onCheckOutTimeChange = function () {
    timeIn.value = timeOut.value;
  };

  timeIn.addEventListener('change', onCheckInTimeChange);
  timeOut.addEventListener('change', onCheckOutTimeChange);

  // Сообщение об успешной отправке формы
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successElement = successTemplate.cloneNode(true);
  var onSuccess = function () {
    document.body.appendChild(successElement);
    window.page.deactivatePage();
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
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorElement = errorTemplate.cloneNode(true);
  var onError = function () {
    document.body.appendChild(errorElement);
    addListenersOnErrorMessage();
  };

  var removeErrorMessage = function () {
    document.body.removeChild(errorElement);
  };

  var addListenersOnErrorMessage = function () {
    var errorButton = document.querySelector('.error__button');

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

  var onResetButtonClick = function () {
    window.page.deactivatePage();
  };

  resetButton.addEventListener('click', onResetButtonClick);

  resetButton.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      window.page.deactivatePage();
    }
  });

  // Обработчик отправки данных
  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), onSuccess, onError);
    evt.preventDefault();
  });
})();
