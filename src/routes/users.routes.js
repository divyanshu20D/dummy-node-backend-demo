const express = require('express');

const { nextId, users } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

router.get('/:id', (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: user });
});

router.post('/', (req, res) => {
  const { name, role = 'student' } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'name is required' });
  }

  const user = { id: nextId(users), name, role };
  users.push(user);

  return res.status(201).json({ success: true, data: user });
});

module.exports = router;
