// Media Gallery Controller
require('babel-register');
const React = require('react');
const { renderToString } = require('react-dom/server');
const MediaGallery = require('../assets/src/js/components/media-gallery/MediaGallery').default;

const index = (req, res) => {
  const props = {
    filters: {
      imagesVideosFilter: {
        options: [],
      },
      productLineFilter: {
        name: 'ProductLine',
        active: false,
        options: [],
      },
      colorRangeFilter: {
        name: 'Color Range',
        active: false,
        options: [],
      },
      designStyleFilter: {
        name: 'Design Style',
        active: false,
        options: [],
      },
      roomTypeFilter: {
        name: 'Room Type',
        active: false,
        options: [],
      },
      productRatingImagePath: '',
    },
    mediaItems: [],
    selectedFilters: [],
    modal: {},
  };
  const heading = 'Media Gallery';
  const gallery = renderToString(React.createElement(MediaGallery, props, null));

  res.render('media-gallery/index', {
    heading,
    gallery,
  });
};

module.exports = {
  index,
};
