'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture').content;
  var picturesList = document.querySelector('.pictures');

  var getPhotoNode = function (template, photoData, counter) {
    var newNode = template.cloneNode(true);
    var img = newNode.querySelector('.picture__img');
    img.src = photoData.url;
    img.dataset.imageNumber = counter;
    newNode.querySelector('.picture__likes').textContent = photoData.likes;
    newNode.querySelector('.picture__comments').textContent = photoData.comments.length;
    return newNode;
  };

  var accumulateNode = function (photosData) {
    var fragment = document.createDocumentFragment();

    photosData.forEach(function (elem, i) {
      var newNode = getPhotoNode(pictureTemplate, elem, i);
      fragment.appendChild(newNode);
    });

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
