import { useState, useEffect, useRef } from 'react'

export default function Intro({ onComplete }) {
  const [isExpanding, setIsExpanding] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [eyeParams, setEyeParams] = useState({
    eyeRadius: 0.18,
    baseOffsetX: 0.45,
    baseOffsetY: 0.2,
    maxEyeOffset: 0.3,
    smoothFactor: 0.15,
    eyeOpacity: 0.95,
    glowOpacity: 0.4,
  })
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

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
      { x: 0.5, y: 0.5, radius: 0.08, angle: 0, speed: 0.008, orbitRadius: 0.2, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.06, angle: 2, speed: -0.012, orbitRadius: 0.28, isCenter: false },
      { x: 0.5, y: 0.5, radius: 0.07, angle: 4, speed: 0.006, orbitRadius: 0.35, isCenter: false },
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

      ctx.font = `${fontSize}px monospace`

      // 绘制全屏代码雨（黑色）
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

      // 绘制球体区域（第一遍：光晕和边框）
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

      // 绘制中心球（眼睛 + 边框，在所有其他球体之后）
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
      
      {/* 调试面板切换按钮 */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowDebug(!showDebug); }}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        {showDebug ? '隐藏调试' : '调试模式'}
      </button>

      {/* 调试面板 */}
      {showDebug && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            zIndex: 1000,
            width: '280px',
            padding: '15px',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
            👀 眼睛参数
          </h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              眼睛半径：{eyeParams.eyeRadius.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.05"
              max="0.35"
              step="0.01"
              value={eyeParams.eyeRadius}
              onChange={(e) => setEyeParams({ ...eyeParams, eyeRadius: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              眼睛间距 X：{eyeParams.baseOffsetX.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.2"
              max="0.7"
              step="0.01"
              value={eyeParams.baseOffsetX}
              onChange={(e) => setEyeParams({ ...eyeParams, baseOffsetX: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              眼睛位置 Y：{eyeParams.baseOffsetY.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.01"
              value={eyeParams.baseOffsetY}
              onChange={(e) => setEyeParams({ ...eyeParams, baseOffsetY: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              最大偏移：{eyeParams.maxEyeOffset.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.01"
              value={eyeParams.maxEyeOffset}
              onChange={(e) => setEyeParams({ ...eyeParams, maxEyeOffset: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              平滑因子：{eyeParams.smoothFactor.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.02"
              max="0.3"
              step="0.01"
              value={eyeParams.smoothFactor}
              onChange={(e) => setEyeParams({ ...eyeParams, smoothFactor: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              眼睛不透明度：{eyeParams.eyeOpacity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.01"
              value={eyeParams.eyeOpacity}
              onChange={(e) => setEyeParams({ ...eyeParams, eyeOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>
              光晕强度：{eyeParams.glowOpacity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.01"
              value={eyeParams.glowOpacity}
              onChange={(e) => setEyeParams({ ...eyeParams, glowOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          <button
            onClick={() => setEyeParams({
              eyeRadius: 0.18,
              baseOffsetX: 0.45,
              baseOffsetY: 0.2,
              maxEyeOffset: 0.3,
              smoothFactor: 0.15,
              eyeOpacity: 0.95,
              glowOpacity: 0.4,
            })}
            style={{
              width: '100%',
              padding: '6px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            重置默认值
          </button>
        </div>
      )}
    </div>
  )
}
