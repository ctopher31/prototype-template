// Home Routes
const router = require('express').Router();
const { index } = require('../controllers/home');

/* GET home page. */
router.get('/', (req, res) => index(req, res));

module.exports = router;
