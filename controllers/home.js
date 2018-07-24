// Home Controller
const index = (req, res) => res.render('home/index', { heading: 'Express is here!' });

module.exports = {
  index,
};
