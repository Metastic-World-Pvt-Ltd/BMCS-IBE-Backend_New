const rateLimit = require('express-rate-limit');


const loginRateLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 min in milliseconds
    max: 5, //max retry limit
    message: `You have reached maximum retries. Please try again after 30 min`, 
    statusCode: 429,
    Headers: true,
  });
  module.exports = { loginRateLimiter }

