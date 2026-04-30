require('dotenv').config();

const http = require('http');

const createApp = require('./app');
const { connectRedis, disconnectRedis } = require('./config/redis');
const registerSockets = require('./sockets');

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  await connectRedis();

  const app = createApp();
  const server = http.createServer(app);

  registerSockets(server);

  server.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing server...`);
    server.close(async () => {
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
