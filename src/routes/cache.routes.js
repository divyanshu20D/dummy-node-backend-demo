const express = require('express');

const { redis } = require('../config/redis');

const router = express.Router();

function requireRedis(req, res, next) {
  if (!redis.isReady) {
    return res.status(503).json({
      success: false,
      message: 'Redis is not connected'
    });
  }

  return next();
}

router.get('/:key', requireRedis, async (req, res) => {
  const value = await redis.get(req.params.key);

  if (value === null) {
    return res.status(404).json({ success: false, message: 'Key not found' });
  }

  return res.json({ success: true, key: req.params.key, value });
});

router.post('/', requireRedis, async (req, res) => {
  const { key, value, ttl } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({
      success: false,
      message: 'key and value are required'
    });
  }

  if (ttl) {
    await redis.set(key, String(value), { EX: Number(ttl) });
  } else {
    await redis.set(key, String(value));
  }

  return res.status(201).json({
    success: true,
    key,
    value: String(value),
    ttl: ttl ? Number(ttl) : null
  });
});

router.delete('/:key', requireRedis, async (req, res) => {
  const deleted = await redis.del(req.params.key);
  res.json({ success: true, key: req.params.key, deleted });
});

module.exports = router;
