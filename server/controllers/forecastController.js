const forecastService = require('../services/forecastService');

const getForecast = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ success: false, message: '请提供城市名称' });
    }

    const result = await forecastService.getForecast(city);
    res.json(result);

  } catch (error) {
    next(error);
  }
};

module.exports = { getForecast };