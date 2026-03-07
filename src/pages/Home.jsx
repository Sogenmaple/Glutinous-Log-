import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, ToolIcon, ClockIcon } from '../components/icons/SiteIcons'
import Header from '../components/Header'
import ClockLogo from '../components/ClockLogo'
import '../styles/ClockLogo.css'

/**
 * 汤圆的小窝 - 主导航页面
 * 赛博控制台风格的入口界面
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
      description: '独立游戏作品集',
      icon: GameIcon,
      color: 'amber',
      path: '/games',
    },
    {
      id: 'blog',
      title: '思维碎片',
      subtitle: 'THOUGHT FRAGMENTS',
      description: '开发日志与技术分享',
      icon: BookIcon,
      color: 'cyan',
      path: '/blog',
    },
    {
      id: 'special',
      title: '特殊构造',
      subtitle: 'SPECIAL CONSTRUCTS',
      description: '工具与创意实验',
      icon: ToolIcon,
      color: 'red',
      path: '/special',
    },
    {
      id: 'about',
      title: '关于汤圆',
      subtitle: 'ABOUT ME',
      description: '开发者信息',
      icon: UserIcon,
      color: 'purple',
      path: '/about',
    }
  ]

  return (
    <div className="home-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="home-bg-grid"></div>
      <div className="home-bg-glow"></div>

      {/* 主布局 - 非对称分区 */}
      <div className="home-cyber-layout">
        {/* 左侧信息栏 */}
        <aside className="home-sidebar-left">
          <div className="home-logo-section">
            <ClockLogo size={120} />
            <h1 className="home-main-title">汤圆</h1>
            <p className="home-main-subtitle">TANGYUAN</p>
          </div>
          
          <div className="home-status-panel">
            <div className="status-header">
              <span className="status-indicator"></span>
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="status-info">
              <div className="info-line">
                <span>DEV STATUS</span>
                <span className="value">ACTIVE</span>
              </div>
              <div className="info-line">
                <span>PROJECTS</span>
                <span className="value">09</span>
              </div>
              <div className="info-line">
                <span>RELEASED</span>
                <span className="value">06</span>
              </div>
            </div>
          </div>
          
          <div className="home-date-section">
            <ClockIcon size={40} color="#ff9500" />
            <div className="date-display">
              <span className="date-year">{new Date().getFullYear()}</span>
              <span className="date-month">{new Date().toLocaleDateString('zh-CN', { month: 'long' })}</span>
              <span className="date-day">{new Date().getDate()}</span>
            </div>
          </div>
        </aside>

        {/* 中央导航区 */}
        <main className="home-main-content">
          <div className="home-header-section">
            <h2 className="home-welcome-title">创意工作台</h2>
            <p className="home-welcome-subtitle">CREATIVE WORKBENCH // SELECT MODULE</p>
            <div className="home-header-line"></div>
          </div>
          
          <div className="home-nav-grid">
            {navCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <div
                  key={card.id}
                  className={`home-nav-card ${card.color} ${hoveredCard === card.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(card.path)}
                >
                  <div className="nav-card-header">
                    <span className="card-id">#{String(index + 1).padStart(2, '0')}</span>
                    <div className="card-icon-wrapper">
                      <IconComponent size={40} color="currentColor" />
                    </div>
                  </div>
                  
                  <div className="nav-card-divider"></div>
                  
                  <div className="nav-card-body">
                    <h3 className="nav-card-title">{card.title}</h3>
                    <p className="nav-card-subtitle">{card.subtitle}</p>
                    <p className="nav-card-desc">{card.description}</p>
                  </div>
                  
                  <div className="nav-card-footer">
                    <span className="nav-card-arrow">→</span>
                  </div>
                  
                  <div className="nav-corner tl"></div>
                  <div className="nav-corner tr"></div>
                  <div className="nav-corner bl"></div>
                  <div className="nav-corner br"></div>
                </div>
              )
            })}
          </div>
        </main>

        {/* 右侧链接栏 */}
        <aside className="home-sidebar-right">
          <div className="link-panel">
            <div className="panel-header">
              <span>CONNECT</span>
            </div>
            <div className="panel-content">
              <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="link-item">
                <span className="link-label">GITHUB</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="link-item">
                <span className="link-label">BILIBILI</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="link-item">
                <span className="link-label">TAPTAP</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="link-item">
                <span className="link-label">QQ 群：950087304</span>
                <span className="link-arrow">↗</span>
              </a>
            </div>
            <div className="panel-footer">
              <div className="wave-bars">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
