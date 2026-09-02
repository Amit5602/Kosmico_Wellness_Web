const Redis = require('ioredis');

let host = process.env.REDIS_HOST || '127.0.0.1';
let port = process.env.REDIS_PORT || 6379;
let password = process.env.REDIS_PASSWORD || undefined;

if (process.env.REDIS_URL) {
  try {
    const url = new URL(process.env.REDIS_URL);
    host = url.hostname || host;
    port = url.port || port;
    if (url.password) password = url.password;
  } catch (err) {
    console.error('Failed to parse REDIS_URL:', err);
  }
}

const redisConfig = {
  host,
  port,
  password,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay; // Reconnect after a delay
  },
  maxRetriesPerRequest: null, // Required for BullMQ
};

// Create a single shared instance for caching
const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = {
  redis,
  redisConfig, // Exported to easily create isolated connections for BullMQ
};
