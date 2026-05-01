import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GameIcon, BookIcon, UserIcon, ToolIcon,
  GithubIcon, VideoIcon, ShopIcon, ChatIcon,
  StarIcon, TrophyIcon, ClockIcon, CodeIcon
} from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/NewspaperHome.css'
import '../styles/MobileHome.css'

/**
 * 漫画网点 Canvas 粒子系统
 * 三层随机点阵，对角线流动效果（左上→右下）
 */
function MangaHalftoneCanvas() {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])

  // 粒子大小分类
  const SIZES = [
    { size: 1.0, weight: 1 },   // 大点
    { size: 0.7, weight: 1 },   // 中点
    { size: 0.5, weight: 1 },   // 小点
  ]
  const OPACITY = 0.15

  // 3秒穿过屏幕的速度
  const CROSS_TIME = 3 // seconds

  const createParticle = useCallback((w, h) => {
    const sizeEntry = SIZES[Math.floor(Math.random() * SIZES.length)]
    // 对角线速度：沿 45° 方向，速度由屏幕对角线长度决定
    const diagonal = Math.sqrt(w * w + h * h)
    const speed = diagonal / (CROSS_TIME * 60) // pixels per frame at 60fps
    return {
      x: Math.random() * (w + 100) - 50,
      y: Math.random() * (h + 100) - 50,
      size: sizeEntry.size,
      speed,
      opacity: OPACITY,
    }
  }, [])

  const initParticles = useCallback((w, h) => {
    // 密度：每 200px² 一个点
    const area = w * h
    const count = Math.floor(area / 200)
    const particles = []
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(w, h))
    }
    return particles
  }, [createParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      particlesRef.current = initParticles(window.innerWidth, window.innerHeight)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const particles = particlesRef.current

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // 沿对角线移动（右下 45°）
        p.x += p.speed
        p.y += p.speed

        // 超出右下角区域 → 回收
        if (p.x > w + 50 || p.y > h + 50) {
          particles[i] = createParticle(w, h)
        }
      }

      // 批量绘制
      ctx.fillStyle = `rgba(0, 0, 0, ${OPACITY})`
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [initParticles, createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="manga-halftone-canvas"
      aria-hidden="true"
    />
  )
}

/**
 * 汤圆的小窝 - 黑白漫画风格首页
 * 模仿游戏宇宙页面风格，只保留四个核心版块
 */
