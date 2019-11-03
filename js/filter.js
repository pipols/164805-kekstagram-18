'use strict';

(function () {
  var NUMBER_RANDOM_PHOTOS = 10;
  var CLASS_OF_THE_ACTIVE_BUTTON = 'img-filters__button--active';

  var imgFilters = document.querySelector('.img-filters');
  var imgFiltersButtons = document.querySelectorAll('.img-filters__button');
  var popularButton = document.querySelector('#filter-popular');
  var randomButton = document.querySelector('#filter-random');
  var discussedButton = document.querySelector('#filter-discussed');

  var makeFiltersButtonActive = function (button) {
    window.util.removeClassFromNodeList(imgFiltersButtons, CLASS_OF_THE_ACTIVE_BUTTON);
    button.classList.add(CLASS_OF_THE_ACTIVE_BUTTON);
  };

  var getRandomData = function () {
    var data = window.download.data.slice();
    var shuffleData = window.util.shuffleArray(data);
    return shuffleData.slice(0, NUMBER_RANDOM_PHOTOS);
  };

  var randomButtonClickHandler = function () {
    var data = getRandomData();
    window.download.filteredData = data;
    makeFiltersButtonActive(randomButton);
    window.debounce(function () {
      window.gallery.renderGallery(data);
    });
  };

  var popularButtonClickHandler = function () {
    var data = window.download.data;
    window.download.filteredData = data;
    makeFiltersButtonActive(popularButton);
    window.debounce(function () {
      window.gallery.renderGallery(data);
    });
  };

  var discussedButtonClickHundler = function () {
    var data = window.download.data.slice();
    data.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    window.download.filteredData = data;
    makeFiltersButtonActive(discussedButton);
    window.debounce(function () {
      window.gallery.renderGallery(data);
    });
  };

  popularButton.addEventListener('click', popularButtonClickHandler);
  randomButton.addEventListener('click', randomButtonClickHandler);
  discussedButton.addEventListener('click', discussedButtonClickHundler);

  var showFilters = function () {
    imgFilters.classList.remove('img-filters--inactive');
  };

  window.filter = {
    showFilters: showFilters
  };
})();
