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

    // 初始填充黑色背景（避免 invert 后颜色不一致）
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

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

    // 中心球扩散圆环（物理水波纹效果）
    const rings = []
    const ringInterval = 100 // 每 100 帧生成一个圆环
    const maxRingRadius = 0.7 // 最大半径

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

      // 生成新的扩散圆环
      if (timeRef.current % ringInterval === 0) {
        rings.push({
          radius: 0.1, // 初始半径
          speed: 3, // 初始速度（快）
          width: 1, // 初始环宽
          opacity: 0.4, // 初始透明度
        })
      }

      // 更新和绘制扩散圆环（物理水波纹效果 + 轨道球扭曲）
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i]

        // 物理水波纹：速度随半径衰减（阻尼效果）
        const decayFactor = Math.max(0.3, 1 - ring.radius / maxRingRadius)
        ring.speed = 3 * decayFactor
        ring.radius += ring.speed / Math.min(width, height)

        // 环宽随半径增大（能量扩散）
        ring.width = 1 + (ring.radius / maxRingRadius) * 4

        // 透明度随半径减小（能量衰减）
        ring.opacity = 0.4 * (1 - ring.radius / maxRingRadius)

        if (ring.radius >= maxRingRadius) {
          rings.splice(i, 1)
          continue
        }

        const ringPixelRadius = ring.radius * Math.min(width, height)

        // 绘制扭曲的圆环（受轨道球影响）
        ctx.beginPath()
        const segments = 360
        for (let angle = 0; angle <= segments; angle++) {
          const rad = (angle / segments) * Math.PI * 2
          let x = centerX + Math.cos(rad) * ringPixelRadius
          let y = centerY + Math.sin(rad) * ringPixelRadius

          // 计算每个轨道球对这个点的噪点式扰动
          balls.forEach((ball) => {
            if (ball.isCenter) return

            const ballX = ball.x * width
            const ballY = ball.y * height
            const ballRadius = ball.radius * Math.min(width, height)

            const dx = x - ballX
            const dy = y - ballY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const influenceRadius = ballRadius * 3

            // 如果点在影响范围内，添加噪点式扰动
            if (distance < influenceRadius) {
              const influence = 1 - distance / influenceRadius
              // 使用多个频率的噪声叠加，产生不规则扰动
              const noise1 = Math.sin(distance * 0.1 + timeRef.current * 0.1) * 0.5
              const noise2 = Math.cos(distance * 0.2 - timeRef.current * 0.15) * 0.3
              const noise3 = Math.sin((distance + timeRef.current) * 0.05) * 0.2
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

      // 第一遍：绘制球体光晕和边框（最底层）
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

      // 第二遍：绘制代码雨（在球体之上，眼睛之下）
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

      // 第三遍：绘制中心球眼睛（最上层，在所有元素之上）
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
      // resize 后重新填充黑色背景
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)
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
