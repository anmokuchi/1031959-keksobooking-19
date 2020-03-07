'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // Функция нахождения рандомного элемента массива
  var randomArrayElement = function (objects) {
    return objects[Math.floor(Math.random() * objects.length)];
  };

  // Функция нахождения рандомного числа, включая максимум и минимум
  var randomIntInclusive = function (min, max) {
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
  var randomArray = function (options) {
    var optionsCopy = options.slice();
    var optionsCopyRandom = shuffleArray(optionsCopy);
    return optionsCopyRandom.slice(randomIntInclusive(0, optionsCopyRandom.length));
  };

  // Функция склонения числительных
  var declineTitle = function (number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  };

  // Обработчик по нажатию Escape
  var isEscEvent = function (evt, action) {
    if (evt.key === 'Escape') {
      action();
    }
  };

  // Обработчик по скрытию окна при нажатии Escape
  var isEscRemoveEvent = function (evt, target) {
    if (evt.keyCode === ESC_KEYCODE) {
      target.remove();
    }
  };

  // Обработчик по нажатию Enter
  var isEnterEvent = function (evt, action) {
    if (evt.key === 'Enter') {
      action();
    }
  };

  // Обработчик по скрытию окна при нажатии Enter
  var isEnterRemoveEvent = function (evt, target) {
    if (evt.key === 'Enter') {
      target.remove();
    }
  };

  // Обработчик по нажатию ЛКМ
  var isLeftMouseButtonEvent = function (evt, action) {
    if (evt.button === 0) {
      action();
    }
  };

  window.util = {
    randomArrayElement: randomArrayElement,
    randomIntInclusive: randomIntInclusive,
    randomArray: randomArray,
    declineTitle: declineTitle,
    isEscEvent: isEscEvent,
    isEscRemoveEvent: isEscRemoveEvent,
    isEnterEvent: isEnterEvent,
    isEnterRemoveEvent: isEnterRemoveEvent,
    isLeftMouseButtonEvent: isLeftMouseButtonEvent,
  };
})();

