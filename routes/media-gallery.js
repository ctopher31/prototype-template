// Media Gallery routes
const router = require('express').Router();
const { index } = require('../controllers/media-gallery');

/* GET home page. */
router.get('/', (req, res) => index(req, res));

module.exports = router;
