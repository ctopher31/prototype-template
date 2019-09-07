// ServerJs
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const nunjucks = require('nunjucks');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const debug = require('debug')('app');

const { accessLogger, errorLogger } = require('./config/winston');
const routes = require('./routes/');

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

// Access logging
app.use(morgan(':status -- "HTTP/:http-version :method :url" -- ":remote-addr" -- ":response-time[3]" -- ":referrer" -- ":user-agent"', {
  // Skip static files from access logging
  skip(req) {
    let noParamsUrl;
    if (req.url.indexOf('?') > 0) {
      noParamsUrl = req.url.substr(0, req.url.indexOf('?'));
    } else {
      noParamsUrl = req.url;
    }
    if (noParamsUrl.match(/(js|map|jpg|png|ico|css|woff|woff2|eot)$/ig)) {
      return true;
    }
    return false;
  },
  stream: accessLogger.stream,
}));
app.use(morgan('dev'));

// Error logging
app.use(morgan(':status -- "HTTP/:http-version :method :url" -- ":remote-addr" -- ":response-time[3]" -- ":referrer" -- ":user-agent"', {
  skip: (req, res) => res.statusCode < 400,
  stream: errorLogger.stream,
}));

// Add compresssion and security headers
app.use(helmet());
app.use(compression());

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
  res.render('/not-found', {
    message: 'Not Found',
    error: err,
  });
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  debug('There was an error');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  errorLogger.error(`${err.status || 500} -- ${err.message} -- ${req.originalUrl} -- ${req.method} --${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('/error', {
    message: err.message,
    error: err,
  });
  next(err);
});

// Listen for requests
server.listen(app.get('port'), () => {
  debug(`Express server listening on port ${server.address().port}`);
});
