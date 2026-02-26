const prisma = require('./client');

async function get(city) {
  const cache = await prisma.weatherForecastCache.findUnique({
    where: { city: city.toLowerCase() }
  });
  console.log("使用了");
  if (!cache) return null;

  return {
    forecastData: cache.data,
    expiresAt: cache.expires_at
  };
}

async function set(city, forecastData, expiresAt) {
  await prisma.weatherForecastCache.upsert({
    where: { city: city.toLowerCase() },
    update: { data: forecastData, expires_at: BigInt(expiresAt) },
    create: {
      city: city.toLowerCase(),
      data: forecastData,
      expires_at: BigInt(expiresAt)
    }
  })
}

async function del(city) {
  await prisma.weatherForecastCache.delete({
    where: { city: city.toLowerCase() }
  }).catch(() => null)
}

async function clear(city) {
  await prisma.weatherForecastCache.deleteMany();
}

module.exports = { get, set, del, clear }