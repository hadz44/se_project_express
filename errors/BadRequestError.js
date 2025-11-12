const { HTTP_STATUS } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
