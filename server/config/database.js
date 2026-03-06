// 通过环境变量切换数据库方案：'mysql' 或 'prisma'
const DB_PROVIDER = process.env.DB_PROVIDER || 'mysql';
const DB_TYPE = process.env.DB_TYPE || 'mysql';

const weatherCache = (() => {
  if (DB_TYPE === 'redis') return require('../db/redis/weatherCache');
  return (DB_PROVIDER === 'prisma') ? require('../db/prisma/weatherCache')
    : require('../db/mysql/weatherCache');
})()

const forecastCache = (() => {
  if (DB_TYPE === 'redis') return require('../db/redis/forecastCache');
  return (DB_PROVIDER === 'prisma') ? require('../db/prisma/forecastCache')
    : require('../db/mysql/forecastCache');
})()

module.exports = {
  provider: DB_PROVIDER,
  cacheType: DB_TYPE,
  weatherCache,
  forecastCache
};
