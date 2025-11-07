const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const corsMw = cors({ origin: '*' });

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { helmet, corsMw, rateLimiter };
