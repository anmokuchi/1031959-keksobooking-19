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
var roomsNumber = adForm.querySelector('#room_number'); // выпадающее меню количества комнат
var guestsNumber = adForm.querySelector('#capacity'); // выпадающее меню количества гостей
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // шаблон карточки объявления
var mapFiltersContainer = offersMap.querySelector('.map__filters-container'); // контейнер с фильтрами на карте
var formPriceInput = adForm.querySelector('#price'); // инпут цены
var houseType = document.querySelector('#type'); // выпадающее меню типа жилья
var timeIn = adForm.querySelector('#timein'); // выпадающее меню времени заезда
var timeOut = adForm.querySelector('#timeout'); // выпадающее меню времени выезда

// Нахождение DOM-элемента с картой для определения координат по оси Х
// в зависимости от размера окна
var mapImage = document.querySelector('.map');
var coordinates = mapImage.getBoundingClientRect();

// Данные мока
var mock = {
  offersAmount: 8,
  offerTypes: ['palace', 'flat', 'house', 'bungalo'],
  offerCheckinTimes: ['12:00', '13:00', '14:00'],
  offerCheckoutTimes: ['12:00', '13:00', '14:00'],
  offerFeatures: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  offerPhotos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ],
  locationMinX: 0,
  locationMaxX: coordinates.width,
  locationMinY: 130,
  locationMaxY: 630,
};

// Размеры меток
var pinWidth = 50; // ширина обычной метки
var pinHeight = 70; // высота обычной метки

var pinMain = {// главная метка
  element: document.querySelector('.map__pin--main'),
  width: 65,
  height: 65,
  pointHeight: 15,
};

/* ------------------------------ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ МЕТОК ------------------------------ */

// Функция нахождения рандомного элемента массива
var getRandomArrayElement = function (objects) {
  return objects[Math.floor(Math.random() * objects.length)];
};

// Функция нахождения рандомного числа, включая максимум и минимум
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Алгоритм Фишера-Йетса
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = array[i]; array[i] = array[j]; array[j] = t;
  }
  return array;
};

// Функция генерации массива со случайными свойствами
var getRandomArray = function (options) {
  var optionsCopy = options.slice();
  var optionsCopyRandom = shuffleArray(optionsCopy);
  return optionsCopyRandom.slice(getRandomIntInclusive(0, optionsCopyRandom.length));
};

/* ------------------------------ ГЕНЕРАЦИЯ И ОТРИСОВКА МЕТОК ------------------------------ */

// Функция генерации массива с объектами
var getAdverts = function (options) {
  var offers = [];
  for (var i = 0; i < options.offersAmount; i++) {
    var minX = options.locationMinX;
    var minY = options.locationMinY;
    var maxX = options.locationMaxX;
    var maxY = options.locationMaxY;

    var locationX = getRandomIntInclusive(minX, maxX);
    var locationY = getRandomIntInclusive(minY, maxY);

    var type = getRandomArrayElement(options.offerTypes);
    var checkin = getRandomArrayElement(options.offerCheckinTimes);
    var checkout = getRandomArrayElement(options.offerCheckoutTimes);
    var features = getRandomArray(options.offerFeatures);
    var photos = getRandomArray(options.offerPhotos);

    offers.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png',
      },
      offer: {
        title: 'заголовок предложения',
        address: locationX + ', ' + locationY,
        price: 1000,
        type: type,
        rooms: 3,
        guests: 2,
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: 'строка с описанием',
        photos: photos,
      },
      location: {
        x: locationX,
        y: locationY,
      }
    });
  }
  return offers;
};

// Запись результата работы функции в переменную
var adverts = getAdverts(mock); // тут лежит массив из 8 сгенерированных объектов

// Функция отрисовки метки
var getPin = function (offer, element, width, height) {
  var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

  element.style = pinPosition;
  element.querySelector('img').src = offer.author.avatar;
  element.querySelector('img').alt = offer.offer.title;

  return element;
};

// Функция добавления меток во фрагмент и затем на страницу
var getPins = function () {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    offersMap.appendChild(pinElement);
    pinsFragment.appendChild(getPin(adverts[i], pinElement, pinWidth, pinHeight));
  }
  mapPins.appendChild(pinsFragment);
};