export default function NewspaperHome() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [hoveredChannel, setHoveredChannel] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 四个核心版块 - 汤圆主题
  const mainChannels = [
    {
      id: 'games',
      title: '汤圆的作品集',
      subtitle: "TANGYUAN'S PORTFOLIO",
      desc: '创意是生活的燃料 · 独立游戏作品展示',
      icon: GameIcon,
      path: '/games',
      color: 'black',
      tags: ['CiGA', 'GGJ', '聚光灯', '独立游戏']
    },
    {
      id: 'special',
      title: '汤圆的工具',
      subtitle: "TANGYUAN'S TOOLS",
      desc: '总有些美味的怪诞 · 实用工具与休闲游戏',
      icon: ToolIcon,
      path: '/special',
      color: 'black',
      tags: ['番茄钟', '计算器', '扫雷', '贪吃蛇']
    },
    {
      id: 'blog',
      title: '汤圆的博客',
      subtitle: "TANGYUAN'S BLOG",
      desc: '游戏 · 生活 · 随笔 · 技术分享',
      icon: BookIcon,
      path: '/blog',
      color: 'black',
      tags: ['项目', '技术', '设计', '随笔']
    },
    {
      id: 'about',
      title: '汤圆的关于',
      subtitle: 'ABOUT TANGYUAN',
      desc: '开发者信息 · 联系方式 · 社交网络',
      icon: UserIcon,
      path: '/about',
      color: 'black',
      tags: ['技能', '联系', '社交', '更多']
    }
  ]

  // 社交链接
  const socialLinks = [
    { name: 'GITHUB', path: 'https://github.com/Sogenmaple', icon: GithubIcon },
    { name: 'BILIBILI', path: 'https://space.bilibili.com/389369217', icon: VideoIcon },
    { name: 'TAPTAP', path: 'https://www.taptap.cn/developer/338837', icon: ShopIcon },
    { name: 'QQ 群', path: 'https://qm.qq.com/q/AxbQpuKKsK', icon: ChatIcon }
  ]

  // 计算环形钟角度
  const seconds = currentTime.getSeconds()
  const minutes = currentTime.getMinutes()
  const hours = currentTime.getHours() % 12
  
  const secondAngle = (seconds / 60) * 360
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360
  const hourAngle = ((hours + minutes / 60) / 12) * 360

  // 移动端布局 - 手机系统风格
  if (isMobile) {
    return (
      <div className="mobile-home-page">
        <Header />
        
        <div className="mobile-home-container">
          {/* 状态栏 */}
          <div className="mobile-status-bar">
            <span className="time">{currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="date">{currentTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
          </div>

          {/* 标题 */}
          <div className="mobile-home-title">
            <h1>湯圓的小窩</h1>
            <span className="subtitle">TANGYUAN'S CREATIVE CORNER</span>
          </div>

          {/* App 图标网格 */}
          <div className="app-grid">
            {mainChannels.map((channel) => {
              const IconComp = channel.icon
              return (
                <div
                  key={channel.id}
                  className="app-icon-wrapper"
                  onClick={() => navigate(channel.path)}
                >
                  <div className="app-icon" style={{ background: channel.color }}>
                    <IconComp size={36} color="white" />
                  </div>
                  <span className="app-name">{channel.title}</span>
                </div>
              )
            })}
          </div>

          {/* Dock 栏 */}
          <div className="mobile-dock">
            {socialLinks.map((link, i) => {
              const LinkIcon = link.icon
              return (
                <a
                  key={i}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dock-item"
                >
                  <div className="dock-icon">
                    <LinkIcon size={24} />
                  </div>
                  <span className="dock-name">{link.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="manga-home-page">
      {/* 漫画网点 Canvas 动画背景 */}
      <MangaHalftoneCanvas />
      
      <Header />
      
      <div className="manga-home-container">
        {/* 报头 - 黑底白字 */}
        <header className="manga-home-masthead">
          <div className="manga-home-masthead-content">
            <div className="manga-home-masthead-left">
              {/* 环形钟 */}
              <div className="manga-home-ring-clock">
                <svg viewBox="0 0 100 100" className="manga-home-clock-svg">
                  <circle
                    className="manga-home-ring-second"
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 35 * 0.9} ${2 * Math.PI * 35 * 0.1}`}
                    transform={`rotate(${secondAngle - 90} 50 50)`}
                  />
                  <circle
                    className="manga-home-ring-minute"
                    cx="50"
                    cy="50"
                    r="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 25 * 0.9} ${2 * Math.PI * 25 * 0.1}`}
                    transform={`rotate(${minuteAngle - 90} 50 50)`}
                  />
                  <circle
                    className="manga-home-ring-hour"
                    cx="50"
                    cy="50"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 15 * 0.9} ${2 * Math.PI * 15 * 0.1}`}
                    transform={`rotate(${hourAngle - 90} 50 50)`}
                  />
                  <circle cx="50" cy="50" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="manga-home-masthead-text">
                <h1 className="manga-home-main-title">湯圓的小窩</h1>
                <span className="manga-home-subtitle">TANGYUAN'S CREATIVE CORNER</span>
              </div>
            </div>
            <div className="manga-home-masthead-right">
              <span className="manga-home-date">
                {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </span>
              <span className="manga-home-issue">VOL.2026</span>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="manga-home-main">
          {/* 左侧栏 - 统计数据 */}
          <aside className="manga-home-sidebar-left">
            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <TrophyIcon size={20} />
                <span>PROJECTS</span>
              </div>
              <div className="manga-home-stat-num">11</div>
              <div className="manga-home-stat-label">项目总数</div>
            </div>

            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <StarIcon size={20} />
                <span>RELEASED</span>
              </div>
              <div className="manga-home-stat-num">06</div>
              <div className="manga-home-stat-label">已发布</div>
            </div>

            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <ClockIcon size={20} />
                <span>EST.2024</span>
              </div>
              <div className="manga-home-stat-num">99.9%</div>
              <div className="manga-home-stat-label">运行时间</div>
            </div>
          </aside>

          {/* 中央 - 四个核心版块 */}
          <main className="manga-home-central">
            <div className="manga-home-channels">
              {mainChannels.map((channel, index) => {
                const IconComp = channel.icon
                return (
                  <article
                    key={channel.id}
                    className={`manga-home-channel ${hoveredChannel === channel.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredChannel(channel.id)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onClick={() => navigate(channel.path)}
                  >
                    {/* 图标容器 */}
                    <div className="manga-home-channel-icon">
                      <IconComp size={40} />
                    </div>

                    {/* 内容 */}
                    <div className="manga-home-channel-content">
                      <h3 className="manga-home-channel-title-cn">{channel.title}</h3>
                      <span className="manga-home-channel-title-en">{channel.subtitle}</span>
                      
                      <div className="manga-home-divider"></div>
                      
                      <p className="manga-home-channel-desc">{channel.desc}</p>
                      
                      <div className="manga-home-tags">
                        {channel.tags.map((tag, i) => (
                          <span key={i} className="manga-home-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* 底部信息 */}
                    <div className="manga-home-channel-footer">
                      <span className="manga-home-channel-arrow">› ENTER</span>
                    </div>

                    {/* 角落装饰 */}
                    <div className="manga-home-corner tl"></div>
                    <div className="manga-home-corner tr"></div>
                    <div className="manga-home-corner bl"></div>
                    <div className="manga-home-corner br"></div>
                  </article>
                )
              })}
            </div>
          </main>

          {/* 右侧栏 - 社交链接 */}
          <aside className="manga-home-sidebar-right">
            <div className="manga-home-social-card">
              <div className="manga-home-card-header">
                <span>CONNECT</span>
              </div>
              <div className="manga-home-social-list">
                {socialLinks.map((link, i) => {
                  const LinkIcon = link.icon
                  return (
                    <a
                      key={i}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="manga-home-social-item"
                    >
                      <LinkIcon size={18} />
                      <span>{link.name}</span>
                      <span className="manga-home-social-arrow">↗</span>
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="manga-home-tech-card">
              <div className="manga-home-card-header">
                <CodeIcon size={20} />
                <span>TECH</span>
              </div>
              <div className="manga-home-tech-tags">
                {['React', 'Vite', 'Node.js', 'JavaScript', 'CSS3', 'Git'].map((tech, i) => (
                  <span key={i} className="manga-home-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 底部 */}
        <footer className="manga-home-footer">
          <div className="manga-home-footer-content">
            <div className="manga-home-footer-line">
              <span>EST.2024</span>
              <span className="manga-home-sep">◆</span>
              <span>MADE WITH ♥ BY TANGYUAN</span>
              <span className="manga-home-sep">◆</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
            <div className="manga-home-icp">
              <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
                鄂 ICP 备 2026010257 号
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
