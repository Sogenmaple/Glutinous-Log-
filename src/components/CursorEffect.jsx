import { useEffect } from 'react'

/**
 * 极简光标粒子效果
 * 细腻的白色/琥珀色光点拖尾
 */
export default function CursorEffect() {
  useEffect(() => {
    // 仅在桌面端启用
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return
    }

    // 创建粒子容器
    const container = document.createElement('div')
    container.id = 'cursor-particles'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
      overflow: hidden;
    `
    document.body.appendChild(container)

    let particles = []
    let mouseX = 0
    let mouseY = 0
    let lastX = 0
    let lastY = 0

    // 创建优雅粒子 - 黑白配色
    function createParticle(x, y, size = 'normal') {
      const particle = document.createElement('div')
      // 黑白两色随机，黑色为主
      const colors = ['#000000', '#000000', '#000000', '#ffffff']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      const particleSize = size === 'large' ? 
        (Math.random() * 5 + 5) : 
        (Math.random() * 3 + 2)
      
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        border: 2px solid ${color === '#000000' ? '#ffffff' : '#000000'};
        box-shadow: 0 0 ${particleSize}px ${color};
        opacity: 0.8;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
      `
      
      container.appendChild(particle)
      
      particles.push({
        element: particle,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
        decay: Math.random() * 0.015 + 0.02,
        size: particleSize
      })
    }

    // 更新粒子
    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        
        const scale = p.life
        const opacity = p.life * 0.6
        
        p.element.style.left = `${p.x}px`
        p.element.style.top = `${p.y}px`
        p.element.style.opacity = opacity
        p.element.style.transform = `translate(-50%, -50%) scale(${scale})`
        
        if (p.life <= 0) {
          p.element.remove()
          particles.splice(i, 1)
        }
      }
      
      requestAnimationFrame(updateParticles)
    }

    // 鼠标移动事件
    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // 计算移动距离
      const distance = Math.sqrt(
        Math.pow(mouseX - lastX, 2) + 
        Math.pow(mouseY - lastY, 2)
      )
      
      // 根据移动速度生成粒子
      if (distance > 2) {
        const particleCount = Math.min(Math.floor(distance / 3), 3)
        for (let i = 0; i < particleCount; i++) {
          const t = i / particleCount
          const x = lastX + (mouseX - lastX) * t
          const y = lastY + (mouseY - lastY) * t
          createParticle(x, y)
        }
      }
      
      lastX = mouseX
      lastY = mouseY
    }

    // 点击时创建优雅波纹和粒子 - 所有页面启用黑白粒子
    function handleClick(e) {
      // 黑白粒子爆发效果
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const radius = 25
        createParticle(
          e.clientX + Math.cos(angle) * radius,
          e.clientY + Math.sin(angle) * radius,
          'large'
        )
      }
      
      // 波纹效果
      const ripple = document.createElement('div')
      ripple.className = 'cursor-ripple'
      ripple.style.left = `${e.clientX - 15}px`
      ripple.style.top = `${e.clientY - 15}px`
      document.body.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 500)
    }

    // 悬停可交互元素 - 所有页面启用黑白粒子
    function handleMouseOver(e) {
      const target = e.target
      
      if (target.matches('a, button, .nav-item, .post-card, [role="button"], .manga-home-channel')) {
        // 创建光环粒子
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const radius = 30
          createParticle(
            e.clientX + Math.cos(angle) * radius,
            e.clientY + Math.sin(angle) * radius
          )
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('mouseover', handleMouseOver)
    
    // 启动动画循环
    updateParticles()

    // 清理
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mouseover', handleMouseOver)
      container.remove()
      particles = []
    }
  }, [])

  return null
}
