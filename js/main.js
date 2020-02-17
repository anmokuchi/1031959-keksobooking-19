'use strict';

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
  locationMaxX: 1200,
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

// Функция генерации массива с объектами
var getAdvertsArray = function (options) {
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
  var features = getRandomArrayElement(options.offerFeatures);
  var photos = getRandomArrayElement(options.offerPhotos);

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

// У блока map удаляем map--faded
var offersMap = document.querySelector('.map').classList.remove('map--faded');

// Записываем в переменную шаблон пина
var pinTemplate = document.querySelector('#pin').content.querySelector('button');

var renderPin = function (template, offer, map) {
  var pinElement = template.cloneNode(true);
  var pinWidth = 50;
  var pinHeight = 70;
  var pinPosition = 'left: ' + (offer.location.x - (pinWidth / 2)) + 'px; top: ' + (offer.location.y - pinHeight) + 'px;';

  map.appendChild(pinElement);
  pinElement.style = pinPosition;
  pinElement.querySelector('img').src = offer.author.avatar;
  pinElement.querySelector('img').alt = offer.offer.title;

  return pinElement;
};

var mapPins = document.querySelector('.map__pins');
