import { useState, useEffect } from 'react'

/**
 * 圆形时钟 Logo - 复古风格
 * 琥珀色主题，带有时针、分针、秒针
 */
export default function ClockLogo({ size = 200 }) {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  // 计算指针角度
  const secondDeg = seconds * 6
  const minuteDeg = minutes * 6 + seconds * 0.1
  const hourDeg = (hours % 12) * 30 + minutes * 0.5

  const scale = size / 200

  return (
    <div 
      className="clock-logo" 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0.8)'
      }}
    >
      {/* 外环 */}
      <div className="clock-outer-ring"></div>
      
      {/* 中环 */}
      <div className="clock-middle-ring"></div>
      
      {/* 表盘背景 */}
      <div className="clock-face">
        {/* 刻度 */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`clock-tick ${i % 3 === 0 ? 'major' : 'minor'}`}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-${90 * scale}px)`
            }}
          />
        ))}

        {/* 时针 */}
        <div
          className="clock-hand hour-hand"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        >
          <div className="hand-body"></div>
        </div>

        {/* 分针 */}
        <div
          className="clock-hand minute-hand"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        >
          <div className="hand-body"></div>
        </div>

        {/* 秒针 */}
        <div
          className="clock-hand second-hand"
          style={{ transform: `rotate(${secondDeg}deg)` }}
        >
          <div className="hand-body"></div>
          <div className="hand-tail"></div>
        </div>

        {/* 中心点 */}
        <div className="clock-center"></div>
      </div>

      {/* 装饰光环 */}
      <div className="clock-glow"></div>
    </div>
  )
}
