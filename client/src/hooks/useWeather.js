import { useState, useCallback } from "react";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = useCallback (async (city) => {
    if (!city) return ;

    setLoading(true);
    setError('');
    // setWeather(null)
    // setForecast(null)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const currentWeatherPromise = fetch(`${baseUrl}/api/weather/current?city=${city}`).then(res => res.json())
      const forecastPromise = fetch(`${baseUrl}/api/weather/forecast?city=${city}`).then(res => res.json())

      const [weatherRes, forecastRes] = await Promise.all([currentWeatherPromise, forecastPromise])

      if (!weatherRes.success) {
        console.log("weatherFetch error");
        throw new Error(weatherRes.message)
      }
      if (!forecastRes.success) {
        console.log("forecastFetch error");

        throw new Error(forecastRes.message)
      }
      console.log("当前是否命中?", weatherRes.formCache, forecastRes.formCache);
      setWeather(weatherRes.data)
      setForecast(forecastRes.data)
    } catch (err) {
      setError(err.message || '查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, forecast, loading, error, fetchWeather, setError};
}