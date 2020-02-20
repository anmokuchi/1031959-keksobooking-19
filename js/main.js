'use strict';

// Нахождение DOM-элемента с картой для определения координат по оси Х
// в зависимости от размера окна
var mapImage = document.querySelector('.map');
var coordinates = mapImage.getBoundingClientRect();

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

// Функция генерации массива со случайными свойствами
var getRandomArray = function (options) {
  var features = [];
  var max = getRandomIntInclusive(1, options.length);
  options.sort();
  for (var i = 0; i < max; i++) {
    features.push(' ' + options[i]);
  }
  return features;
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
var renderPin = function (offer, template, width, height) {
  var pinElement = template.cloneNode(true);
  var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

  offersMap.appendChild(pinElement);
  pinElement.style = pinPosition;
  pinElement.querySelector('img').src = offer.author.avatar;
  pinElement.querySelector('img').alt = offer.offer.title;

  return pinElement;
};

// Функция добавления меток во фрагмент и затем на страницу
var addPin = function (options, template, width, height) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < options.length; i++) {
    fragment.appendChild(renderPin(options[i], template, width, height));
  }
  mapPins.appendChild(fragment);
};

// Вызов функции добавления меток
addPin(adverts, pinTemplate, pinWidth, pinHeight);

// Записываем в переменную шаблон карточки объявления
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

// Функция определения типа жилья
var getOfferType = function (offer) {
  if (offer.offer.type === 'palace') {
    var houseType = 'Дворец';
  } else if (offer.offer.type === 'flat') {
    houseType = 'Квартира';
  } else if (offer.offer.type === 'house') {
    houseType = 'Дом';
  } else if (offer.offer.type === 'bungalo') {
    houseType = 'Бунгало';
  }
  return houseType;
};

// Функция для создания иконок с фотографиями
var createPhotos = function (photos, template) {
  var fragment = document.createDocumentFragment();
  photos.forEach(function (src) {
    var img = template.cloneNode(true);
    img.src = src;
    fragment.appendChild(img);
  });
  return fragment;
};

// Функция отрисовки окна с объявлением
var renderCard = function (offer, template) {
  var houseType = getOfferType(offer);

  var roomText = ' комната';
  if (offer.offer.rooms > 1 && offer.offer.rooms < 5) {
    roomText = ' комнаты';
  } else if (offer.offer.rooms >= 5) {
    roomText = ' комнат';
  }

  var guestText = ' гостей';
  if (offer.offer.guests === 1) {
    guestText = ' гостя';
  }

  var cardElement = template.cloneNode(true);

  offersMap.appendChild(cardElement);
  cardElement.querySelector('.popup__title').textContent = offer.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = houseType;
  cardElement.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + roomText + ' для ' + offer.offer.guests + guestText;
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = offer.offer.features;
  cardElement.querySelector('.popup__description').textContent = offer.offer.description;
  cardElement.querySelector('.popup__avatar').src = offer.author.avatar;

  var popupPhotos = cardElement.querySelector('.popup__photos');
  var photoTemplate = popupPhotos.querySelector('img').cloneNode(true);
  popupPhotos.innerText = '';
  popupPhotos.appendChild(createPhotos(offer.offer.photos, photoTemplate));

  return cardElement;
};
