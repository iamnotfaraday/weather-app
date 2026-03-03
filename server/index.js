require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const axios = require('axios'); // 引入 axios 用于请求外部 API
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');
const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
// 注册限流中间件（在所有路由之前）
app.use('/api/weather', rateLimiter)  // ← 只对天气接口限流
// 注册路由
app.use('/api', routes);

// 中间件错误处理
app.use(errorHandler);

// // 1. 健康检查接口 (保留)
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: '后端服务器运行正常！' });
// });

app.listen(PORT, () => {
  console.log(`🚀 服务器正在运行：http://localhost:${PORT}`);
  console.log(`📍 健康检查：http://localhost:${PORT}/api/system/health`);
  console.log(`🛑 限流：每分钟最多 5 次请求`);
});