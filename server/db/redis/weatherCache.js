const { redisClient } = require('./client');

const KEY_PREFIX = 'weather:current:';

async function get(city) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  const data = await redisClient.get(key);
  if(!data) return null;
  return JSON.parse(data);
}

async function set(city, weatherData, expiresAt) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  const ttl = Math.floor((expiresAt - Date.now()) / 1000);
  const value = {
    weatherData,
    expiresAt
  };
  await redisClient.setEx(key, ttl, JSON.stringify(value));
}

async function del(city) {
  const key = `${KEY_PREFIX}${city.toLowerCase()}`;
  await redisClient.del(city);
}

async function clear() {
  const keys = await redisClient.keys(`${KEY_PREFIX}*`);
  if(keys.length > 0) {
    await redisClient.del(keys);
  }
}

module.exports = {get, set, del, clear};
