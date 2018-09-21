// Home Routes
const router = require('express').Router();
const { index, about, contact } = require('../controllers/home');

/* GET home page. */
router.get('/', (req, res) => index(req, res));

/* GET home page. */
router.get('/about-us', (req, res) => about(req, res));

/* GET home page. */
router.get('/contact-us', (req, res) => contact(req, res));

module.exports = router;
