import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, TangyuanIcon, ToolIcon } from '../components/icons/SiteIcons'

/**
 * 汤圆的小窝 - 主导航页面
 * 复古游戏机风格的入口界面
 */
export default function Home() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navCards = [
    {
      id: 'games',
      title: '游戏宇宙',
      subtitle: 'GAMES UNIVERSE',
      description: '探索我的游戏作品集，穿越时空的互动体验',
      icon: GameIcon,
      color: 'amber',
      path: '/games',
      gradient: 'linear-gradient(135deg, rgba(255,149,0,0.15) 0%, rgba(255,149,0,0.05) 100%)'
    },
    {
      id: 'blog',
      title: '思维碎片',
      subtitle: 'THOUGHT FRAGMENTS',
      description: '开发日志、技术分享与生活随笔',
      icon: BookIcon,
      color: 'cyan',
      path: '/blog',
      gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)'
    },
    {
      id: 'special',
      title: '特殊构造',
      subtitle: 'SPECIAL CONSTRUCTS',
      description: '实用工具与创意实验的集合',
      icon: ToolIcon,
      color: 'red',
      path: '/special',
      gradient: 'linear-gradient(135deg, rgba(255,69,58,0.15) 0%, rgba(255,69,58,0.05) 100%)'
    },
    {
      id: 'about',
      title: '关于汤圆',
      subtitle: 'ABOUT ME',
      description: '独立游戏开发者，创意实现者',
      icon: UserIcon,
      color: 'purple',
      path: '/about',
      gradient: 'linear-gradient(135deg, rgba(189,0,255,0.15) 0%, rgba(189,0,255,0.05) 100%)'
    }
  ]

  return (
    <div className="home-page">
      {/* 背景装饰 */}
      <div className="home-bg-grid"></div>
      <div className="home-bg-glow"></div>

      {/* 主标题区域 */}
      <div className={`home-header ${mounted ? 'visible' : ''}`}>
        <div className="home-avatar">
          <TangyuanIcon size={80} color="#ff9500" />
          <div className="avatar-ring"></div>
          <div className="avatar-ring ring-outer"></div>
        </div>
        <h1 className="home-title">汤圆的小窝</h1>
        <p className="home-subtitle">TANGYUAN'S CREATIVE CORNER</p>
        <div className="home-divider"></div>
      </div>

      {/* 导航卡片 */}
      <div className="home-nav-grid">
        {navCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.id}
              className={`home-nav-card ${card.color} ${hoveredCard === card.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(card.path)}
            >
              {/* 卡片背景装饰 */}
              <div className="card-bg-decoration"></div>
              
              {/* 卡片内容 */}
              <div className="card-content">
                <div className="card-icon">
                  <IconComponent size={64} color="currentColor" />
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-subtitle">{card.subtitle}</p>
                <p className="card-description">{card.description}</p>
              
              {/* 进入箭头 */}
              <div className="card-arrow">
                <span>ENTER</span>
                <span className="arrow-symbol">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* 卡片边框装饰 */}
            <div className="card-corner tl"></div>
            <div className="card-corner tr"></div>
            <div className="card-corner bl"></div>
            <div className="card-corner br"></div>
          </div>
          )
        })}
      </div>

      {/* 底部装饰 */}
      <div className="home-footer">
        <div className="footer-line"></div>
        <p className="footer-text">PRESS START TO EXPLORE</p>
      </div>
    </div>
  )
}
