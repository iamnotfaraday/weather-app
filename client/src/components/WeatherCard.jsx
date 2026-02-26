import TemperatureChart from "./TemperatureChart";

const WeatherCard = ({ weather, dailyForecast, formatDate, formatTime, getWeatherGradient}) => {
  if (!weather) return null;

  const gradient = getWeatherGradient(weather.weather[0].icon);
  const icon = weather.weather[0].icon;
  
  // 扩展浅色背景判断，覆盖更多晴天/多云情况
  const isLightBg = ["01d", "02d", "03d", "13d"].includes(icon) || 
                    icon.includes("d") && !["09d", "10d", "11d", "50d"].includes(icon);

  // 强制：浅色背景 = 深色文字，深色背景 = 白色文字
  const text = isLightBg
    ? {
        primary: "text-gray-900",      // 最深
        secondary: "text-gray-700",    // 中等
        muted: "text-gray-600",        // 较浅
        stroke: "drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]", // 白色微描边增加层次感
      }
    : {
        primary: "text-white",
        secondary: "text-white/90",
        muted: "text-white/70",
        stroke: "drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]", // 黑色阴影
      };

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-[2rem] p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-5xl mx-auto`}>
      {/* 主天气信息 */}
      <div className="text-center relative pb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className={`${text.muted} text-sm font-medium tracking-widest uppercase mb-1 ${text.stroke}`}>
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="flex items-center justify-center my-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
          <div className="space-y-1">
            <p className={`text-6xl font-light ${text.primary} tracking-tighter ${text.stroke}`}>
              {Math.round(weather.main.temp)}°
            </p>
            <p className={`${text.secondary} font-medium capitalize ${text.stroke}`}>
              {weather.weather[0].description}
            </p>
            <p className={`${text.muted} text-sm ${text.stroke}`}>
              体感 {Math.round(weather.main.feels_like)}°
            </p>
          </div>
        </div>
      </div>

      <div className={`h-px ${isLightBg ? "bg-gray-900/10" : "bg-white/20"} mb-6`} />

      {/* 未来预报 + 折线图 */}
      {dailyForecast.length > 0 && (
        <div className="mb-6">
          <h3 className={`${text.muted} text-xs font-medium uppercase tracking-wider mb-3 ${text.stroke}`}>
            未来预报
          </h3>

          {/* 预报卡片 */}
          <div className="flex justify-between gap-2 mb-4 overflow-x-auto pb-2">
            {dailyForecast.map((day, idx) => (
              <div
                key={idx}
                className={`flex-1 flex flex-col items-center p-2 sm:p-3 rounded-2xl min-w-[60px] backdrop-blur-md ${isLightBg ? "bg-white/30 border-gray-900/10" : "bg-white/10 border-white/20"} border hover:bg-white/40 transition-colors`}
              >
                <span className={`text-xs ${text.secondary} mb-1 font-medium ${text.stroke} whitespace-nowrap`}>
                  {formatDate(day.dt)}
                </span>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-8 h-8 mb-1"
                />
                <span className={`text-sm font-bold ${text.primary} ${text.stroke}`}>
                  {Math.round(day.tempMax)}°
                </span>
                <span className={`text-xs ${text.muted} ${text.stroke}`}>
                  {Math.round(day.tempMin)}°
                </span>
              </div>
            ))}
          </div>

          <TemperatureChart dailyForecast={dailyForecast} isLightBg={isLightBg} />
        </div>
      )}

      {dailyForecast.length > 0 && (
        <div className={`h-px ${isLightBg ? "bg-gray-900/10" : "bg-white/20"} mb-6`} />
      )}

      {/* 详情网格 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "湿度", value: `${weather.main.humidity}%`, icon: "💧" },
          { label: "风速", value: `${weather.wind.speed}m/s`, icon: "💨" },
          { label: "气压", value: `${weather.main.pressure}hPa`, icon: "🌡️" },
          { label: "能见度", value: `${(weather.visibility / 1000).toFixed(1)}km`, icon: "👁️" },
          { label: "日出", value: formatTime(weather.sys.sunrise), icon: "🌅" },
          { label: "日落", value: formatTime(weather.sys.sunset), icon: "🌇" },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl text-center backdrop-blur-md ${isLightBg ? "bg-white/30 border-gray-900/10" : "bg-white/10 border-white/20"} border hover:bg-white/40 transition-colors`}
          >
            <span className={`text-lg mb-1 block ${text.muted} ${text.stroke}`}>{item.icon}</span>
            <p className={`${text.primary} font-bold text-sm ${text.stroke}`}>{item.value}</p>
            <p className={`${text.muted} text-xs mt-0.5 ${text.stroke}`}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;