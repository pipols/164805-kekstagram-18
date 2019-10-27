'use strict';

(function () {
  // просмотр любой фотографии в полноразмерном режиме
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var PICTURE_IMAGE_CLASS_NAME = 'picture__img';
  var PICTURE_CLASS_NAME = 'picture';

  var pictures = document.querySelector('.pictures');
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var bigPicture = document.querySelector('.big-picture');
  var commentsList = document.querySelector('.social__comments');
  var comment = document.querySelector('.social__comment');
  var bigPictureImg = document.querySelector('.big-picture__img img');
  var likesCount = document.querySelector('.likes-count');
  var commentsCount = document.querySelector('.comments-count');
  var socialCaption = document.querySelector('.social__caption');
  var body = document.querySelector('body');

  var renderBigPicture = function (photoData) {
    bigPictureImg.src = photoData.url;
    likesCount.textContent = photoData.likes;
    commentsCount.textContent = photoData.comments.length;
    socialCaption.textContent = photoData.description;

    var fragment = document.createDocumentFragment();

    photoData.comments.forEach(function (elem) {
      var newComment = comment.cloneNode(true);
      newComment.querySelector('.social__picture').src = elem.avatar;
      newComment.querySelector('.social__picture').alt = elem.name;
      newComment.querySelector('.social__text').textContent = elem.message;
      fragment.appendChild(newComment);
    });

    commentsList.innerHTML = '';
    commentsList.appendChild(fragment);
  };

  var pictureImageClickHandler = function (evt) {
    var number;
    if (evt.target.classList.contains(PICTURE_CLASS_NAME)) {
      number = evt.target.querySelector('.picture__img').dataset.imageNumber;
    } else if (evt.target.classList.contains(PICTURE_IMAGE_CLASS_NAME)) {
      number = evt.target.dataset.imageNumber;
    } else {
      return;
    }
    renderBigPicture(window.data.photosData[Number(number)]);
    openBigPicture();
  };

  var openBigPicture = function () {
    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');
    window.addEventListener('keydown', bigPictureEscHandler);
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    window.removeEventListener('keydown', bigPictureEscHandler);
  };

  var bigPictureEscHandler = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closeBigPicture();
    }
  };

  var bigPictureCancelClickHandler = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
  };

  pictures.addEventListener('click', pictureImageClickHandler);
  bigPictureCancel.addEventListener('click', bigPictureCancelClickHandler);
})();
