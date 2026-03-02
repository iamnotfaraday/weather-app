const prisma = require('./client');

// const memoryCache = new Map(); // 添加内存数据库

async function get(city) {

  city = city.toLowerCase();

  // const mem = memoryCache.get(city);
  // if (mem) {
  //   if (mem.expiresAt > Date.now()) {
  //     console.log("内存命中");
  //     return {
  //       weatherData: mem.data,
  //       expiresAt: mem.expires_at
  //     }
  //   }
  //   memoryCache.delete(city);
  // }

  // console.log("内存未命中, 查数据库")
  const cache = await prisma.weatherCurrentCache.findUnique({
    where: { city: city }
  });

  if (!cache) return null;

  return {
    weatherData: cache.data,
    expiresAt: cache.expires_at
  };
}

async function set(city, weatherData, expiresAt) {
  // 顺便写入内存
  // city = city.toLowerCase();
  // memoryCache.set(city, { data: weatherData, expires_at: expiresAt });

  await prisma.weatherCurrentCache.upsert({
    where: { city: city },
    update: { data: weatherData, expires_at: BigInt(expiresAt) },
    create: {
      city: city,
      data: weatherData,
      expires_at: BigInt(expiresAt)
    }
  })
}

async function del(city) {
  await prisma.weatherCurrentCache.delete({
    where: { city: city.toLowerCase() }
  }).catch(() => null)
}

async function clear(city) {
  await prisma.weatherCurrentCache.deleteMany();
}

module.exports = { get, set, del, clear }