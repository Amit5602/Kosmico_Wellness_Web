const { Emitter } = require('@socket.io/redis-emitter');
const Redis = require('ioredis');
const { redisConfig } = require('../config/redis');

let emitter;

try {
  const redisClient = new Redis(redisConfig);
  emitter = new Emitter(redisClient);
} catch (error) {
  console.error('Failed to initialize Redis Emitter', error);
  // Dummy emitter fallback
  emitter = {
    to: () => ({ emit: () => {} }),
    emit: () => {}
  };
}

const emitToUser = (userId, event, payload) => {
  emitter.to(`user:${userId}`).emit(event, payload);
};

const emitToAdmins = (event, payload) => {
  emitter.to('admins').emit(event, payload);
};

const emitToOrder = (orderId, event, payload) => {
  emitter.to(`order:${orderId}`).emit(event, payload);
};

module.exports = {
  emitter,
  emitToUser,
  emitToAdmins,
  emitToOrder
};
