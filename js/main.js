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

// // Функция отрисовки метки
// var getPin = function (offer, element, width, height) {
//   var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

//   element.style = pinPosition;
//   element.querySelector('img').src = offer.author.avatar;
//   element.querySelector('img').alt = offer.offer.title;

//   return element;
// };

// Функция добавления меток во фрагмент и затем на страницу
var getPins = function () {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < window.data.adverts.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    offersMap.appendChild(pinElement);
    pinsFragment.appendChild(window.pin.newPin(window.data.adverts[i], pinElement, pinWidth, pinHeight));
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
  var roomText = window.util.declineTitle(offer.offer.rooms, [' комната', ' комнаты', ' комнат']);
  var guestText = window.util.declineTitle(offer.offer.guests, [' гостя', ' гостей', ' гостей']);

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
      cardsFragment.appendChild(getCard(window.data.adverts[i], cardElement));
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
        cardsFragment.appendChild(getCard(window.data.adverts[i], cardElement));
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
