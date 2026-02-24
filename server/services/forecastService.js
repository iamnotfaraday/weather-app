const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * 获取天气预报 (5天/3小时)
 */
const getForecast = async (city) => {
  if (!city?.trim()) {
    return { success: false, message: '请提供有效的城市名称' };
  }

  try {
    // 注意：去掉 q= 后面的空格！
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    const response = await axios.get(url);

    console.log(`[WeatherService] 预报查询成功: ${city.trim()}`);

    return {
      success: true,
      data: response.data.list, // 预报列表
      // cityInfo: {
      //   name: response.data.city?.name,
      //   country: response.data.city?.country,
      //   sunrise: response.data.city?.sunrise,
      //   sunset: response.data.city?.sunset
      // },
      fromCache: false
    };
  } catch (error) {
    console.error('[forecastService] API 请求失败:', error.message);

  }
};

module.exports = { getForecast };