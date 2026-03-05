import { useState, useEffect, useRef } from 'react'

export default function Intro({ onComplete }) {
  const [isExpanding, setIsExpanding] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // 代码字符集
    const chars = '01TGXYZWABXY'
    const fontSize = 11

    // 四个球体
    const balls = [
      { x: 0.5, y: 0.5, radius: 0.12, angle: 0, speed: 0, orbitRadius: 0, isCenter: true },
      { x: 0.5, y: 0.5, radius: 0.08, angle: 0, speed: 0.008, orbitRadius: 0.2, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.06, angle: 2, speed: -0.012, orbitRadius: 0.28, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.07, angle: 4, speed: 0.006, orbitRadius: 0.35, isCenter: false },
    ]

    // 每列的下落位置
    const columns = Math.floor(width / fontSize)
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // 绘制代码雨
    const draw = () => {
      timeRef.current += 1

      // 半透明白色背景（反相效果），形成拖尾
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // 更新轨道球位置
      balls.forEach((ball, index) => {
        if (!ball.isCenter) {
          ball.angle += ball.speed
          ball.x = 0.5 + Math.cos(ball.angle) * ball.orbitRadius
          ball.y = 0.5 + Math.sin(ball.angle) * ball.orbitRadius
        }
      })

      // 绘制每个球体的代码雨
      balls.forEach((ball) => {
        const ballCenterX = ball.x * width
        const ballCenterY = ball.y * height
        const ballRadius = ball.radius * Math.min(width, height)

        // 脉搏效果
        const pulse = 1 + Math.sin(timeRef.current * 0.05) * 0.05
        const currentRadius = ballRadius * pulse

        // 使用圆形裁剪
        ctx.save()
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius, 0, Math.PI * 2)
        ctx.clip()

        ctx.font = `${fontSize}px monospace`

        // 绘制代码雨
        for (let i = 0; i < columns; i++) {
          const x = i * fontSize
          const y = (drops[i] * fontSize) % height

          // 检查点是否在球内
          const dx = x - ballCenterX
          const dy = y - ballCenterY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < currentRadius) {
            const brightness = 0.3 + Math.random() * 0.7
            ctx.fillStyle = `rgba(0, 0, 0, ${brightness})`
            const char = chars.charAt(Math.floor(Math.random() * chars.length))
            ctx.fillText(char, x, y)
          }
        }

        ctx.restore()

        // 绘制球体模糊光晕（融球效果关键）- 黑白渐变
        const gradient1 = ctx.createRadialGradient(
          ballCenterX, ballCenterY, currentRadius * 0.5,
          ballCenterX, ballCenterY, currentRadius * 1.5
        )
        gradient1.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
        gradient1.addColorStop(0.5, 'rgba(50, 50, 50, 0.1)')
        gradient1.addColorStop(1, 'rgba(100, 100, 100, 0)')
        ctx.fillStyle = gradient1
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // 第二层更淡的光晕（增强融合）
        const gradient2 = ctx.createRadialGradient(
          ballCenterX, ballCenterY, currentRadius * 0.8,
          ballCenterX, ballCenterY, currentRadius * 2.0
        )
        gradient2.addColorStop(0, 'rgba(30, 30, 30, 0.08)')
        gradient2.addColorStop(1, 'rgba(30, 30, 30, 0)')
        ctx.fillStyle = gradient2
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius * 2.0, 0, Math.PI * 2)
        ctx.fill()

        // 绘制球体边框（黑色，反相效果）
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius * 0.95, 0, Math.PI * 2)
        const pulseOpacity = 0.7 + Math.sin(timeRef.current * 0.05) * 0.3
        ctx.strokeStyle = `rgba(0, 0, 0, ${pulseOpacity})`
        ctx.lineWidth = 2.5
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 20
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      // 重置或继续下落
      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const handleClick = () => {
    setIsExpanding(true)
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 1500)
  }

  return (
    <div
      className={`intro-overlay ${isExpanding ? 'expanding' : ''}`}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="intro-canvas" />
      <div className="intro-title">
        <h1 className="title-text">汤圆的窝</h1>
      </div>
    </div>
  )
}
