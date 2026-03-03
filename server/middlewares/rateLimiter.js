const requestStore = new Map();
// 结构: {ip: xxx, {count: xxx, resetTime: xxx}};

const WINDOWS_MS = 60 * 1000; // 时间窗口1min
const MAX_REQUESTS = 5; // 最大请求次数

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknow';
    const record = requestStore.get(ip) || { count: 0, resetTime: Date.now() + WINDOWS_MS };

    if (Date.now() > record.resetTime) { // 检查是否过期
        record.count = 0;
        record.resetTime = Date.now() + WINDOWS_MS;
    }
    console.log("调用了限流中间件");
    record.count += 1;
    requestStore.set(ip, record);
    // 5. 设置响应头（告诉客户端限流信息）
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count))
    res.setHeader('X-RateLimit-Reset', record.resetTime)

    // 判断是否超限
    if(record.count > MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            message: "请求过于频繁",
            retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000)
        })
    }
    next();
}

module.exports = rateLimiter;