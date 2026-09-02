const { redis } = require('../config/redis');

class CacheService {
  async get(key) {
    if (redis.status !== 'ready') return null; // Fallback gracefully if Redis is unavailable
    
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Cache GET error for key ${key}:`, err);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (redis.status !== 'ready') return;
    
    try {
      const serialized = JSON.stringify(value);
      await redis.set(key, serialized, 'EX', ttlSeconds);
    } catch (err) {
      console.error(`Cache SET error for key ${key}:`, err);
    }
  }

  async delete(key) {
    if (redis.status !== 'ready') return;
    
    try {
      await redis.del(key);
    } catch (err) {
      console.error(`Cache DELETE error for key ${key}:`, err);
    }
  }

  async deleteByPattern(pattern) {
    if (redis.status !== 'ready') return;
    
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (err) {
      console.error(`Cache DELETE_PATTERN error for pattern ${pattern}:`, err);
    }
  }
}

module.exports = new CacheService();
