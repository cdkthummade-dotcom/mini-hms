require('dotenv').config();
const Redis = require('ioredis');

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on('connect', () => console.log('Redis connected'));
    redisClient.on('error', (err) => console.error('Redis error:', err.message));
  }
  return redisClient;
}

module.exports = { getRedisClient };
