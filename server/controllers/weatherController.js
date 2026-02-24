const weatherService = require('../services/weatherService');

const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ success: false, message: '请提供城市名称' });
    }
    
    const result = await weatherService.getWeather(city);
    res.json(result);
    
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeather };