import { useRef, useMemo } from 'react'
import { useSearch } from './hooks/useSearch'
import { useClickOutside } from './hooks/useClickOutside'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import { formatDate, formatTime, processDailyForecast } from './utils/weatherUtils'

// 组件导入
import SearchBar from './components/SearchBar'
import HistoryDropdown from './components/HistoryDropdown'
import WeatherCard from './components/WeatherCard'

function App() {
  // 使用整合的 search hook
  const {
    city,
    setCity,
    showHistory,
    setShowHistory,
    history,
    weather,
    forecast,
    loading,
    error,
    handleSearch,
    handleHistorySelect,
    deleteHistory,
    clearHistory,
    setError
  } = useSearch()

  const inputRef = useRef(null)
  const historyRef = useRef(null)

  // 点击外部关闭
  useClickOutside(historyRef, () => setShowHistory(false), [inputRef])

  // 键盘导航
  const { highlightedIndex, setHighlightedIndex, handleKeyDown } = useKeyboardNavigation(
    history,
    handleHistorySelect,
    () => setShowHistory(false)
  )

  // 处理输入变化
  const handleChange = (e) => {
    setCity(e.target.value)
    setShowHistory(false)
  }

  // 处理聚焦
  const handleFocus = () => {
    setShowHistory(true)
  }

  // 处理删除历史
  const handleDeleteHistory = (e, item) => {
    e.stopPropagation()
    deleteHistory(item)
  }

  // 处理天气图标和样式
  const getWeatherGradient = (icon) => {
    if (!icon) return 'from-slate-100 to-slate-200'
    if (icon.includes('01') || icon.includes('02')) return 'from-amber-50 to-orange-100'
    if (icon.includes('03') || icon.includes('04')) return 'from-slate-100 to-gray-200'
    if (icon.includes('09') || icon.includes('10')) return 'from-blue-50 to-slate-200'
    if (icon.includes('11')) return 'from-slate-200 to-gray-300'
    if (icon.includes('13')) return 'from-slate-50 to-slate-200'
    return 'from-blue-50 to-indigo-100'
  }

  // 处理每日预报
  const dailyForecast = useMemo(() => 
    processDailyForecast(forecast), 
    [forecast]
  )

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        <div className="relative mb-6">
          <SearchBar
            ref={inputRef}
            city={city}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onSearch={handleSearch}
            loading={loading}
          />

          <HistoryDropdown
            ref={historyRef}
            history={history}
            onClearHistory={clearHistory}
            onHistoryClick={handleHistorySelect}
            onDeleteHistory={handleDeleteHistory}
            onHighlightedIndex={setHighlightedIndex}
            highlightedIndex={highlightedIndex}
            showHistory={showHistory}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <WeatherCard
          weather={weather}
          dailyForecast={dailyForecast}
          formatDate={formatDate}
          formatTime={formatTime}
          getWeatherGradient={getWeatherGradient}
        />
      </div>
    </div>
  )
}

export default App