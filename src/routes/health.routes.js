const express = require('express');

const { getRedisStatus } = require('../config/redis');

const router = express.Router();
const startedAt = new Date();

router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'dummy-backend-node',
    uptime: process.uptime(),
    startedAt,
    timestamp: new Date(),
    redis: getRedisStatus()
  });
});

module.exports = router;
