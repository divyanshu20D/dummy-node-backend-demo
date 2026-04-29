const users = [
  { id: 1, name: 'Aarav', role: 'backend learner' },
  { id: 2, name: 'Maya', role: 'frontend learner' }
];

const messages = [
  { id: 1, user: 'system', text: 'Backend started for deployment practice.' }
];

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

module.exports = {
  users,
  messages,
  nextId
};
