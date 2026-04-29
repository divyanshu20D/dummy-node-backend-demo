const { Server } = require('socket.io');

const { messages, nextId } = require('../data/store');
const { publisher, subscriber } = require('../config/redis');

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

function registerSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.emit('system:event', {
      type: 'socket.connected',
      message: 'Connected to Socket.IO server',
      socketId: socket.id
    });

    socket.on('ping:server', () => {
      socket.emit('ping:client', {
        message: 'pong',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('chat:message', async (payload = {}) => {
      const message = {
        id: nextId(messages),
        user: payload.user || 'socket-user',
        text: payload.text || '',
        socketId: socket.id,
        createdAt: new Date().toISOString()
      };

      if (!message.text) {
        socket.emit('system:event', {
          type: 'chat.error',
          message: 'Message text is required'
        });
        return;
      }

      messages.push(message);

      if (publisher.isReady) {
        await publisher.publish('chat:message', JSON.stringify(message));
      } else {
        io.emit('chat:message', message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  if (subscriber.isReady) {
    subscriber.subscribe('chat:message', (payload) => {
      io.emit('chat:message', safeJsonParse(payload));
    });

    subscriber.subscribe('system:event', (payload) => {
      io.emit('system:event', safeJsonParse(payload));
    });
  }

  return io;
}

module.exports = registerSockets;
