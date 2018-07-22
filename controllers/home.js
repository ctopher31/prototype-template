// Home Controller
const index = (req, res) => res.render('home/index', { heading: 'Express is here!' });

const about = (req, res) => res.render('home/about', { heading: 'About this App' });

const contact = (req, res) => res.render('home/contact', { heading: 'Contact Us' });

module.exports = {
  index,
  about,
  contact,
};
