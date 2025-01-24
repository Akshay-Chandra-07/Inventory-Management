const { logger } = require("../loggers/winston");
class GlobalErrorLog {
  errorLogger(err, req, res, next) {
    logger(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = new GlobalErrorLog();
