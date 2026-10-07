const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation Error', 
      errors 
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ 
      success: false, 
      message: 'Duplicate field value entered' 
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message || 'Server Error' 
  });
};

export default errorHandler;
