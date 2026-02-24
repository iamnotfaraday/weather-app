const express = require('express');
const router = express.Router();

const weatherController = require('../controllers/weatherController');
const forecastController = require('../controllers/forecastController')

// 定义路由
router.get('/current', weatherController.getWeather);
router.get('/forecast', forecastController.getForecast);

module.exports = router;
