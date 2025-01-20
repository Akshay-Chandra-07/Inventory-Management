class GlobalErrorLog {
  errorLogger(err, req, res, next) {
    console.log("Global error handler");
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = new GlobalErrorLog();
