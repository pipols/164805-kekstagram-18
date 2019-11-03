'use strict';

(function () {

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

  var accumulateNode = function (photosData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photosData.length; i++) {
      var newNode = getPhotoNode(pictureTemplate, photosData[i], i);
      fragment.appendChild(newNode);
    }
    return fragment;
  };

  var clearPicturesList = function () {
    window.util.clearNodeList('.picture');
  };

  var renderGallery = function (data) {
    clearPicturesList();
    var picturesNode = accumulateNode(data);
    picturesList.appendChild(picturesNode);
  };

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');

  window.gallery = {
    renderGallery: renderGallery
  };
})();
