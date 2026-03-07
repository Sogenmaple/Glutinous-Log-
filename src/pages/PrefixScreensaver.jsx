import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/PrefixScreensaver.css'

/**
 * 风格化前缀屏保
 * 完全复用 Intro 动画效果（代码雨 + 球体 + 扩散圆环 + 眼睛）
 */
export default function PrefixScreensaver() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [showExitHint, setShowExitHint] = useState(false)
  const [settings, setSettings] = useState({
    showMatrix: true,
    showBalls: true,
    showRings: true,
    showEyes: true,
    speed: 1.0
  })

  useEffect(() => {
    // 加载配置
    const saved = localStorage.getItem('prefix_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
    
    // 显示退出提示
    const timer = setTimeout(() => {
      setShowExitHint(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // 退出屏保
  const exitScreenSaver = useCallback(() => {
    navigate('/')
  }, [navigate])

  // 键盘/鼠标退出
  useEffect(() => {
    const handleInput = () => exitScreenSaver()
    
    window.addEventListener('keydown', handleInput)
    window.addEventListener('mousemove', handleInput)
    window.addEventListener('click', handleInput)
    window.addEventListener('touchstart', handleInput)
    
    return () => {
      window.removeEventListener('keydown', handleInput)
      window.removeEventListener('mousemove', handleInput)
      window.removeEventListener('click', handleInput)
      window.removeEventListener('touchstart', handleInput)
    }
  }, [exitScreenSaver])

  // Canvas 动画（完全复用 Intro）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    let time = 0

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // 代码字符集
    const chars = '01TGXYZWABXY'
    const fontSize = 11
    const columns = Math.floor(width / fontSize)
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // 四个球体
    const balls = [
      { x: 0.5, y: 0.5, radius: 0.12, angle: 0, speed: 0, orbitRadius: 0, isCenter: true },
      { x: 0.5, y: 0.5, radius: 0.08, angle: 0, speed: 0.015, orbitRadius: 0.2, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.06, angle: 2, speed: -0.02, orbitRadius: 0.28, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.07, angle: 4, speed: 0.012, orbitRadius: 0.35, isCenter: false },
    ]

    // 扩散圆环
    const rings = []
    const ringInterval = 100
    const maxRingRadius = 0.7

    // 眼睛
    const eyes = {
      left: { x: -0.3, y: -0.15, offsetX: 0, offsetY: 0 },
      right: { x: 0.3, y: -0.15, offsetX: 0, offsetY: 0 },
    }

    const mouseRef = { x: 0.5, y: 0.5 }
    const handleMouseMove = (e) => {
      const x = e.clientX / width
      const y = e.clientY / height
      mouseRef.current = { x, y }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      time += settings.speed
      
      // 半透明白色背景，形成拖尾
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // 更新球体位置
      balls.forEach((ball) => {
        if (!ball.isCenter && settings.showBalls) {
          ball.angle += ball.speed * settings.speed
          ball.x = 0.5 + Math.cos(ball.angle) * ball.orbitRadius
          ball.y = 0.5 + Math.sin(ball.angle) * ball.orbitRadius
        }
      })

      // 绘制代码雨
      if (settings.showMatrix) {
        ctx.fillStyle = '#0f0'
        ctx.font = `${fontSize}px monospace`
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i] += 1
        }
      }

      // 生成扩散圆环
      if (settings.showRings && time % ringInterval === 0) {
        rings.push({
          radius: 0.1,
          speed: 3,
          width: 1,
          opacity: 0.4,
        })
      }

      // 更新和绘制扩散圆环
      if (settings.showRings) {
        for (let i = rings.length - 1; i >= 0; i--) {
          const ring = rings[i]
          const decayFactor = Math.max(0.3, 1 - ring.radius / maxRingRadius)
          ring.speed = 3 * decayFactor
          ring.radius += ring.speed / Math.min(width, height)
          ring.width = 1 + (ring.radius / maxRingRadius) * 4
          ring.opacity = 0.4 * (1 - ring.radius / maxRingRadius)

          if (ring.radius >= maxRingRadius) {
            rings.splice(i, 1)
            continue
          }

          const ringPixelRadius = ring.radius * Math.min(width, height)

          ctx.beginPath()
          const segments = 360
          for (let angle = 0; angle <= segments; angle++) {
            const rad = (angle / segments) * Math.PI * 2
            let x = centerX + Math.cos(rad) * ringPixelRadius
            let y = centerY + Math.sin(rad) * ringPixelRadius

            balls.forEach((ball) => {
              if (ball.isCenter) return
              const ballX = ball.x * width
              const ballY = ball.y * height
              const ballRadius = ball.radius * Math.min(width, height)
              const dx = x - ballX
              const dy = y - ballY
              const distance = Math.sqrt(dx * dx + dy * dy)
              const influenceRadius = ballRadius * 3
              if (distance < influenceRadius) {
                const influence = 1 - distance / influenceRadius
                const noise1 = Math.sin(distance * 0.1 + time * 0.1) * 0.5
                const noise2 = Math.cos(distance * 0.2 - time * 0.15) * 0.3
                const noise3 = Math.sin((distance + time) * 0.05) * 0.2
                const noise = (noise1 + noise2 + noise3) * influence * 2
                x += noise
                y += noise
              }
            })

            if (angle === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }

          ctx.strokeStyle = `rgba(0, 0, 0, ${ring.opacity})`
          ctx.lineWidth = ring.width
          ctx.lineCap = 'round'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          ctx.shadowBlur = 8
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }

      // 绘制球体
      if (settings.showBalls) {
        balls.forEach((ball) => {
          const ballCenterX = ball.x * width
          const ballCenterY = ball.y * height
          const ballRadius = ball.radius * Math.min(width, height)
          const pulse = 1 + Math.sin(time * 0.05) * 0.05
          const currentRadius = ballRadius * pulse

          // 球体光晕
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

          // 球体边框
          const gradient2 = ctx.createRadialGradient(
            ballCenterX, ballCenterY, currentRadius * 0.8,
            ballCenterX, ballCenterY, currentRadius * 1.2
          )
          gradient2.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
          gradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)')
          gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.strokeStyle = gradient2
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(ballCenterX, ballCenterY, currentRadius, 0, Math.PI * 2)
          ctx.stroke()

          // 球体核心
          const coreGradient = ctx.createRadialGradient(
            ballCenterX - currentRadius * 0.3,
            ballCenterY - currentRadius * 0.3,
            0,
            ballCenterX,
            ballCenterY,
            currentRadius
          )
          coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
          coreGradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.4)')
          coreGradient.addColorStop(1, 'rgba(100, 100, 100, 0.1)')
          ctx.fillStyle = coreGradient
          ctx.beginPath()
          ctx.arc(ballCenterX, ballCenterY, currentRadius, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // 绘制眼睛
      if (settings.showEyes) {
        const eyeRadius = 0.18 * Math.min(width, height)
        const smoothFactor = 0.15
        const maxEyeOffset = 0.45

        const targetLeftX = (mouseRef.current.x - 0.5) * maxEyeOffset
        const targetLeftY = (mouseRef.current.y - 0.5) * maxEyeOffset
        eyes.left.offsetX += (targetLeftX - eyes.left.offsetX) * smoothFactor
        eyes.left.offsetY += (targetLeftY - eyes.left.offsetY) * smoothFactor
        eyes.right.offsetX += (targetLeftX - eyes.right.offsetX) * smoothFactor
        eyes.right.offsetY += (targetLeftY - eyes.right.offsetY) * smoothFactor

        const leftEyeX = centerX + eyes.left.offsetX * width + eyes.left.x * Math.min(width, height)
        const leftEyeY = centerY + eyes.left.offsetY * height + eyes.left.y * Math.min(width, height)
        const rightEyeX = centerX + eyes.right.offsetX * width + eyes.right.x * Math.min(width, height)
        const rightEyeY = centerY + eyes.right.offsetY * height + eyes.right.y * Math.min(width, height)

        // 左眼
        const leftGlow = ctx.createRadialGradient(leftEyeX, leftEyeY, 0, leftEyeX, leftEyeY, eyeRadius * 1.5)
        leftGlow.addColorStop(0, 'rgba(255, 50, 50, 0.4)')
        leftGlow.addColorStop(1, 'rgba(255, 0, 0, 0)')
        ctx.fillStyle = leftGlow
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius * 1.5, 0, Math.PI * 2)
        ctx.fill()

        const leftEye = ctx.createRadialGradient(leftEyeX - eyeRadius * 0.3, leftEyeY - eyeRadius * 0.3, 0, leftEyeX, leftEyeY, eyeRadius)
        leftEye.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        leftEye.addColorStop(0.5, 'rgba(255, 0, 0, 0.6)')
        leftEye.addColorStop(1, 'rgba(100, 0, 0, 0.1)')
        ctx.fillStyle = leftEye
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fill()

        // 右眼
        const rightGlow = ctx.createRadialGradient(rightEyeX, rightEyeY, 0, rightEyeX, rightEyeY, eyeRadius * 1.5)
        rightGlow.addColorStop(0, 'rgba(255, 50, 50, 0.4)')
        rightGlow.addColorStop(1, 'rgba(255, 0, 0, 0)')
        ctx.fillStyle = rightGlow
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius * 1.5, 0, Math.PI * 2)
        ctx.fill()

        const rightEye = ctx.createRadialGradient(rightEyeX - eyeRadius * 0.3, rightEyeY - eyeRadius * 0.3, 0, rightEyeX, rightEyeY, eyeRadius)
        rightEye.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        rightEye.addColorStop(0.5, 'rgba(255, 0, 0, 0.6)')
        rightEye.addColorStop(1, 'rgba(100, 0, 0, 0.1)')
        ctx.fillStyle = rightEye
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [settings])

  return (
    <div className="prefix-screensaver">
      <canvas ref={canvasRef} className="screensaver-canvas" />
      
      {showExitHint && (
        <div className="exit-hint-overlay">
          <div className="hint-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>按任意键、移动鼠标或点击退出屏保</span>
          </div>
        </div>
      )}
    </div>
  )
}
