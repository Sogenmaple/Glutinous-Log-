import { useState, useEffect, useRef } from 'react'

export default function Intro({ onComplete }) {
  const [isExpanding, setIsExpanding] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  // 眼睛参数配置
  const eyeParams = {
    eyeRadius: 0.18,
    baseOffsetX: 0.45,
    baseOffsetY: 0,      // 上下居中
    maxEyeOffset: 0.45,  // 增大活动范围
    smoothFactor: 0.15,
    eyeOpacity: 0.95,
    glowOpacity: 0.4,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // 代码字符集
    const chars = '01TGXYZWABXY'
    const fontSize = 11

    // 全屏代码雨
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

    // 眼睛参数
    const eyes = {
      left: { x: -0.3, y: -0.15, offsetX: 0, offsetY: 0 },
      right: { x: 0.3, y: -0.15, offsetX: 0, offsetY: 0 },
    }

    // 鼠标/触摸移动
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / width
      const y = (e.clientY - rect.top) / height
      mouseRef.current = { x, y }
    }

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.touches[0].clientX - rect.left) / width
      const y = (e.touches[0].clientY - rect.top) / height
      mouseRef.current = { x, y }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove)

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

      // 半透明白色背景，形成拖尾
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(0, 0, width, height)

      // 第一遍：绘制激光线（最底层）
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const ball1 = balls[i]
          const ball2 = balls[j]

          const x1 = ball1.x * width
          const y1 = ball1.y * height
          const x2 = ball2.x * width
          const y2 = ball2.y * height

          const ballRadius1 = ball1.radius * Math.min(width, height)
          const ballRadius2 = ball2.radius * Math.min(width, height)
          const pulse1 = 1 + Math.sin(timeRef.current * 0.05) * 0.05
          const pulse2 = 1 + Math.sin(timeRef.current * 0.05) * 0.05
          const currentRadius1 = ballRadius1 * pulse1
          const currentRadius2 = ballRadius2 * pulse2

          const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
          const maxDistance = Math.min(width, height) * 0.6
          const distanceRatio = Math.min(distance / maxDistance, 1)

          // 根据距离计算线的数量、粗细和透明度
          const lineCount = Math.floor(2 + distanceRatio * 3) // 2-5 条线
          const baseLineWidth = 1.2 + distanceRatio * 1.5 // 1.2-2.7px
          const baseOpacity = 0.25 + distanceRatio * 0.3 // 0.25-0.55

          // 计算球体之间的角度
          const angle = Math.atan2(y2 - y1, x2 - x1)

          // 绘制多条激光线，连接点在球体边缘
          for (let line = 0; line < lineCount; line++) {
            // 每条线的偏移角度不同，连接点在边缘不同位置
            const edgeAngleOffset = (line - (lineCount - 1) / 2) * 0.1
            const startEdgeAngle = angle + edgeAngleOffset
            const endEdgeAngle = angle + Math.PI + edgeAngleOffset

            // 连接点在球体边缘（确保连续）
            const startX = x1 + Math.cos(startEdgeAngle) * currentRadius1 * 0.92
            const startY = y1 + Math.sin(startEdgeAngle) * currentRadius1 * 0.92
            const endX = x2 + Math.cos(endEdgeAngle) * currentRadius2 * 0.92
            const endY = y2 + Math.sin(endEdgeAngle) * currentRadius2 * 0.92

            const opacity = baseOpacity * (1 - Math.abs(line - (lineCount - 1) / 2) / (lineCount + 1))
            const lineWidth = baseLineWidth * (1 - Math.abs(line - (lineCount - 1) / 2) / (lineCount * 2))

            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            // 使用黑色，经过 invert(1) 后变成白色
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            // 黑色光晕，经过 invert(1) 后变成白色光晕
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 10 + distanceRatio * 12
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        }
      }

      // 第二遍：绘制代码雨（在激光线之上，球体之下）
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        const char = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(char, x, y)

        // 重置或继续下落
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      // 第三遍：绘制球体光晕和边框（中间层）
      balls.forEach((ball) => {
        const ballCenterX = ball.x * width
        const ballCenterY = ball.y * height
        const ballRadius = ball.radius * Math.min(width, height)

        // 脉搏效果
        const pulse = 1 + Math.sin(timeRef.current * 0.05) * 0.05
        const currentRadius = ballRadius * pulse

        // 球体光晕（融球关键）
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

        // 第二层光晕
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

        // 球体边框（中心球不绘制边框，避免白线）
        if (!ball.isCenter) {
          ctx.beginPath()
          ctx.arc(ballCenterX, ballCenterY, currentRadius * 0.95, 0, Math.PI * 2)
          const pulseOpacity = 0.6 + Math.sin(timeRef.current * 0.05) * 0.25
          ctx.strokeStyle = `rgba(0, 0, 0, ${pulseOpacity})`
          ctx.lineWidth = 2.5
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
          ctx.shadowBlur = 20
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      })

      // 第四遍：绘制中心球眼睛（最上层，在所有元素之上）
      const centerBall = balls.find(b => b.isCenter)
      if (centerBall) {
        const ballCenterX = centerBall.x * width
        const ballCenterY = centerBall.y * height
        const ballRadius = centerBall.radius * Math.min(width, height)
        const pulse = 1 + Math.sin(timeRef.current * 0.05) * 0.05
        const currentRadius = ballRadius * pulse

        const eyeRadius = currentRadius * eyeParams.eyeRadius
        const baseOffsetX = currentRadius * eyeParams.baseOffsetX
        const baseOffsetY = currentRadius * eyeParams.baseOffsetY
        const maxEyeOffset = currentRadius * eyeParams.maxEyeOffset

        // 计算鼠标方向
        const dx = mouseRef.current.x - 0.5
        const dy = mouseRef.current.y - 0.5

        // 平滑插值 - 眼睛
        const smoothFactor = eyeParams.smoothFactor
        eyes.left.offsetX += (dx * maxEyeOffset - eyes.left.offsetX) * smoothFactor
        eyes.left.offsetY += (dy * maxEyeOffset - eyes.left.offsetY) * smoothFactor
        eyes.right.offsetX += (dx * maxEyeOffset - eyes.right.offsetX) * smoothFactor
        eyes.right.offsetY += (dy * maxEyeOffset - eyes.right.offsetY) * smoothFactor

        // 绘制左眼（带模糊光晕）
        const leftBaseX = ballCenterX - baseOffsetX
        const leftBaseY = ballCenterY - baseOffsetY
        const leftEyeX = leftBaseX + eyes.left.offsetX
        const leftEyeY = leftBaseY + eyes.left.offsetY

        // 左眼光晕
        const leftGlow = ctx.createRadialGradient(
          leftEyeX, leftEyeY, eyeRadius * 0.5,
          leftEyeX, leftEyeY, eyeRadius * 2.5
        )
        leftGlow.addColorStop(0, `rgba(255, 255, 255, ${eyeParams.glowOpacity})`)
        leftGlow.addColorStop(0.5, `rgba(255, 255, 255, ${eyeParams.glowOpacity * 0.375})`)
        leftGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = leftGlow
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // 左眼主体（圆形）
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${eyeParams.eyeOpacity})`
        ctx.fill()

        // 绘制右眼（带模糊光晕）
        const rightBaseX = ballCenterX + baseOffsetX
        const rightBaseY = ballCenterY - baseOffsetY
        const rightEyeX = rightBaseX + eyes.right.offsetX
        const rightEyeY = rightBaseY + eyes.right.offsetY

        // 右眼光晕
        const rightGlow = ctx.createRadialGradient(
          rightEyeX, rightEyeY, eyeRadius * 0.5,
          rightEyeX, rightEyeY, eyeRadius * 2.5
        )
        rightGlow.addColorStop(0, `rgba(255, 255, 255, ${eyeParams.glowOpacity})`)
        rightGlow.addColorStop(0.5, `rgba(255, 255, 255, ${eyeParams.glowOpacity * 0.375})`)
        rightGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = rightGlow
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // 右眼主体（圆形）
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${eyeParams.eyeOpacity})`
        ctx.fill()
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
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
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
