'use strict';

(function () {
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

  // Внешний вид сообщения об ошибке при загрузке с сервера (временно здесь и в таком виде)
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var onError = function (message) {
    var errorElement = errorTemplate.cloneNode(true);
    var errorMessage = errorElement.querySelector('.error__message');
    errorMessage.textContent = message;
    document.body.appendChild(errorElement);
  };

  window.util = {
    randomArrayElement: randomArrayElement,
    randomIntInclusive: randomIntInclusive,
    randomArray: randomArray,
    declineTitle: declineTitle,
    onError: onError,
  };
})();

