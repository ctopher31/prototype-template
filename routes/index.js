// Routes
const router = require('express').Router();
const home = require('./home');
const mediaGallery = require('./media-gallery');

router.use('/', home);
router.use('/media-gallery', mediaGallery);

module.exports = router;
