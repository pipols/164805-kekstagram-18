'use strict';

(function () {
  var AMOUNT_DESCRIPTIONS = 25;

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesList = document.querySelector('.pictures');

  var getPhotoNode = function (template, photoData, counter) {
    var newNode = template.cloneNode(true);
    newNode.querySelector('.picture__img').src = photoData.url;
    newNode.querySelector('.picture__img').dataset.imageNumber = counter;
    newNode.querySelector('.picture__likes').textContent = photoData.likes;
    newNode.querySelector('.picture__comments').textContent = photoData.comments.length;
    return newNode;
  };

  var accumulateNode = function (photosData, amount) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < amount; i++) {
      var newNode = getPhotoNode(pictureTemplate, photosData[i], i);
      fragment.appendChild(newNode);
    }
    return fragment;
  };

  var renderGallery = function (data) {
    var picturesNode = accumulateNode(data, AMOUNT_DESCRIPTIONS);
    picturesList.appendChild(picturesNode);
  };

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');

  window.gallery = {
    renderGallery: renderGallery
  };
})();
