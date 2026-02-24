const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const { forecastCache } = require('../config/database');

// 缓存有效期 (15min)
const CACHE_TTL = 15 * 60 * 1000;

/**
 * 获取天气预报 (5天/3小时)
 */

// 判断缓存是否过期
const isExpired = (cache) => {
  if (!cache) return true;
  // prisma返回bigint, mysql返回number, 这里转换一下
  const expiresAt = typeof cache.expiresAt === 'bigint'
    ? Number(cache.expiresAt) : cache.expiresAt;

  return expiresAt < Date.now();
}

// 获取预测天气(带缓存)
const getForecast = async (city) => {

  // 参数验证
  if (!city || typeof city !== 'string') {
    return {
      success: false,
      message: '请提供有效的城市名称'
    };
  }

  // 清理城市名（去除首尾空格）
  const trimmedCity = city.trim().toLowerCase();

  if (!trimmedCity) {
    return {
      success: false,
      message: '城市名称不能为空'
    };
  }

  // 判断是否查询缓存
  const cached = await forecastCache.get(trimmedCity);
  if (cached && !isExpired(cached)) {
    console.log(`✅ forecast命中缓存：${trimmedCity}`);
    return {
      success: true,
      data: cached.forecastData,
      fromCache: true
    };
  }

  if (cached) {
    await forecastCache.del(trimmedCity);
  }

  try {
    // 注意：去掉 q= 后面的空格！
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    const response = await axios.get(url);
    const forecastData = response.data.list;

    console.log(`[forecastService] 预报查询成功: ${trimmedCity}`);
    // 写入缓存
    const expiresAt = Date.now() + CACHE_TTL;
    await forecastCache.set(trimmedCity, forecastData, expiresAt);

    return {
      success: true,
      data: forecastData, // 预报列表
      fromCache: false
    };
  } catch (error) {
    console.error(`[forecastService] 查询失败: ${trimmedCity}`, error.message);
    // 区分错误类型
    if (error.response) {
      const status = error.response.status;

      if (status === 404) {
        return {
          success: false,
          message: `未找到城市: "${trimmedCity}"，请检查拼写`
        };
      }

      if (status === 401) {
        return {
          success: false,
          message: 'API 密钥无效或已过期'
        };
      }

      return {
        success: false,
        message: `天气服务错误 (HTTP ${status})`
      };
    }

    // 网络错误或其他错误
    return {
      success: false,
      message: '网络请求失败，请稍后重试'
    };
  }
};

module.exports = { getForecast };