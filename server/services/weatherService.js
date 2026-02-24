const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * 获取城市天气信息
 * @param {string} city - 城市名称
 * @returns {Promise<{success: boolean, data?: object, message?: string, fromCache?: boolean}>}
 */
const getWeather = async (city) => {
  // 参数验证
  if (!city || typeof city !== 'string') {
    return {
      success: false,
      message: '请提供有效的城市名称'
    };
  }

  // 清理城市名（去除首尾空格）
  const trimmedCity = city.trim();
  
  if (!trimmedCity) {
    return {
      success: false,
      message: '城市名称不能为空'
    };
  }

  try {
    // 构造 URL（注意：去掉 q= 后面的空格！）
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    
    const response = await axios.get(url);
    
    console.log(`[WeatherService] 查询成功: ${trimmedCity}`);
    
    return {
      success: true,
      data: response.data,
      fromCache: false
    };

  } catch (error) {
    console.error('[WeatherService] API 请求失败:', error.message);

    // // 区分错误类型
    // if (error.response) {
    //   const status = error.response.status;
      
    //   if (status === 404) {
    //     return {
    //       success: false,
    //       message: `未找到城市: "${trimmedCity}"，请检查拼写`
    //     };
    //   }
      
    //   if (status === 401) {
    //     return {
    //       success: false,
    //       message: 'API 密钥无效或已过期'
    //     };
    //   }
      
    //   return {
    //     success: false,
    //     message: `天气服务错误 (HTTP ${status})`
    //   };
    // }

    // // 网络错误或其他错误
    // return {
    //   success: false,
    //   message: '网络请求失败，请稍后重试'
    // };
  }
};

module.exports = {
  getWeather
};