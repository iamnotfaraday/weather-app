import { useState, useCallback } from 'react'
import { useSearchHistory } from './useSearchHistory'
import { useWeather } from './useWeather'

export function useSearch() {
  const [city, setCity] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const { history, addToHistory, deleteHistory, clearHistory } = useSearchHistory()
  const { weather, forecast, loading, error, fetchWeather, setError } = useWeather()

  const handleSearch = useCallback(() => {
    if (!city.trim()) return

    fetchWeather(city)
    addToHistory(city)
    setShowHistory(false)
  }, [city, fetchWeather, addToHistory])

  const handleHistorySelect = useCallback((selectedCity) => {
    setCity(selectedCity)
    setShowHistory(false)
    fetchWeather(selectedCity)
  }, [fetchWeather])

  return {
    // 状态
    city,
    setCity,
    showHistory,
    setShowHistory,
    history,
    // 天气数据
    weather,
    forecast,
    loading,
    error,
    // 方法
    handleSearch,
    handleHistorySelect,
    deleteHistory,
    clearHistory,
    setError
  }
}