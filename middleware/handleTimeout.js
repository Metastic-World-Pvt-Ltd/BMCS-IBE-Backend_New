const logger = require("../controllers/logger");

module.exports.handleTimeout = function(req, res, next) {
    // Set a timeout (e.g., 5 seconds) for the request
    const timeoutMs = 60000;
  
    const timeoutId = setTimeout(() => {
      // Request timed out

      logger.error(`Request Timeout`)
      res.status(408).json({ error: 'Request timeout' });
    }, timeoutMs)
}