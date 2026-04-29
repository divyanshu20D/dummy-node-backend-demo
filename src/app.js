const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const routes = require('./routes');

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use('/', routes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  });

  return app;
}

module.exports = createApp;
