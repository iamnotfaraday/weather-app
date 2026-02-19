require('dotenv').config(); // 加载 .env 文件
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. 使用 CORS 中间件 (允许前端访问)
app.use(cors());

// 2. 解析 JSON 请求体
app.use(express.json());

// 3. 测试接口
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '后端服务器运行正常！' });
});

// 4. 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器正在运行：http://localhost:${PORT}`);
});