module.exports = (err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An error occurred';
  
    // Custom error handling logic can go here, such as logging to a service, sending alerts, etc.
  
    res.status(statusCode).json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  };