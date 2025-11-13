const AppError = require('./AppError');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.DEFAULT_SERVER_ERROR) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
