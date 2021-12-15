const Redis = require('ioredis');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const client = new Redis(
  config.services.redis.url,
  { enableOfflineQueue: false }
);

client.on('connect', () => {
  logger.infoWithReq(null, 'redis_connect', 'Connected to Redis');
});

client.on('error', error => {
  logger.errorWithReq(null, 'redis_error', 'Error connecting to Redis', error);
});

module.exports = client;
