// Winston logging
const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

// define the custom settings for each transport (file, console)
const options = {
  accessLog: {
    level: 'info',
    filename: './logs/access.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880,
    maxfiles: 5,
    colorize: false,
  },
  errorLog: {
    level: 'error',
    filename: './logs/error.log',
    handleEceptions: true,
    json: false,
    maxsize: 5242880,
    maxfiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const accessLogger = createLogger({
  format: combine(
    timestamp(),
    printf(info => `${info.timestamp} -- ${info.message}`),
  ),
  transports: [
    new transports.File(options.accessLog),
    new transports.Console(options.console),
  ],
  exceptionHandlers: [
    new transports.File(options.errorLog),
  ],
  exitOnError: false,
});

const errorLogger = createLogger({
  format: combine(
    timestamp(),
    printf(info => `${info.timestamp} -- ${info.level.toUpperCase()}: ${info.message}`),
  ),
  transports: [
    new transports.File(options.errorLog),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

// create a stream object with a 'write' function that will be used by `morgan`
accessLogger.stream = {
  write(message) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    accessLogger.info(message);
  },
};

errorLogger.stream = {
  write(message) {
    // use the 'error' log level so the output will be picked up by both transports (file and console)
    errorLogger.error(message);
  },
};

module.exports = {
  accessLogger,
  errorLogger,
};
