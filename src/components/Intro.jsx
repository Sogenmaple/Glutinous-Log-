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
    const fontSize = 10

    // 全屏代码雨
    const columns = Math.floor(width / fontSize)
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // 四个球体
    const balls = [
      { x: 0.5, y: 0.5, radius: 0.12, angle: 0, speed: 0, orbitRadius: 0, isCenter: true },
      { x: 0.5, y: 0.5, radius: 0.08, angle: 0, speed: 0.008, orbitRadius: 0.2, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.06, angle: 2, speed: -0.012, orbitRadius: 0.28, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.07, angle: 4, speed: 0.006, orbitRadius: 0.35, isCenter: false },
    ]

    // 绘制代码雨
    const draw = () => {
      timeRef.current += 1

      const centerX = width / 2
      const centerY = height / 2

      // 更新轨道球位置
      balls.forEach((ball) => {
        if (!ball.isCenter) {
          ball.angle += ball.speed
          ball.x = 0.5 + Math.cos(ball.angle) * ball.orbitRadius
          ball.y = 0.5 + Math.sin(ball.angle) * ball.orbitRadius
        }
      })

      // 纯黑背景
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // 先绘制全屏代码雨（很淡的白色）
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
        const char = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(char, x, y)

        // 重置或继续下落
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      // 绘制球体（带融球效果）
      balls.forEach((ball) => {
        const ballCenterX = ball.x * width
        const ballCenterY = ball.y * height
        const ballRadius = ball.radius * Math.min(width, height)

        // 脉搏效果
        const pulse = 1 + Math.sin(timeRef.current * 0.05) * 0.05
        const currentRadius = ballRadius * pulse

        // 球体光晕（融球关键：大范围的模糊渐变）
        const glowGradient = ctx.createRadialGradient(
          ballCenterX, ballCenterY, currentRadius * 0.5,
          ballCenterX, ballCenterY, currentRadius * 2.5
        )
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        glowGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)')
        glowGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)')
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // 球体内清晰代码
        ctx.save()
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius, 0, Math.PI * 2)
        ctx.clip()

        ctx.font = `${fontSize}px monospace`

        // 在球体内绘制更多代码
        for (let col = 0; col < columns; col++) {
          const x = col * fontSize
          const y = (drops[col] * fontSize) % height

          const dx = x - ballCenterX
          const dy = y - ballCenterY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < currentRadius) {
            const brightness = 0.6 + Math.random() * 0.4
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
            const char = chars.charAt(Math.floor(Math.random() * chars.length))
            ctx.fillText(char, x, y)
          }
        }

        ctx.restore()

        // 球体边框
        ctx.beginPath()
        ctx.arc(ballCenterX, ballCenterY, currentRadius * 0.95, 0, Math.PI * 2)
        const borderOpacity = 0.5 + Math.sin(timeRef.current * 0.05) * 0.25
        ctx.strokeStyle = `rgba(255, 255, 255, ${borderOpacity})`
        ctx.lineWidth = 2
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
        ctx.shadowBlur = 20
        ctx.stroke()
        ctx.shadowBlur = 0
      })

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
    </div>
  )
}