/* ------------------------------ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ КАРТОЧЕК ------------------------------ */

// Функция для создания иконок с фотографиями
var mergePhotosAndCard = function (photos, photosContainer) {
  if (photos === undefined) {
    photosContainer.classList.add('hidden');
  } else {
    for (var j = 0; j < photos.length; j++) {
      var newPopupPhoto = document.createElement('img');
      newPopupPhoto.className = 'popup__photo';
      newPopupPhoto.src = photos[j];
      newPopupPhoto.width = '45';
      newPopupPhoto.height = '40';
      newPopupPhoto.alt = 'Фотография жилья';
      photosContainer.appendChild(newPopupPhoto);
    }
  }
};

// Функция для создания иконок дополнительных особенностей жилья
var mergeFeaturesAndCard = function (features, featuresContainer) {
  if (features === undefined) {
    featuresContainer.classList.add('hidden');
  } else {
    for (var k = 0; k < features.length; k++) {
      var newPopupFeature = document.createElement('li');
      newPopupFeature.className =
        'popup__feature popup__feature--' + features[k];
      featuresContainer.appendChild(newPopupFeature);
    }
  }
};

// Функция склонения числительных
var declineTitle = function (number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

// Объект-словарь с типами жилья
var translate = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

/* ------------------------------ ГЕНЕРАЦИЯ И ОБРАБОТЧИКИ КАРТОЧЕК ------------------------------ */

// Функция отрисовки карточки с объявлением
var getCard = function (offer, element) {
  var roomText = declineTitle(offer.offer.rooms, [' комната', ' комнаты', ' комнат']);
  var guestText = declineTitle(offer.offer.guests, [' гостя', ' гостей', ' гостей']);

  var popupTitle = element.querySelector('.popup__title');
  var popupAddress = element.querySelector('.popup__text--address');
  var popupPrice = element.querySelector('.popup__text--price');
  var popupType = element.querySelector('.popup__type');
  var popupCapacity = element.querySelector('.popup__text--capacity');
  var popupTime = element.querySelector('.popup__text--time');
  var popupDescription = element.querySelector('.popup__description');
  var popupAvatar = element.querySelector('.popup__avatar');
  var popupPhotos = element.querySelector('.popup__photos');
  var popupFeatures = element.querySelector('.popup__features');

  if (offer.offer.title === undefined) {
    popupTitle.classList.add('hidden');
  } else {
    popupTitle.textContent = offer.offer.title;
  }

  if (offer.offer.address === undefined) {
    popupAddress.classList.add('hidden');
  } else {
    popupAddress.textContent = offer.offer.address;
  }

  if (offer.offer.price === undefined) {
    popupPrice.classList.add('hidden');
  } else {
    popupPrice.textContent = offer.offer.price + ' ₽/ночь';
  }

  if (offer.offer.type === undefined) {
    popupType.classList.add('hidden');
  } else {
    popupType.textContent = translate[offer.offer.type];
  }

  if (offer.offer.rooms === undefined && offer.offer.guests === undefined) {
    popupCapacity.classList.add('hidden');
  } else {
    popupCapacity.textContent = offer.offer.rooms + roomText + ' для ' + offer.offer.guests + guestText;
  }

  if (offer.offer.checkin === undefined && offer.offer.checkout === undefined) {
    popupTime.classList.add('hidden');
  } else {
    popupTime.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  }

  if (offer.offer.description === undefined) {
    popupDescription.classList.add('hidden');
  } else {
    popupDescription.textContent = offer.offer.description;
  }

  if (offer.author.avatar === undefined) {
    popupAvatar.classList.add('hidden');
  } else {
    popupAvatar.src = offer.author.avatar;
  }

  popupFeatures.innerText = '';
  mergeFeaturesAndCard(offer.offer.features, popupFeatures);

  popupPhotos.innerText = '';
  mergePhotosAndCard(offer.offer.photos, popupPhotos);

  return element;
};


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
      cardsFragment.appendChild(getCard(adverts[i], cardElement));
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
        cardsFragment.appendChild(getCard(adverts[i], cardElement));
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
    if (evt.key === 'Enter') {
      popup.remove();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      popup.remove();
    }
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

/* ------------------------------ ВАЛИДАЦИЯ ФОРМЫ ------------------------------ */

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
