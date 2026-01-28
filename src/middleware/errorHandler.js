/**
 * Global error handling middleware
 * Catches and formats error responses consistently
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Default error response
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
};

module.exports = { errorHandler };
