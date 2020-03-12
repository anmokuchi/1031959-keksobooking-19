'use strict';

(function () {
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

  // Функция генерации массива с объявлениями
  var getAdverts = function (options) {
    var offers = [];
    for (var i = 0; i < options.offersAmount; i++) {
      var minX = options.locationMinX;
      var minY = options.locationMinY;
      var maxX = options.locationMaxX;
      var maxY = options.locationMaxY;

      var locationX = window.util.randomIntInclusive(minX, maxX);
      var locationY = window.util.randomIntInclusive(minY, maxY);

      var type = window.util.randomArrayElement(options.offerTypes);
      var checkin = window.util.randomArrayElement(options.offerCheckinTimes);
      var checkout = window.util.randomArrayElement(options.offerCheckoutTimes);
      var features = window.util.randomArray(options.offerFeatures);
      var photos = window.util.randomArray(options.offerPhotos);

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
  var adverts = getAdverts(mock); // тут лежит массив из 8 сгенерированных объявлений

  window.mock = {
    adverts: adverts,
  };
})();
