import { useState, useMemo } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    if (!city) return

    setLoading(true)
    setError('')
    setWeather(null)
    setForecast(null)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const currentWeatherPromise = fetch(`${baseUrl}/api/weather?city=${city}`).then(res => res.json())
      const forecastPromise = fetch(`${baseUrl}/api/forecast?city=${city}`).then(res => res.json())

      const [weatherRes, forecastRes] = await Promise.all([currentWeatherPromise, forecastPromise])

      if (!weatherRes.success) {
        throw new Error(weatherRes.message)
      }
      if (!forecastRes.success) {
        throw new Error(forecastRes.message)
      }

      setWeather(weatherRes.data)
      setForecast(forecastRes.data)
    } catch (err) {
      setError(err.message || '查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather()
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
      .sort((a, b) => a.dt - b.dt)
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

        {/* 搜索区域 */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-2 mb-6 transition-shadow hover:shadow-md">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 px-5 py-4 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none text-lg"
              placeholder="输入城市名称..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="px-6 py-3 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 disabled:bg-neutral-300 transition-all duration-300 font-medium text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
              ) : (
                '查询'
              )}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* 天气结果 */}
        {weather && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* 主卡片 - 当前天气 */}
            <div className={`bg-gradient-to-br ${getWeatherGradient(weather.weather[0].icon)} rounded-3xl p-8 text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="relative z-10">
                <h2 className="text-neutral-600 text-sm font-medium tracking-widest uppercase mb-1">
                  {weather.name}, {weather.sys.country}
                </h2>

                <div className="flex items-center justify-center my-6">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-28 h-28 drop-shadow-lg"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-6xl font-light text-neutral-800 tracking-tighter">
                    {Math.round(weather.main.temp)}°
                  </p>
                  <p className="text-neutral-600 font-medium capitalize">
                    {weather.weather[0].description}
                  </p>
                  <p className="text-neutral-400 text-sm">
                    体感 {Math.round(weather.main.feels_like)}°
                  </p>
                </div>

                <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-neutral-200/50">
                  <div className="text-center">
                    <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">最高</p>
                    <p className="text-xl font-semibold text-neutral-700">{Math.round(weather.main.temp_max)}°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">最低</p>
                    <p className="text-xl font-semibold text-neutral-700">{Math.round(weather.main.temp_min)}°</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 未来预报 - 横向滚动 */}
            {dailyForecast.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-neutral-100">
                <h3 className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-4">未来预报</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {dailyForecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 flex flex-col items-center p-3 rounded-2xl bg-neutral-50 min-w-[80px] hover:bg-neutral-100 transition-colors"
                    >
                      <span className="text-xs text-neutral-500 mb-2 font-medium">
                        {formatDate(day.dt)}
                      </span>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        className="w-10 h-10 mb-1"
                      />
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-sm font-semibold ${getWeatherColor(day.icon)}`}>
                          {Math.round(day.tempMax)}°
                        </span>
                        <span className="text-xs text-neutral-400">
                          {Math.round(day.tempMin)}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 详情网格 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '湿度', value: `${weather.main.humidity}%`, icon: '💧' },
                { label: '风速', value: `${weather.wind.speed}m/s`, icon: '💨' },
                { label: '气压', value: `${weather.main.pressure}hPa`, icon: '🌡️' },
                { label: '能见度', value: `${(weather.visibility / 1000).toFixed(1)}km`, icon: '👁️' },
                { label: '日出', value: formatTime(weather.sys.sunrise), icon: '🌅' },
                { label: '日落', value: formatTime(weather.sys.sunset), icon: '🌇' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 text-center border border-neutral-100 hover:border-neutral-200 transition-colors group"
                >
                  <span className="text-lg mb-2 block opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  <p className="text-neutral-900 font-semibold text-sm">{item.value}</p>
                  <p className="text-neutral-400 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 空状态 */}
        {!weather && !loading && !error && (
          <div className="text-center py-12 text-neutral-400">
            <p className="text-sm">输入城市名称查看天气</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App