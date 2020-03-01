'use strict';

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

// Объект-словарь с типами жилья
var translate = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

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

// Записываем результат работы функции в переменную
var adverts = getAdverts(mock); // тут лежит массив из 8 сгенерированных объектов

// У блока map удаляем map--faded
var offersMap = document.querySelector('.map');
offersMap.classList.remove('map--faded');

// Записываем в переменную шаблон метки объявления
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('button');

// Размеры метки
var pinWidth = 50;
var pinHeight = 70;

// Находим элемент, куда добавлять метки объявлений
var mapPins = document.querySelector('.map__pins');

// Функция отрисовки метки
var getPin = function (offer, element, width, height) {
  var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

  element.style = pinPosition;
  element.querySelector('img').src = offer.author.avatar;
  element.querySelector('img').alt = offer.offer.title;

  return element;
};

// Цикл добавления меток во фрагмент и затем на страницу
var pinsFragment = document.createDocumentFragment();
for (var i = 0; i < adverts.length; i++) {
  var pinElement = pinTemplate.cloneNode(true);
  offersMap.appendChild(pinElement);
  pinsFragment.appendChild(getPin(adverts[i], pinElement, pinWidth, pinHeight));
}
mapPins.appendChild(pinsFragment);

// Записываем в переменную шаблон карточки объявления
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

// Проверка данных и скрытие блока при их отсутствии
var checkElementAvilability = function (element, elementContainer) {
  if (element === undefined) {
    elementContainer.classList.add('hidden');
  }
};

// Функция для создания иконок с фотографиями
var getPhotos = function (photos, photosContainer) {
  checkElementAvilability(photos, photosContainer);
  for (var j = 0; j < photos.length; j++) {
    var newPopupPhoto = document.createElement('img');
    newPopupPhoto.className = 'popup__photo';
    newPopupPhoto.src = photos[j];
    newPopupPhoto.width = '45';
    newPopupPhoto.height = '40';
    newPopupPhoto.alt = 'Фотография жилья';
    photosContainer.appendChild(newPopupPhoto);
  }
};

// Функция для создания иконок дополнительных особенностей жилья
var getFeatures = function (features, featuresContainer) {
  checkElementAvilability(features, featuresContainer);
  for (var k = 0; k < features.length; k++) {
    var newPopupFeature = document.createElement('li');
    newPopupFeature.className =
        'popup__feature popup__feature--' + features[k];
    featuresContainer.appendChild(newPopupFeature);
  }
};

// Функция склонения числительных
var declineTitle = function (number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles [(number % 100 > 4 && number % 100 < 20) ? 2 : cases [(number % 10 < 5) ? number % 10 : 5]];
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

  checkElementAvilability(offer.offer.title, popupTitle);
  popupTitle.textContent = offer.offer.title;

  checkElementAvilability(offer.offer.address, popupAddress);
  popupAddress.textContent = offer.offer.address;

  checkElementAvilability(offer.offer.price, popupPrice);
  popupPrice.textContent = offer.offer.price + '₽/ночь';

  checkElementAvilability(offer.offer.type, popupType);
  popupType.textContent = translate[offer.offer.type];

  checkElementAvilability(offer.offer.rooms, popupCapacity); // тут есть третий параметр, что делать?
  popupCapacity.textContent = offer.offer.rooms + roomText + ' для ' + offer.offer.guests + guestText;

  checkElementAvilability(offer.offer.checkin, popupTime); // и тут есть третий параметр, куда его деть?
  popupTime.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;

  checkElementAvilability(offer.offer.description, popupDescription);
  popupDescription.textContent = offer.offer.description;

  // checkElementAvilability(offer.offer.avatar, popupAvatar); // если использовать эту проверку, аватар исчезает; почему и что делать?
  popupAvatar.src = offer.author.avatar;

  popupFeatures.innerText = '';
  getFeatures(offer.offer.features, popupFeatures);

  popupPhotos.innerText = '';
  getPhotos(offer.offer.photos, popupPhotos);

  return element;
};

// Добавляем карточку с объявлением во фрагмент по шаблону
var cardElement = cardTemplate.cloneNode(true);
var cardFragment = document.createDocumentFragment();
cardFragment.appendChild(getCard(adverts[0], cardElement));

// Записываем в переменную элемент, перед которым поместить фрагмент
var filtersContainer = offersMap.querySelector('.map__filters-container');

// Помещаем фрагмент
offersMap.insertBefore(cardFragment, filtersContainer);
