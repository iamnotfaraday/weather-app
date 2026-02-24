const { query } = require('./connection');

// 获取缓存
async function get(city) {
  const rows = await query(
    'SELECT * FROM weather_forecast_cache WHERE city = ?',
    [city.toLowerCase()]
  );
  
  const cache = rows[0];
  if(!cache) return null;

  // 返回JSON数据
  return {
    forecastData: cache.data,
    expiresAt: cache.expires_at
  };
}

// 设置缓存
async function set(city, weatherData, expiresAt) {
  await query(
    `INSERT INTO weather_forecast_cache (city, data, expires_at) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       data = VALUES(data),
       expires_at = VALUES(expires_at)`,
    [city.toLowerCase(), JSON.stringify(weatherData), expiresAt]
  );
}

// 删除缓存
async function del(city) {
  await query(
    'DELETE FROM weather_forecast_cache WHERE city = ?',
    [city.toLowerCase()]
  );
}

// 清空所有缓存
async function clear() {
  await query('TRUNCATE TABLE weather_forecast_cache');
}

module.exports = { get, set, del, clear };