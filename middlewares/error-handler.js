const { isCelebrateError } = require('celebrate');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const details = [];
    err.details.forEach((joiErr) => {
      details.push(joiErr.details.map((d) => d.message).join(', '));
    });
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send({ message: `Validation failed: ${details.join('; ')}` });
  }

  const { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = err;

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Invalid data provided.' });
  }

  return res.status(statusCode).send({
    message:
      statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? ERROR_MESSAGES.DEFAULT_SERVER_ERROR
        : message,
  });
};
