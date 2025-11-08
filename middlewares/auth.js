const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_REQUIRED });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTHORIZATION_REQUIRED });
  }
};

module.exports = auth;
