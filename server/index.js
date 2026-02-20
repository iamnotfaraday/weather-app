require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // 引入 axios 用于请求外部 API

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
// console.log(API_KEY);
app.use(cors());
app.use(express.json());

// 1. 健康检查接口 (保留)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '后端服务器运行正常！' });
});

// 2. 天气查询接口 (新增)
app.get('/api/weather', async (req, res) => {
  const city = req.query.city; // 获取前端传来的城市名，如 ?city=Beijing

  // 简单验证
  if (!city) {
    return res.status(400).json({ success: false, message: '请提供城市名称' });
  }

  try {
    // 构造 OpenWeatherMap 的 API 地址
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    // console.log(API_KEY);
    // 发起请求
    const response = await axios.get(url);
    
    // 返回数据给前端
    res.json({
      success: true,
      data: response.data
    });
    console.log("查询成功");
    console.log(response.data);

  } catch (error) {
    // 错误处理
    console.error('API 请求失败:', error.message);
    
    // 区分是城市找不到还是其他错误
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ success: false, message: '未找到该城市' });
    }
    
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});


// 3. 天气预报接口 (新增)
app.get('/api/forecast', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ success: false, message: '请提供城市名称' });
  }

  try {
    // 注意这里是 forecast 接口
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=zh_cn`;
    const response = await axios.get(url);
    
    res.json({
      success: true,
      data: response.data.list // 预报数据在 list 数组里
    });
    console.log("预测的天气为:");
    console.log(response.data.list[0]);
  } catch (error) {
    console.error('预报 API 请求失败:', error.message);
    res.status(500).json({ success: false, message: '预报数据获取失败' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 服务器正在运行：http://localhost:${PORT}`);
});