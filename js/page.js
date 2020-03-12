'use strict';

(function () {
  // Необходимые DOM-элементы
  var offersMap = document.querySelector('.map'); // карта с объявлениями
  var adForm = document.querySelector('.ad-form'); // форма объявления
  var adFormHeader = document.querySelector('.ad-form-header'); // заголовок формы
  var adFormElements = document.querySelectorAll('.ad-form__element'); // элементы формы
  var mapFilters = document.querySelector('.map__filters'); // форма с фильтрами
  var addressInput = document.querySelector('#address'); // инпут адреса

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

  // Добавление атрибута disabled для элементов fieldset (блокируются поля формы в группе)
  adFormHeader.setAttribute('disabled', 'disabled'); // для заголовка формы
  mapFilters.setAttribute('disabled', 'disabled'); // для формы с фильтрами
  adFormElements.forEach(function (element) { // для всех элементов формы
    element.setAttribute('disabled', 'disabled');
  });

  // Заполнение поля адреса координатами центра метки в неактивном состоянии
  addressInput.value = getMainPinCoordinatesValue(pinMain, false);

  // Функция активации страницы
  var activatePage = function () {
    offersMap.classList.remove('map--faded'); // удаление класса map--faded у карты с объявлениями для ее активации
    adForm.classList.remove('ad-form--disabled'); // удаление класса ad-form--disabled у формы объявления для ее активации
    window.pin.addPins(); // вызов функции добавления меток
    addressInput.value = getMainPinCoordinatesValue(pinMain, true); // получение координат метки
    adFormHeader.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с заголовка формы
    mapFilters.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с формы с фильтрами
    adFormElements.forEach(function (element) { // удаление атрибута disabled с элементов формы
      element.removeAttribute('disabled', 'disabled');
    });
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
})();
