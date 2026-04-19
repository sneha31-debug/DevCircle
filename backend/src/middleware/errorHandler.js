// src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error.';
  if (status === 500) console.error('[ErrorHandler]', err);
  res.status(status).json({ message });
}

module.exports = errorHandler;
