const errorHandler = (err, req, res, next) => {
  console.error('错误:', err.message);

  // 天气 API 错误
  if (err.response && err.response.status === 404) {
    return res.status(404).json({ success: false, message: '未找到该城市' });
  }

  // 默认错误
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;