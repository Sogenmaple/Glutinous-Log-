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
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
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
        {/* 磁带窗口 - 时钟表盘 */}
        <div className="cassette-clock-window">
          {/* 左卷轴 */}
          <div className="cassette-clock-reel left-reel">
            <div className="reel-spokes">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="reel-spoke"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                ></div>
              ))}
            </div>
            {/* 时针 */}
            <div
              className="reel-hand hour-hand"
              style={{ transform: `rotate(${hourAngle}deg)` }}
            >
              <div className="hand-bar"></div>
            </div>
            <div className="reel-hub"></div>
          </div>

          {/* 右卷轴 */}
          <div className="cassette-clock-reel right-reel">
            <div className="reel-spokes">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="reel-spoke"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                ></div>
              ))}
            </div>
            {/* 分针 */}
            <div
              className="reel-hand minute-hand"
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            >
              <div className="hand-bar"></div>
            </div>
            <div className="reel-hub"></div>
          </div>
        </div>

        {/* 时间显示区 */}
        <div className="cassette-clock-display">
          <div className="time-display">{displayTime}</div>
          <div className="date-display">
            <span className="date-text">{displayDate}</span>
            <span className="date-sep">·</span>
            <span className="weekday-text">{displayWeekday}</span>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="cassette-clock-deco-line"></div>
      </div>
    </div>
  )
}
