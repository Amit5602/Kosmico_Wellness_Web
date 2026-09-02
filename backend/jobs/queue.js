const { Queue } = require('bullmq');
const { redisConfig } = require('../config/redis'); // Use raw config for clean BullMQ connections

// Define Queues
const notificationQueue = new Queue('notifications', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false, // Keep failed jobs for inspection
  },
});

const emailQueue = new Queue('emails', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = {
  notificationQueue,
  emailQueue,
};
