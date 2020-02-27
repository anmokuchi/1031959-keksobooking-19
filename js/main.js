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
var shuffle = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = array[i]; array[i] = array[j]; array[j] = t;
  }
  return array;
};

// Функция генерации массива со случайными свойствами
var getRandomArray = function (options) {
  var optionsCopy = options.slice();
  var optionsCopyRandom = shuffle(optionsCopy);
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
var renderPin = function (map, offer, template, width, height) {
  var pinElement = template.cloneNode(true);
  var pinPosition = 'left: ' + (offer.location.x - (width / 2)) + 'px; top: ' + (offer.location.y - height) + 'px;';

  map.appendChild(pinElement);
  pinElement.style = pinPosition;
  pinElement.querySelector('img').src = offer.author.avatar;
  pinElement.querySelector('img').alt = offer.offer.title;

  return pinElement;
};

// Цикл добавления меток во фрагмент и затем на страницу
var pinsFragment = document.createDocumentFragment();
for (var i = 0; i < adverts.length; i++) {
  pinsFragment.appendChild(renderPin(offersMap, adverts[i], pinTemplate, pinWidth, pinHeight));
}
mapPins.appendChild(pinsFragment);

// Записываем в переменную шаблон карточки объявления
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

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

// Функция склонения числительных
var declOfNum = function (number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles [(number % 100 > 4 && number % 100 < 20) ? 2 : cases [(number % 10 < 5) ? number % 10 : 5]];
};

// Функция отрисовки окна с объявлением
var renderCard = function (offer, template) {
  var roomText = declOfNum(offer.offer.rooms, [' комната', ' комнаты', ' комнат']);
  var guestText = declOfNum(offer.offer.guests, [' гостя', ' гостей', ' гостей']);

  var cardElement = template.cloneNode(true);

  offersMap.appendChild(cardElement);
  cardElement.querySelector('.popup__title').textContent = offer.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = translate[offer.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + roomText + ' для ' + offer.offer.guests + guestText;
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = offer.offer.features.join(', ');
  cardElement.querySelector('.popup__description').textContent = offer.offer.description;
  cardElement.querySelector('.popup__avatar').src = offer.author.avatar;

  var popupPhotos = cardElement.querySelector('.popup__photos');
  var photoTemplate = popupPhotos.querySelector('img').cloneNode(true);
  popupPhotos.innerText = '';
  popupPhotos.appendChild(createPhotos(offer.offer.photos, photoTemplate));

  return cardElement;
};

// Записываем в переменную результат работы функции отрисовки объявления
var firstCard = renderCard(adverts[0], cardTemplate);

// Добавлен фрагмент для вставки элементов
var cardFragment = document.createDocumentFragment();
cardFragment.appendChild(firstCard);

// Записываем в переменную элемент, перед которым поместить фрагмент
var filtersContainer = offersMap.querySelector('.map__filters-container');

// Помещаем фрагмент
offersMap.insertBefore(cardFragment, filtersContainer);
