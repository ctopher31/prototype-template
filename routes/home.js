// RoutesJs
const express = require('express');
const home = require('../controllers/home');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => home.index(req, res));

/* GET home page. */
router.get('/home/about', (req, res) => home.about(req, res));

/* GET home page. */
router.get('/home/contact', (req, res) => home.contact(req, res));

module.exports = router;
