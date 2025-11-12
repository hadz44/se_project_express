const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { ERROR_MESSAGES } = require('../utils/constants');
const { UnauthorizedError, createErrorFromJWT } = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(createErrorFromJWT(err));
  }
};

module.exports = auth;
