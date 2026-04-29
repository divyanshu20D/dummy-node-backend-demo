const express = require('express');

const cacheRoutes = require('./cache.routes');
const eventRoutes = require('./events.routes');
const healthRoutes = require('./health.routes');
const messageRoutes = require('./messages.routes');
const userRoutes = require('./users.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dummy Node backend is alive.',
    docs: {
      health: '/health',
      users: '/api/users',
      messages: '/api/messages',
      cache: '/api/cache/:key',
      events: '/api/events'
    }
  });
});

router.use('/health', healthRoutes);
router.use('/api/users', userRoutes);
router.use('/api/messages', messageRoutes);
router.use('/api/cache', cacheRoutes);
router.use('/api/events', eventRoutes);

module.exports = router;
