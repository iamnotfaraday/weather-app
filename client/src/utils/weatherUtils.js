export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) return '今天'
  return date.toLocaleDateString('zh-CN', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

// 获取天气图标对应的渐变背景
export const getWeatherGradient = (icon) => {
  if (!icon) return 'from-slate-100 to-slate-200'
  if (icon.includes('01') || icon.includes('02')) return 'from-amber-50 to-orange-100'
  if (icon.includes('03') || icon.includes('04')) return 'from-slate-100 to-gray-200'
  if (icon.includes('09') || icon.includes('10')) return 'from-blue-50 to-slate-200'
  if (icon.includes('11')) return 'from-slate-200 to-gray-300'
  if (icon.includes('13')) return 'from-slate-50 to-slate-200'
  return 'from-blue-50 to-indigo-100'
}



// 聚合预报数据为每日（取每天最高温、最低温、中午时段的天气图标）
export const processDailyForecast = (forecast) => {
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
}