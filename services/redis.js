const redis = require('redis');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const client = redis.createClient(
  config.services.redis.url);
client.on('error', error => {
  logger.errorWithReq(null, 'redis_error', 'Error connecting to Redis', error);
});

module.exports = client;
