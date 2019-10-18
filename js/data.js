'use strict';

(function () {
  var DESCRIPTION_TEMPLATE = {
    COMMENTS:
    ['Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
    LIKES: {
      MIN: 15,
      MAX: 200
    },
    NAMES: ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон']
  };

  var AMOUNT_DESCRIPTIONS = 25;

  var getPhotosData = function (amount) {
    var descriptions = [];
    for (var i = 0; i < amount; i++) {
      descriptions.push({
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'Описание фотографии',
        likes: window.util.getRandomInteger(DESCRIPTION_TEMPLATE.LIKES.MIN, DESCRIPTION_TEMPLATE.LIKES.MAX),
        comments: [{
          avatar: 'img/avatar-' + window.util.getRandomInteger(1, 6) + '.svg',
          message: window.util.getRandomArrayElement(DESCRIPTION_TEMPLATE.COMMENTS),
          name: window.util.getRandomArrayElement(DESCRIPTION_TEMPLATE.NAMES)
        }]
      });
    }
    return descriptions;
  };

  var photosData = getPhotosData(AMOUNT_DESCRIPTIONS);

  window.data = {
    photosData: photosData
  };
})();
