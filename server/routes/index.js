const express = require('express');
const router = express.Router();

const systemRoutes = require('./system');
const weatherRoutes = require('./weather');

router.use('/system', systemRoutes);
router.use('/weather', weatherRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'Weather API 运行中',
    endpoints: {
      health: '/api/system/health',
      weather: '/api/weather/current?city=beijing',
      forecast: '/api/weather/forecast?city=beijing'
    }
  });
});

module.exports = router;
