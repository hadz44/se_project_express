const AppError = require('./AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

class ConflictError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.CONFLICT);
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
