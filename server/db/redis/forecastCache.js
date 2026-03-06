const { redisClient } = require('./client');

const KEY_PREFIX = 'weather:forecast:';

async function get(city) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  const data = await redisClient.get(key);
  if(!data) return null;
  return JSON.parse(data);
}

async function set(city, forecastData, expiresAt) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  const ttl = ((expiresAt - Date.now()) / 1000);
  const value = {
    forecastData,
    expiresAt
  };

  await redisClient.setEx(key, ttl, JSON.stringify(value));
}

async function del(city) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  await redisClient.del(city);
}

async function clear() {
  const keys = await redisClient.key(`${KEY_PREFIX}*`);
  if(keys.length > 0) {
    await redisClient.del(keys);
  }
}

module.exports = {get, set, del, clear};
