import { useState, useEffect } from 'react'

export default function CassetteClock() {
  const [time, setTime] = useState(new Date())
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15
      const y = (e.clientY / window.innerHeight - 0.5) * 15
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 计算指针角度
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourAngle = (hours * 30) + (minutes * 0.5)
  const minuteAngle = minutes * 6
  const secondAngle = seconds * 6

  // 格式化时间显示
  const formatTime = (num) => String(num).padStart(2, '0')
  const displayTime = `${formatTime(hours)}:${formatTime(minutes)}`
  const displaySeconds = formatTime(seconds)

  // 日期信息
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const weekday = ['日', '一', '二', '三', '四', '五', 六'][time.getDay()]
  const displayDate = `${year}.${formatTime(month)}.${formatTime(date)}`
  const displayWeekday = `周${weekday}`

  return (
    <div
      className="cassette-clock"
      style={{
        transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px) rotate(${mousePos.x * 0.3}deg)`,
      }}
    >
      <div className="cassette-clock-body">
        {/* 磁带孔 */}
        <div className="cassette-clock-holes">
          <div className="cassette-clock-hole"></div>
          <div className="cassette-clock-hole"></div>
        </div>

        {/* 磁带窗口 - 时钟表盘 */}
        <div className="cassette-clock-window">
          {/* 左卷轴 - 时针（带变速旋转动画） */}
          <div
            className="cassette-clock-reel left-reel"
            style={{
              animationDuration: `${3 + (seconds % 10) * 0.3}s`,
            }}
          >
            <div className="reel-center">
              <div
                className="reel-hand hour-hand"
                style={{ transform: `rotate(${hourAngle}deg)` }}
              >
                <div className="hand-tip"></div>
              </div>
            </div>
            <div className="reel-teeth">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="reel-tooth"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                ></div>
              ))}
            </div>
          </div>

          {/* 磁带 */}
          <div className="cassette-clock-tape"></div>

          {/* 右卷轴 - 分针（反向变速旋转） */}
          <div
            className="cassette-clock-reel right-reel"
            style={{
              animationDuration: `${2.5 + (minutes % 10) * 0.2}s`,
              animationDirection: 'reverse',
            }}
          >
            <div className="reel-center">
              <div
                className="reel-hand minute-hand"
                style={{ transform: `rotate(${minuteAngle}deg)` }}
              >
                <div className="hand-tip"></div>
              </div>
            </div>
            <div className="reel-teeth">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="reel-tooth"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                ></div>
              ))}
            </div>
          </div>

          {/* 中心秒针显示 */}
          <div className="cassette-clock-center">
            <div className="seconds-display">{displaySeconds}</div>
            <div className="center-dot"></div>
          </div>
        </div>

        {/* 标签 - 时间数字显示 */}
        <div className="cassette-clock-label">
          <div className="time-main">
            <span className="time-display">{displayTime}</span>
            <span className="seconds-small">:{displaySeconds}</span>
          </div>
          <div className="date-display">
            <span className="date-text">{displayDate}</span>
            <span className="date-separator">|</span>
            <span className="weekday-text">{displayWeekday}</span>
          </div>
          <span className="clock-brand">CASSETTE CHRONO</span>
        </div>

        {/* 底部装饰 */}
        <div className="cassette-clock-bottom">
          <div className="cassette-clock-groove"></div>
          <div className="cassette-clock-groove"></div>
          <div className="cassette-clock-groove"></div>
        </div>

        {/* 装饰螺丝 */}
        <div className="cassette-clock-screw screw-top-left"></div>
        <div className="cassette-clock-screw screw-top-right"></div>
        <div className="cassette-clock-screw screw-bottom-left"></div>
        <div className="cassette-clock-screw screw-bottom-right"></div>
      </div>

      {/* 时钟光晕效果 */}
      <div className="cassette-clock-glow"></div>
    </div>
  )
}
