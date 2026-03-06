const { createClient } = require('redis')

// 创建 Redis 客户端
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

// 连接错误处理
redisClient.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err.message)
})

redisClient.on('connect', () => {
  console.log('✅ Redis 连接成功')
})

// 启动时连接
async function connect() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

// 关闭连接
async function disconnect() {
  if (redisClient.isOpen) {
    await redisClient.quit()
  }
}

module.exports = { redisClient, connect, disconnect }
