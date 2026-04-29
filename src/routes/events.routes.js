const express = require('express');

const { publisher } = require('../config/redis');

const router = express.Router();

router.post('/', async (req, res) => {
  const event = {
    type: req.body.type || 'deployment.demo',
    message: req.body.message || 'Hello from the REST API',
    createdAt: new Date().toISOString()
  };

  if (!publisher.isReady) {
    return res.status(503).json({
      success: false,
      message: 'Redis is not connected'
    });
  }

  await publisher.publish('system:event', JSON.stringify(event));

  return res.status(202).json({ success: true, data: event });
});

module.exports = router;
