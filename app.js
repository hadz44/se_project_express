require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const { helmet, corsMw, rateLimiter } = require('./middlewares/security');

// Your combined router should be exported from routes/index.js
const routes = require('./routes');

const app = express();

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
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${PORT}`);
});
