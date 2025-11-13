const AppError = require('./AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
