'use strict';

(function () {
  var selector = {
    map: '.map',
    cardTemplate: '#card',
    mapCard: '.map__card',
    mapFiltersContainer: '.map__filters-container',
    popup: '.popup',
    popupClose: '.popup__close',
  };

  var cssClass = {
    mapPinActive: 'map__pin--active',
    mapPinMapPinActive: 'map__pin map__pin--active',
    hidden: 'hidden',
  };

  var domElement = {
    offersMap: document.querySelector(selector.map),
    cardTemplate: document.querySelector(selector.cardTemplate).content.querySelector(selector.mapCard),
    mapFiltersContainer: document.querySelector(selector.mapFiltersContainer),
  };

  // Объект-словарь с типами жилья
  var translateRoomTypeToCyrillic = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  /* ------------------------------ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ КАРТОЧЕК ------------------------------ */

  // Функция для создания иконок с фотографиями
  var mergePhotosAndCard = function (photos, photosContainer) {
    if (photos === undefined) {
      photosContainer.classList.add(cssClass.hidden);
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
      featuresContainer.classList.add(cssClass.hidden);
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

  /* ------------------------------ СОЗДАНИЕ КАРТОЧКИ ПО ШАБЛОНУ ------------------------------ */

  var getCard = function (offer) {
    var roomText = declineTitle(offer.offer.rooms, [' комната', ' комнаты', ' комнат']);
    var guestText = declineTitle(offer.offer.guests, [' гостя', ' гостей', ' гостей']);

    var cardElement = domElement.cardTemplate.cloneNode(true);
    var popupTitle = cardElement.querySelector('.popup__title');
    var popupAddress = cardElement.querySelector('.popup__text--address');
    var popupPrice = cardElement.querySelector('.popup__text--price');
    var popupType = cardElement.querySelector('.popup__type');
    var popupCapacity = cardElement.querySelector('.popup__text--capacity');
    var popupTime = cardElement.querySelector('.popup__text--time');
    var popupDescription = cardElement.querySelector('.popup__description');
    var popupAvatar = cardElement.querySelector('.popup__avatar');
    var popupPhotos = cardElement.querySelector('.popup__photos');
    var popupFeatures = cardElement.querySelector('.popup__features');

    if (offer.offer.title === undefined) {
      popupTitle.classList.add(cssClass.hidden);
    } else {
      popupTitle.textContent = offer.offer.title;
    }

    if (offer.offer.address === undefined) {
      popupAddress.classList.add(cssClass.hidden);
    } else {
      popupAddress.textContent = offer.offer.address;
    }

    if (offer.offer.price === undefined) {
      popupPrice.classList.add(cssClass.hidden);
    } else {
      popupPrice.textContent = offer.offer.price + ' ₽/ночь';
    }

    if (offer.offer.type === undefined) {
      popupType.classList.add(cssClass.hidden);
    } else {
      popupType.textContent = translateRoomTypeToCyrillic[offer.offer.type];
    }

    if (offer.offer.rooms === undefined && offer.offer.guests === undefined) {
      popupCapacity.classList.add(cssClass.hidden);
    } else {
      popupCapacity.textContent = offer.offer.rooms + roomText + ' для ' + offer.offer.guests + guestText;
    }

    if (offer.offer.checkin === undefined && offer.offer.checkout === undefined) {
      popupTime.classList.add(cssClass.hidden);
    } else {
      popupTime.textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
    }

    if (offer.offer.description === undefined) {
      popupDescription.classList.add(cssClass.hidden);
    } else {
      popupDescription.textContent = offer.offer.description;
    }

    if (offer.author.avatar === undefined) {
      popupAvatar.classList.add(cssClass.hidden);
    } else {
      popupAvatar.src = offer.author.avatar;
    }

    popupFeatures.innerText = '';
    mergeFeaturesAndCard(offer.offer.features, popupFeatures);

    popupPhotos.innerText = '';
    mergePhotosAndCard(offer.offer.photos, popupPhotos);

    return cardElement;
  };

  /* ------------------------------ ОТКРЫТИЕ И ЗАКРЫТИЕ КАРТОЧКИ ------------------------------ */

  // Функция показа карточки
  var showCard = function (index) {
    closeCard();

    var offerData = window.data[index];
    if (!offerData) {
      return;
    }

    var cardsFragment = document.createDocumentFragment();
    cardsFragment.appendChild(getCard(offerData));
    domElement.offersMap.insertBefore(cardsFragment, domElement.mapFiltersContainer);

    addListenersOnPopup();
  };

  // Функция закрытия карточки
  var closeCard = function () {
    var popup = document.querySelector(selector.popup);
    if (popup) {
      popup.remove();
    }
  };

  // Добавление обработчиков на карточку объявления
  var addListenersOnPopup = function () {
    var popupClose = document.querySelector(selector.popupClose);

    popupClose.addEventListener('click', function () {
      closeCard();
      window.pin.cleanAllPinActiveClass();
    });

    popupClose.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        closeCard();
        window.pin.cleanAllPinActiveClass();
      }
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        closeCard();
        window.pin.cleanAllPinActiveClass();
      }
    });
  };

  window.card = {
    showCard: showCard,
    closeCard: closeCard,
  };
})();
