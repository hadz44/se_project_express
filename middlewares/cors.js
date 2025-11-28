const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gcp-indemo.jumpingcrab.com',
  'https://www.gcp-indemo.jumpingcrab.com',
];

module.exports = cors({
  origin(origin, callback) {
    // allow non-browser clients
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});

