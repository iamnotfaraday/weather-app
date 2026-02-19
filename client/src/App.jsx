import { useState } from 'react' // 相当于 Vue 的 import { ref } from 'vue'

function App() {
  // 【Vue 对比】const city = ref('')  ->  const [city, setCity] = useState('')
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 【Vue 对比】const fetchWeather = async () => { ... }
  const fetchWeather = async () => {
    if (!city) return
    
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      // 获取环境变量中的后端地址
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/weather?city=${city}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setWeather(data.data)
    } catch (err) {
      setError(err.message || '查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理回车键搜索
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather()
  }

  return (
    // Tailwind 类名：flex 居中，min-h-screen 最小高度全屏，bg-gray-100 背景色
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          🌤️ 天气查询
        </h1>

        {/* 搜索框区域 */}
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入城市名 (如 Beijing)"
            value={city}
            onChange={(e) => setCity(e.target.value)} // 【Vue 对比】v-model 的手动实现
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-6 py-2 text-white bg-blue-500 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '加载中...' : '查询'}
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* 天气结果展示 */}
        {weather && (
          <div className="p-4 text-center bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold">{weather.name}</h2>
            <p className="text-gray-600">
              {weather.weather[0].description} {/* 例如：clear sky */}
            </p>
            <p className="text-4xl font-bold text-blue-600 my-4">
              {Math.round(weather.main.temp)}°C
            </p>
            <div className="flex justify-around text-sm text-gray-500">
              <span>💧 湿度：{weather.main.humidity}%</span>
              <span>💨 风速：{weather.wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App