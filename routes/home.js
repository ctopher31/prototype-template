// RoutesJs
const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home/index', { heading: 'Express is here!' });
});

/* GET home page. */
router.get('/home/about', (req, res) => {
  res.render('home/about', { heading: 'About this App' });
});

/* GET home page. */
router.get('/home/contact', (req, res) => {
  res.render('home/contact', { heading: 'Contact Us' });
});

module.exports = router;
