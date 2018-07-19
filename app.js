// ServerJs

const debug = require('debug');
const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const express = require('express');
const http = require('http');
const Io = require('socket.io');
const nunjucks = require('nunjucks');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = new Io(server);

// view engine setup
app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

const skipLog = (req) => {
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
};

const logStream = log => fs.createWriteStream(log, { flags: 'a' });

// Dev log
app.use(logger('dev'));

// Error log
app.use(logger('combined', {
  skip(req, res) { return res.statusCode < 400; },
  stream: logStream(path.join(__dirname, 'error.log')),
}));

// Access log
app.use(logger('combined', {
  skip(req) { return skipLog(req); },
  stream: logStream(path.join(__dirname, 'access.log')),
}));

app.use(express.static(path.join(__dirname, './assets/dist')));
app.use('/', routes);

// debug('a user connected'); debug('user disconnected');
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

app.set('port', process.env.PORT || 3002);

server.listen(app.get('port'), () => {
  debug(`Express server listening on port ${server.address().port}`);
});
