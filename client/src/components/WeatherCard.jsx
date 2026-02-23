import { forwardRef } from "react";

const WeatherCard = ({ weather, dailyForecast, formatDate, formatTime, getWeatherGradient ,getWeatherColor}) => {
  if (!weather) return null;

  return (
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
  )
}

export default WeatherCard