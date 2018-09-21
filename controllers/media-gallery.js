// Media Gallery Controller
require('babel-register');
const React = require('react');
const { renderToString } = require('react-dom/server');
const MediaGallery = require('../assets/src/js/components/media-gallery/MediaGallery').default;
const mysql = require('mysql2/promise');
const config = require('../config/database-config');

const index = async (req, res) => {
  const pool = await mysql.createPool(config);

  const [rows] = await pool.query('SELECT * FROM ProductLines');
  const productLines = rows.map(row => ({
    id: row.ProductLineId,
    name: row.ProductLineName,
    inputName: 'productlines',
    image: '',
    type: 'checkbox',
    isChecked: false,
  }));

  const props = {
    filters: {
      imagesVideosFilter: {
        options: [
          {
            id: 'image-filter',
            name: 'Images',
            inputName: 'Image',
            image: '',
            type: 'checkbox',
            isChecked: false,
          },
          {
            id: 'video-filter',
            name: 'Videos',
            inputName: 'Video',
            image: '',
            type: 'checkbox',
            isChecked: false,
          },
        ],
      },
      productLineFilter: {
        name: 'ProductLine',
        active: false,
        options: productLines,
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

  return res.render('media-gallery/index', {
    heading: 'Media Gallery',
    gallery: renderToString(React.createElement(MediaGallery, props, null)),
  });
};

module.exports = {
  index,
};
