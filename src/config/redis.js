const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisOptions = {
  url: redisUrl,
  socket: {
    connectTimeout: 1000,
    reconnectStrategy: false
  }
};

const redis = createClient(redisOptions);
const publisher = createClient(redisOptions);
const subscriber = createClient(redisOptions);

const state = {
  connected: false,
  error: null
};

function attachLogging(client, name) {
  client.on('error', (err) => {
    state.error = err.message;
    console.error(`${name} Redis error:`, err.message);
  });
}

attachLogging(redis, 'Main');
attachLogging(publisher, 'Publisher');
attachLogging(subscriber, 'Subscriber');

async function connectRedis() {
  try {
    await Promise.all([redis.connect(), publisher.connect(), subscriber.connect()]);
    state.connected = true;
    state.error = null;
    console.log('Redis connected');
  } catch (err) {
    state.connected = false;
    state.error = err.message;
    console.warn('Redis is not connected. The API will still run:', err.message);
  }
}

async function disconnectRedis() {
  await Promise.allSettled([
    redis.isOpen ? redis.quit() : Promise.resolve(),
    publisher.isOpen ? publisher.quit() : Promise.resolve(),
    subscriber.isOpen ? subscriber.quit() : Promise.resolve()
  ]);
}

function getRedisStatus() {
  return {
    connected: state.connected && redis.isReady,
    url: redisUrl,
    lastError: state.error
  };
}

module.exports = {
  redis,
  publisher,
  subscriber,
  connectRedis,
  disconnectRedis,
  getRedisStatus
};
