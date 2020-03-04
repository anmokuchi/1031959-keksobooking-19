'use strict';

// Необходимые клавиши
var MOUSE_MAIN_BUTTON = 0; // Левая кнопка мыши
var ENTER_KEY = 'Enter';

// Необходимые DOM-элементы
var offersMap = document.querySelector('.map'); // карта с объявлениями
var pinTemplate = document.querySelector('#pin').content.querySelector('button'); // шаблон метки объявления
var mapPins = document.querySelector('.map__pins'); // элемент, куда добавлять метки объявлений
var adForm = document.querySelector('.ad-form'); // форма объявления
var adFormHeader = document.querySelector('.ad-form-header'); // заголовок формы
var adFormElements = document.querySelectorAll('.ad-form__element'); // элементы формы
var mapFilters = document.querySelector('.map__filters'); // форма с фильтрами
var addressInput = document.querySelector('#address'); // инпут адреса
var pinMain = document.querySelector('.map__pin--main'); // главная метка
var formTitleInput = adForm.querySelector('#title'); // инпут заголовка жилья
var roomsNumber = adForm.querySelector('#room_number'); // выпадающее меню количества комнат
var guestsNumber = adForm.querySelector('#capacity'); // выпадающее меню количества гостей

// Переменные для валидации
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

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
var PIN_MAIN_WIDTH = 62; // ширина главной метки
var PIN_MAIN_HEIGHT = 62; // высота главной метки
var PIN_MAIN_LEFT = parseInt(pinMain.style.left, 10); // отступ главной метки от левого края
var PIN_MAIN_TOP = parseInt(pinMain.style.top, 10); // отступ главной метки от верха
var PIN_MAIN_POINT_HEIGHT = 22; // высота острия метки

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

// Функция дезактивации массива элементов
var disableElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', 'disabled');
  }
};

// Функция активации массива элементов
var enableElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled', 'disabled');
  }
};

// Функция получения координат главной метки в неактивном состоянии (координаты центра метки)
var getMainPinCoordinatesInactive = function (left, width, top, height) {
  var pinMainLocationX = left + width / 2;
  var pinMainLocationY = top + height / 2;
  return pinMainLocationX + ', ' + pinMainLocationY;
};

// Функция получения координат главной метки в активном состоянии (координаты острого конца метки)
var getMainPinCoordinatesActive = function (left, width, top, height, pointHeight) {
  var pinMainLocationX = left + width / 2;
  var pinMainLocationY = top + height + pointHeight;
  return pinMainLocationX + ', ' + pinMainLocationY;
};

// Добавление атрибута disabled для элементов fieldset (блокируются поля формы в группе)
adFormHeader.setAttribute('disabled', 'disabled'); // для заголовка формы
disableElements(adFormElements); // для элементов формы
mapFilters.setAttribute('disabled', 'disabled'); // для формы с фильтрами

// Заполнение поля адреса координатами центра метки в неактивном состоянии
addressInput.value = getMainPinCoordinatesInactive(PIN_MAIN_LEFT, PIN_MAIN_WIDTH, PIN_MAIN_TOP, PIN_MAIN_HEIGHT);

// Функция активации страницы
var activatePage = function () {
  offersMap.classList.remove('map--faded'); // удаление класса map--faded у карты с объявлениями для ее активации
  adForm.classList.remove('ad-form--disabled'); // удаление класса ad-form--disabled у формы объявления для ее активации
  getPins(); // вызов функции добавления меток
  adFormHeader.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с заголовка формы
  enableElements(adFormElements); // удаление атрибута disabled с элементов формы
  mapFilters.removeAttribute('disabled', 'disabled'); // удаление атрибута disabled с формы с фильтрами
  addressInput.value = getMainPinCoordinatesActive(PIN_MAIN_LEFT, PIN_MAIN_WIDTH, PIN_MAIN_TOP, PIN_MAIN_HEIGHT, PIN_MAIN_POINT_HEIGHT);
};

// Обработчик активации страницы по нажатию на левую клавишу мыши
pinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === MOUSE_MAIN_BUTTON) {
    activatePage();
  }
});

// Обработчик активации страницы по нажатию на Enter
pinMain.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage();
  }
});

// Валидация заголовка жилья
formTitleInput.addEventListener('invalid', function () {
  if (formTitleInput.validity.tooShort) {
    formTitleInput.setCustomValidity('Заголовок должен состоять минимум из ' + MIN_TITLE_LENGTH + ' символов');
  } else if (formTitleInput.validity.tooLong) {
    formTitleInput.setCustomValidity('Заголовок не должен превышать ' + MAX_TITLE_LENGTH + 'символов');
  } else if (formTitleInput.validity.valueMissing) {
    formTitleInput.setCustomValidity('Обязательное поле');
  } else {
    formTitleInput.setCustomValidity('');
  }
});

formTitleInput.addEventListener('input', function () {
  if (formTitleInput.value.length < MIN_TITLE_LENGTH) {
    formTitleInput.setCustomValidity(
        'Заголовок должен состоять минимум из ' + MIN_TITLE_LENGTH + ' символов'
    );
  } else if (formTitleInput.value.length > MAX_TITLE_LENGTH) {
    formTitleInput.setCustomValidity(
        'Заголовок не должен превышать ' + MAX_TITLE_LENGTH + ' символов'
    );
  } else {
    formTitleInput.setCustomValidity('');
  }
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

/* // Записываем в переменную шаблон карточки объявления
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

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
    popupPrice.textContent = offer.offer.price + '₽/ночь';
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

// Добавляем карточку с объявлением во фрагмент по шаблону
var cardElement = cardTemplate.cloneNode(true);
var cardFragment = document.createDocumentFragment();
cardFragment.appendChild(getCard(adverts[0], cardElement));

// Записываем в переменную элемент, перед которым поместить фрагмент
var filtersContainer = offersMap.querySelector('.map__filters-container');

// Помещаем фрагмент
offersMap.insertBefore(cardFragment, filtersContainer); */
