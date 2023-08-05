const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'error', // Minimum level to log (you can adjust this)
  format: winston.format.json(), // Log format
  transports: [
    new winston.transports.Console(), // Log to console
    //new winston.transports.File({ filename: 'error.log' }) // Log to a file
  ]
});

module.exports = logger;