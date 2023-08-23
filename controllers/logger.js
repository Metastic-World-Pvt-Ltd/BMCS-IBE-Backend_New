const winston = require('winston');
require('winston-mongodb');
require('dotenv').config({path:'../.env'});
// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Minimum log level to display
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    //new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'D:/app.log' }), // Log to a file
    new winston.transports.MongoDB({
        level: 'info', // Minimum log level to store in MongoDB
        db: process.env.URL, // Your MongoDB connection URL
        options: { useUnifiedTopology: true },
        collection: 'logs' // Name of the collection to store logs
      })
  ]
});

module.exports = logger;
