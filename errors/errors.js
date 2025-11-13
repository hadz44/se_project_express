const { ERROR_MESSAGES } = require('../utils/constants');
const AppError = require('./AppError');
const ValidationError = require('./ValidationError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const ConflictError = require('./ConflictError');
const InternalServerError = require('./InternalServerError');

// Helper function to create errors from Mongoose errors
const createErrorFromMongoose = (err, context = 'item') => {
  if (err.name === 'ValidationError') {
    return new ValidationError(err.message);
  }

  if (err.name === 'DocumentNotFoundError') {
    if (context === 'user') {
      return new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return new NotFoundError(ERROR_MESSAGES.CLOTHING_ITEM_NOT_FOUND);
  }

  if (err.name === 'CastError') {
    if (context === 'user') {
      return new ValidationError(ERROR_MESSAGES.INVALID_USER_ID);
    }
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
