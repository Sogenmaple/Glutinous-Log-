import { useState, useEffect, useRef } from 'react'

export default function Intro({ onComplete }) {
  const [isExpanding, setIsExpanding] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    // 代码字符集
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const fontSize = 14
    const columns = Math.floor(width / fontSize)

    // 每列的下落位置
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // 扩展动画
    let expandRadius = 0
    if (isExpanding) {
      const expandAnimation = () => {
        expandRadius += 50
        if (expandRadius < Math.max(width, height) * 2) {
          requestAnimationFrame(expandAnimation)
        }
      }
      expandAnimation()
    }

    // 绘制代码雨
    const draw = () => {
      // 半透明黑色背景，形成拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, width, height)

      // 只绘制圆形区域内的代码
      const centerX = width / 2
      const centerY = height / 2
      const baseRadius = Math.min(width, height) * 0.15
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.08
      const radius = baseRadius * pulse

      // 使用圆形裁剪
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.clip()

      ctx.fillStyle = '#00ff00'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize

        // 添加亮度变化
        const brightness = 0.5 + Math.random() * 0.5
        ctx.fillStyle = `rgba(0, 255, ${Math.floor(brightness * 255)}, ${brightness})`

        const char = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(char, x, y)

        // 重置或继续下落
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      ctx.restore()

      // 绘制圆形边框光晕
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 255, 0, ${0.4 + Math.sin(Date.now() * 0.003) * 0.15})`
      ctx.lineWidth = 2
      ctx.shadowColor = '#00ff00'
      ctx.shadowBlur = 20
      ctx.stroke()
      ctx.shadowBlur = 0

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
      <div className="intro-hint">
        <span className="hint-text">点击进入</span>
        <span className="hint-cursor">_</span>
      </div>
    </div>
  )
}
