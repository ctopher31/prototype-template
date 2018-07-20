// ServerJs
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const nunjucks = require('nunjucks');
const rfs = require('rotating-file-stream');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const debug = require('debug')('app');
const logger = require('./config/winston');

// Get app modules
const routes = require('./routes');

// Set environment
app.set('port', process.env.PORT || 3002);

// View engine setup
app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

// Set the log directory
const logDirectory = path.join(__dirname, 'logs');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Error logging
app.use(morgan(':method :url :status', {
  skip: (req, res) => res.statusCode < 400,
  stream: logger.stream,
}));

// Access logging
app.use(morgan('combined', {
  // Skip static files from access logging
  skip(req) {
    let uri;
    if (req.url.indexOf('?') > 0) {
      uri = req.url.substr(0, req.url.indexOf('?'));
    } else {
      uri = req.url;
    }
    if (uri.match(/(js|map|jpg|png|ico|css|woff|woff2|eot)$/ig)) {
      return true;
    }
    return false;
  },
  stream: rfs('access.log', {
    interval: '1d',
    path: logDirectory,
  }),
}));

// Serve static assets
app.use(express.static(path.join(__dirname, './assets/dist')));

// Routes
app.use('/', routes);

// Web sockets
io.on('connection', (socket) => {
  debug('a user connected');
  socket.on('disconnect', () => {
    debug('user disconnected');
  });
});

// Not found handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res) => {
  logger.error('error');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

// Listen for requests
server.listen(app.get('port'), () => {
  debug(`Express server listening on port ${server.address().port}`);
});
