const { HTTP_STATUS, ERROR_MESSAGES } = require('./constants');

// Base Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom error constructors
class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.CONFLICT);
    this.name = 'ConflictError';
  }
}

class InternalServerError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}

// Helper function to create errors from Mongoose errors
const createErrorFromMongoose = (err) => {
  if (err.name === 'ValidationError') {
    return new ValidationError(err.message);
  }
  
  if (err.name === 'DocumentNotFoundError') {
    return new NotFoundError(ERROR_MESSAGES.CLOTHING_ITEM_NOT_FOUND);
  }
  
  if (err.name === 'CastError') {
    return new ValidationError(ERROR_MESSAGES.INVALID_ITEM_ID);
  }
  
  if (err.code === 11000) {
    return new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  
  // For any other Mongoose errors, return internal server error
  return new InternalServerError();
};

// Helper function to create errors from JWT errors
const createErrorFromJWT = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
  
  if (err.name === 'TokenExpiredError') {
    return new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
  
  return new UnauthorizedError();
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  createErrorFromMongoose,
  createErrorFromJWT,
};

