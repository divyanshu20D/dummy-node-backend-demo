const express = require('express');

const { messages, nextId } = require('../data/store');
const { publisher } = require('../config/redis');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: messages.length,
    data: messages
  });
});

router.post('/', async (req, res) => {
  const { user = 'anonymous', text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'text is required' });
  }

  const message = {
    id: nextId(messages),
    user,
    text,
    createdAt: new Date().toISOString()
  };

  messages.push(message);

  if (publisher.isReady) {
    await publisher.publish('chat:message', JSON.stringify(message));
  }

  return res.status(201).json({ success: true, data: message });
});

module.exports = router;
