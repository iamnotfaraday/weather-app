// 通过环境变量切换数据库方案：'mysql' 或 'prisma'
const DB_PROVIDER = process.env.DB_PROVIDER || 'mysql';

const weatherCache = DB_PROVIDER === 'prisma'
  ? require('../db/prisma/weatherCache')
  : require('../db/mysql/weatherCache');

const forecastCache = DB_PROVIDER === 'prisma'
  ? require('../db/prisma/forecastCache')
  : require('../db/mysql/forecastCache');

module.exports = {
  provider: DB_PROVIDER,
  weatherCache,
  forecastCache
};