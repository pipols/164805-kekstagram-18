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
  }
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

var getPhotoDescription = function (amount) {
  var descriptions = [];
  for (var i = 0; i < amount; i++) {
    descriptions.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: '',
      likes: getRandomInteger(DESCRIPTION_TEMPLATE.LIKES.MIN, DESCRIPTION_TEMPLATE.LIKES.MAX) + '',
      comments: getRandomArrayElement(DESCRIPTION_TEMPLATE.COMMENTS)
    });
  }
  return descriptions;
};

var getPhotoNode = function (template, description) {
  var newNode = template.cloneNode(true);
  newNode.querySelector('.picture__img').src = description.url;
  newNode.querySelector('.picture__likes').textContent = description.likes;
  newNode.querySelector('.picture__comments').textContent = description.comments;
  return newNode;
};

var accumulateNode = function (amount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < amount; i++) {
    var newNode = getPhotoNode(pictureTemplate, getPhotoDescription(amount)[i]);
    fragment.appendChild(newNode);
  }
  return fragment;
};

picturesList.appendChild(accumulateNode(AMOUNT_DESCRIPTIONS));
