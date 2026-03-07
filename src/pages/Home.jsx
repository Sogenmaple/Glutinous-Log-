import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, TangyuanIcon, ToolIcon } from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/Home.css'

/**
 * 汤圆的小窝 - 主导航页面
 * 全新重构：中心 Logo + 环绕式导航
 */
export default function Home() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    // 鼠标视差效果
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const navCards = [
    {
      id: 'games',
      title: '游戏宇宙',
      subtitle: 'GAMES UNIVERSE',
      description: '探索我的游戏作品集',
      icon: GameIcon,
      color: 'amber',
      path: '/games'
    },
    {
      id: 'blog',
      title: '思维碎片',
      subtitle: 'THOUGHT FRAGMENTS',
      description: '开发日志与技术分享',
      icon: BookIcon,
      color: 'cyan',
      path: '/blog'
    },
    {
      id: 'special',
      title: '特殊构造',
      subtitle: 'SPECIAL CONSTRUCTS',
      description: '实用工具与创意实验',
      icon: ToolIcon,
      color: 'red',
      path: '/special'
    },
    {
      id: 'about',
      title: '关于汤圆',
      subtitle: 'ABOUT ME',
      description: '独立游戏开发者',
      icon: UserIcon,
      color: 'purple',
      path: '/about'
    }
  ]

  return (
    <div className="home-page-v2">
      <Header />
      
      {/* 动态背景 */}
      <div className="home-bg-mesh"></div>
      <div 
        className="home-bg-gradient"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
        }}
      ></div>

      {/* 中心 Logo 区域 */}
      <div className="home-center-logo">
        <div className="logo-container">
          <div className="logo-ring ring-1"></div>
          <div className="logo-ring ring-2"></div>
          <div className="logo-ring ring-3"></div>
          <TangyuanIcon size={120} color="#ff9500" />
          <div className="logo-glow"></div>
        </div>
        <h1 className="main-title">汤圆的小窝</h1>
        <p className="main-subtitle">TANGYUAN'S CREATIVE CORNER</p>
        <div className="title-divider"></div>
      </div>

      {/* 环绕导航卡片 */}
      <div className="nav-ring">
        {navCards.map((card, index) => {
          const IconComponent = card.icon
          const isHovered = hoveredCard === card.id
          
          return (
            <div
              key={card.id}
              className={`nav-card ${card.color} ${isHovered ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
              style={{ 
                '--index': index,
                '--total': navCards.length
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(card.path)}
            >
              <div className="card-glow"></div>
              
              <div className="card-frame">
                <div className="card-icon-wrapper">
                  <IconComponent size={48} color="currentColor" />
                </div>
                
                <div className="card-info">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-subtitle">{card.subtitle}</p>
                  <p className="card-desc">{card.description}</p>
                </div>
                
                <div className="card-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* 角落装饰 */}
              <div className="corner tl"></div>
              <div className="corner tr"></div>
              <div className="corner bl"></div>
              <div className="corner br"></div>
            </div>
          )
        })}
      </div>

      {/* 底部状态栏 */}
      <div className="home-status-bar">
        <div className="status-item">
          <span className="status-dot"></span>
          <span>在线创作中</span>
        </div>
        <div className="status-divider">|</div>
        <div className="status-item">
          <span>已解锁 4 个区域</span>
        </div>
        <div className="status-divider">|</div>
        <div className="status-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>按任意键开始</span>
        </div>
      </div>

      {/* 扫描线效果 */}
      <div className="scanlines"></div>
    </div>
  )
}
