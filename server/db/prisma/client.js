const { PrismaClient } = require('@prisma/client')

// 避免开发环境热重载创建多个实例
const globalForPrisma = globalThis || {}

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // 开发环境打印 SQL
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = prisma