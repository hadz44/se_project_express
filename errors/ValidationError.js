const AppError = require('./AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
