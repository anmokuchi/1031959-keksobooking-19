'use strict';

var mock = {
  OFFERS_AMOUNT: 8,
  OFFER_TYPES: ['palace', 'flat', 'house', 'bungalo'],
  OFFER_CHECKIN_TIMES: ['12:00', '13:00', '14:00'],
  OFFER_CHECKOUT_TIMES: ['12:00', '13:00', '14:00'],
  OFFER_FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  OFFER_PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ],
  LOCATION_X_MIN: 0,
  LOCATION_X_MAX: 1200,
  LOCATION_Y_MIN: 130,
  LOCATION_Y_MAX: 630,
};

// Функция нахождения рандомного элемента массива
var getRandomArrayElement = function (arrayName) {
  return arrayName[Math.floor(Math.random() * arrayName.length)];
};

// Функция нахождения рандомного числа, включая максимум и минимум
var getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция генерации объекта (мока)
var getAdvertObject = function (options) {
  var avatarNumber = options.avatarNumber;
  var minX = options.minX;
  var minY = options.minY;
  var maxX = options.maxX;
  var maxY = options.maxY;

  var locationX = getRandomIntInclusive(minX, maxX);
  var locationY = getRandomIntInclusive(minY, maxY);

  var type = getRandomArrayElement(options.OFFER_TYPES);
  var checkin = getRandomArrayElement(options.OFFER_CHECKIN_TIMES);
  var checkout = getRandomArrayElement(options.OFFER_CHECKOUT_TIMES);
  var features = getRandomArrayElement(options.OFFER_FEATURES);
  var photos = getRandomArrayElement(options.OFFER_PHOTOS);

  var object = {
    author: {
      avatar: 'img/avatars/user0' + avatarNumber + '.png',
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
  };
  return object;
};

// Функция получения массива сгенерированных объектов
var getAdvertArray = function (offersAmount) {
  var offers = [];
  for (var i = 0; i < offersAmount.length; i++) {
    offers.push(getAdvertObject(mock));
  }
  return offers;
};

// У блока map удаляем map--faded
document.querySelector('.map').classList.remove('map--faded');
