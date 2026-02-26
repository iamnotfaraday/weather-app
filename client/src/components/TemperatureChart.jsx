import { useRef, useEffect, useState } from "react";

const TemperatureChart = ({ dailyForecast, isLightBg }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (!dailyForecast || dailyForecast.length === 0) return null;

  const maxTemps = dailyForecast.map((d) => d.tempMax);
  const minTemps = dailyForecast.map((d) => d.tempMin);
  const allTemps = [...maxTemps, ...minTemps];
  const tempRange = Math.max(...allTemps) - Math.min(...allTemps) || 1;
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);

  // 布局计算
  const paddingX = 30; // 左右边距，给文字留空间
  const labelHeight = 16; // 文字标签高度
  const pointRadius = 2.5; // 小圆点半径
  
  // 计算 SVG 高度：顶部标签 + 图表区域 + 底部标签
  const chartHeight = 50;
  const totalHeight = labelHeight + chartHeight + labelHeight;
  
  const availableWidth = Math.max(containerWidth - paddingX * 2, dailyForecast.length * 35);
  const pointGap = availableWidth / (dailyForecast.length - 1 || 1);
  const svgWidth = availableWidth;

  // Y 坐标计算（在 chartHeight 范围内）
  const getY = (temp) => {
    const ratio = (temp - minTemp) / tempRange;
    return labelHeight + (1 - ratio) * chartHeight;
  };

  // 颜色
  const colorMax = isLightBg ? "#1f2937" : "#ffffff";
  const colorMin = isLightBg ? "#6b7280" : "#ffffff";

  return (
    <div 
      ref={containerRef}
      className={`rounded-2xl backdrop-blur-md bg-white/10 border ${isLightBg ? "border-white/40" : "border-white/20"} p-3`}
    >
      <svg
        width="100%"
        height={totalHeight}
        viewBox={`0 0 ${svgWidth + paddingX * 2} ${totalHeight}`}
        className="overflow-visible"
      >
        <g transform={`translate(${paddingX}, 0)`}>
          {/* 最高温折线 - 细实线 */}
          <polyline
            fill="none"
            stroke={colorMax}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={maxTemps.map((t, i) => `${i * pointGap},${getY(t)}`).join(" ")}
          />

          {/* 最低温折线 - 细实线 */}
          <polyline
            fill="none"
            stroke={colorMin}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={minTemps.map((t, i) => `${i * pointGap},${getY(t)}`).join(" ")}
          />

          {/* 最高温数据点和数值 */}
          {maxTemps.map((temp, idx) => {
            const x = idx * pointGap;
            const y = getY(temp);
            const isEdge = idx === 0 || idx === maxTemps.length - 1;
            
            return (
              <g key={`max-${idx}`}>
                {/* 小圆点 */}
                <circle cx={x} cy={y} r={pointRadius} fill={colorMax} />
                {/* 温度数值 - 放在点的上方，边缘点调整对齐 */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor={isEdge ? (idx === 0 ? "start" : "end") : "middle"}
                  fill={colorMax}
                  fontSize="10"
                  fontWeight="500"
                >
                  {Math.round(temp)}°
                </text>
              </g>
            );
          })}

          {/* 最低温数据点和数值 */}
          {minTemps.map((temp, idx) => {
            const x = idx * pointGap;
            const y = getY(temp);
            const isEdge = idx === 0 || idx === minTemps.length - 1;
            
            return (
              <g key={`min-${idx}`}>
                {/* 小圆点 */}
                <circle cx={x} cy={y} r={pointRadius} fill={colorMin} />
                {/* 温度数值 - 放在点的下方 */}
                <text
                  x={x}
                  y={y + 14}
                  textAnchor={isEdge ? (idx === 0 ? "start" : "end") : "middle"}
                  fill={colorMin}
                  fontSize="10"
                  fontWeight="400"
                >
                  {Math.round(temp)}°
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TemperatureChart;