'use strict';

(function () {
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

  window.card = {
    getCard: getCard,
  };
})();