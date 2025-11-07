const { isCelebrateError } = require('celebrate');

/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const details = [];
    err.details.forEach((joiErr) => {
      details.push(joiErr.details.map((d) => d.message).join(', '));
    });
    return res.status(400).send({ message: `Validation failed: ${details.join('; ')}` });
  }

  const { statusCode = 500, message } = err;

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Invalid data provided.' });
  }

  return res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
};
