import { useState, useMemo, useEffect, useRef } from 'react'
import SearchBar from './components/searchBar'
import HistoryDropdown from './components/HistoryDropdown'
import WeatherCard from './components/WeatherCard'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const MAX_HISTORY = 5, STORAGE_KEY = "search_history";


  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log("进入了获取浏览器历史记录")
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      console.log("获取的历史为: ", parsed)
    } else {
      console.log("没有获取到浏览器历史记录");
    }
  }, []);

  const saveHistory = (newHistory) => {
    console.log("saveHsitory: 存储历史记录城市" + newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setShowHistory(false);
    console.log("handleChange: 检测到变化, 历史面板设置为" + showHistory);

  }

  const handleFocus = () => {
    setShowHistory(true);
    setShowHistory(true);
    console.log("handleFocus: 聚焦了搜索框, 历史面板设置为" + showHistory);

    // console.log("handleFocus: showHistory为" + showHistory);
    console.log("handleFocus: history长度为" + history.length);
  }

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)) {
        setShowHistory(false);
        console.log("点击了外部, 历史面板设置为" + showHistory);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [])

  useEffect(() => {
    console.log('showHistory新值:', showHistory)  // true
  }, [showHistory])

  const handleSubmit = () => {
    // e.preventDefault();
    if (!city.trim()) return;

    const newHistory = [city.trim(), ...history.filter(item => item !== city.trim())].slice(0, MAX_HISTORY)

    setHistory(newHistory);
    saveHistory(newHistory);
    console.log("handleSubmit: 保存历史记录城市为" + newHistory);

    setShowHistory(false);
    console.log("handleSubmit: 将历史面板设置为" + showHistory);

  }

  const handleHistoryClick = (item) => {
    setCity(item);
    setShowHistory(false);
    inputRef.current?.focus();
    console.log("handleHistoryClick: 将历史面板设置为" + showHistory);
  }

  const handleDeleteHistory = (e, item) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    saveHistory(newHistory);
    console.log("handleDeleteHistory: 删除了历史记录" + newHistory);
  }

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
    console.log("handleClearHistory: 清空了历史记录");
  }

  const fetchWeather = async () => {
    if (!city) return

    setLoading(true)
    setError('')
    setWeather(null)
    setForecast(null)

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
  }

  const handleKeyDown = (e) => {
    if (showHistory && history.length != 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => prev < history.length - 1 ? prev + 1 : prev);
        console.log("handleKeyDown: 在历史记录面板中按了↓键")

      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        console.log("handleKeyDown: 在历史记录面板中按了↑键")

      } else if (e.key === 'Escape') {
        setShowHistory(false);
        console.log("handleKeyDown: 在历史记录面板中按了Esc键")
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleHistoryClick(history[highlightedIndex]);
        console.log("handleKeyDown: 在历史记录面板按了Enter键盘")
        console.log("handleKeyDown: 将" + history[highlightedIndex] + "置入搜索框");
      }
    } else if (e.key === 'Enter') {
      fetchWeather();
      handleSubmit();
      console.log("handleKeyDown: 历史记录面部未打开, 执行提交");
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) return '今天'
    return date.toLocaleDateString('zh-CN', { weekday: 'short', month: 'numeric', day: 'numeric' })
  }

  // 聚合预报数据为每日（取每天最高温、最低温、中午时段的天气图标）
  const dailyForecast = useMemo(() => {
    if (!Array.isArray(forecast)) return []

    const days = {}
    console.log(forecast)
    forecast.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0])

      if (!days[date]) {
        days[date] = {
          dt: item.dt,
          temps: [],
          noonIcon: null,
          noonDesc: '',
          firstIcon: '',
          firstDesc: ''
        }
      }

      days[date].temps.push(item.main.temp)

      // 记录12点的
      if (hour === 12) {
        days[date].noonIcon = item.weather[0].icon
        days[date].noonDesc = item.weather[0].description
      }

      // 记录第一个（最早的）
      if (!days[date].firstIcon) {
        days[date].firstIcon = item.weather[0].icon
        days[date].firstDesc = item.weather[0].description
      }
    })

    return Object.values(days)
      // .sort((a, b) => a.dt - b.dt)
      .slice(0, 6)
      .map((day, idx) => {
        const dateStr = new Date(day.dt * 1000).toLocaleDateString('zh-CN')
        console.log(`第${idx + 1}天:`, dateStr, '图标:', day.noonIcon ? '12点' : '最早', day.noonIcon || day.firstIcon)

        return {
          dt: day.dt,
          tempMax: Math.max(...day.temps),
          tempMin: Math.min(...day.temps),
          icon: day.noonIcon || day.firstIcon,
          description: day.noonDesc || day.firstDesc
        }
      })
  }, [forecast])

  // 获取天气图标对应的渐变背景
  const getWeatherGradient = (icon) => {
    if (!icon) return 'from-slate-100 to-slate-200'
    if (icon.includes('01') || icon.includes('02')) return 'from-amber-50 to-orange-100'
    if (icon.includes('03') || icon.includes('04')) return 'from-slate-100 to-gray-200'
    if (icon.includes('09') || icon.includes('10')) return 'from-blue-50 to-slate-200'
    if (icon.includes('11')) return 'from-slate-200 to-gray-300'
    if (icon.includes('13')) return 'from-slate-50 to-slate-200'
    return 'from-blue-50 to-indigo-100'
  }

  // 获取天气对应的文字颜色
  const getWeatherColor = (icon) => {
    if (!icon) return 'text-neutral-600'
    if (icon.includes('01') || icon.includes('02')) return 'text-amber-600'
    if (icon.includes('03') || icon.includes('04')) return 'text-gray-600'
    if (icon.includes('09') || icon.includes('10') || icon.includes('11')) return 'text-blue-600'
    return 'text-neutral-600'
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">

        <div className="relative mb-6">
          {/* 搜索区域 */}
          <SearchBar
            ref={inputRef}
            city={city}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onSearch={() => { fetchWeather(); handleSubmit() }}
            loading={loading}
          />

          {/* 历史记录下拉列表 */}
          <HistoryDropdown
            ref={historyRef}
            history={history}
            onClearHistory={handleClearHistory}
            onHistoryClick={handleHistoryClick}
            onHighlightedIndex={setHighlightedIndex}
            onDeleteHistory={handleDeleteHistory}
            highlightedIndex={highlightedIndex}
            showHistory={showHistory}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* 天气卡片 */}
        <WeatherCard
          weather={weather}
          dailyForecast={dailyForecast}
          formatDate={formatDate}
          formatTime={formatTime}
          getWeatherGradient={getWeatherGradient}
          getWeatherColor={getWeatherColor}
        />

        {/* 空状态 */}
        {/* {!weather && !loading && !error && (
          <div className="text-center py-12 text-neutral-400">
            <p className="text-sm">输入城市名称查看天气</p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default App