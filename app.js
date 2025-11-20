require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const { helmet, corsMw, rateLimiter } = require('./middlewares/security');

// Your combined router should be exported from routes/index.js
const routes = require('./routes');

const app = express();

// Database connection
const { MONGODB_URI = 'mongodb://127.0.0.1:27017/wtwr_db' } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

app.use(helmet());
app.use(corsMw);
app.use(rateLimiter);
app.use(express.json());

app.use(requestLogger);

// Crash-test route - should crash the app for PM2 testing
// This route must be defined before error handlers to actually crash
app.get('/crash-test', () => {
  process.exit(1);
});

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const { PORT = 3000 } = process.env;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
