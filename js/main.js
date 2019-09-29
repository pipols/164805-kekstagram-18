'use strict';

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

var pictureTemplate = document.querySelector('#picture').content;
var picturesList = document.querySelector('.pictures');

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

var getPhotosData = function (amount) {
  var descriptions = [];
  for (var i = 0; i < amount; i++) {
    descriptions.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'Описание фотографии',
      likes: getRandomInteger(DESCRIPTION_TEMPLATE.LIKES.MIN, DESCRIPTION_TEMPLATE.LIKES.MAX),
      comments: [{
        avatar: 'img/avatar-' + getRandomInteger(1, 6) + '.svg',
        message: getRandomArrayElement(DESCRIPTION_TEMPLATE.COMMENTS),
        name: getRandomArrayElement(DESCRIPTION_TEMPLATE.NAMES)
      }]
    });
  }
  return descriptions;
};

var photosData = getPhotosData(AMOUNT_DESCRIPTIONS);

var getPhotoNode = function (template, photoData) {
  var newNode = template.cloneNode(true);
  newNode.querySelector('.picture__img').src = photoData.url;
  newNode.querySelector('.picture__likes').textContent = photoData.likes;
  newNode.querySelector('.picture__comments').textContent = photoData.comments.length;
  return newNode;
};

var accumulateNode = function (amount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < amount; i++) {
    var newNode = getPhotoNode(pictureTemplate, photosData[i]);
    fragment.appendChild(newNode);
  }
  return fragment;
};

picturesList.appendChild(accumulateNode(AMOUNT_DESCRIPTIONS));

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var showBigPicture = function (photoData) {
  document.querySelector('.big-picture__img').src = photoData.url;
  document.querySelector('.likes-count').textContent = photoData.likes;
  document.querySelector('.comments-count').textContent = photoData.comments.length;
  document.querySelector('.social__caption').textContent = photoData.description;

  var commentsItems = document.querySelectorAll('.social__comment');

  commentsItems.forEach(function (elem, i) {
    if (typeof photoData.comments[i] === 'object') {
      elem.querySelector('.social__picture').src = photoData.comments[i].avatar;
      elem.querySelector('.social__picture').alt = photoData.comments[i].name;
      elem.querySelector('.social__text').textContent = photoData.comments[i].message;
    }
  });
};

showBigPicture(photosData[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
