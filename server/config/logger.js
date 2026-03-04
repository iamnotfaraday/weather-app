const winston = require('winston')
const path = require('path')

// 日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

// 根据环境设置级别
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  return env === 'production' ? 'info' : 'debug'
}

// 日志格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

// 创建 logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 错误日志文件
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    // 所有日志文件
    new winston.transports.File({
      filename: path.join('logs', 'all.log')
    })
  ]
})

module.exports = logger
