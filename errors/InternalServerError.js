const AppError = require('./AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

class InternalServerError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
