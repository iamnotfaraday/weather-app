const mysql = require('mysql2/promise');

// 创建连接池（类似 Django 的 DATABASES 配置）
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'weather_app',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,  // 最大连接数
  queueLimit: 0
});

// 测试连接
async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL 连接成功');
  } catch (err) {
    console.error('❌ MySQL 连接失败:', err.message);
  }
}

// 导出查询函数
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query, testConnection };