import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, ToolIcon, ClockIcon } from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/Home.css'

/**
 * 汤圆的小窝 - 主导航页面
 * 磁带未来主义风格
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
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      {/* 磁带未来主义布局 - 非对称 */}
      <div className="tape-layout">
        {/* 左侧主时钟区 */}
        <aside className="left-clock-zone">
          <div className="clock-container">
            <ClockIcon size={180} color="#ff9500" />
            <div className="clock-glow"></div>
          </div>
          <div className="clock-label">
            <span className="label-cn">汤圆</span>
            <span className="label-en">TANGYUAN</span>
          </div>
          <div className="clock-decor-line"></div>
          <div className="system-status">
            <div className="status-item">
              <span className="status-dot"></span>
              <span>ONLINE</span>
            </div>
            <div className="status-item">
              <span>PRJ</span>
              <span className="status-num">09</span>
            </div>
            <div className="status-item">
              <span>REL</span>
              <span className="status-num">06</span>
            </div>
          </div>
        </aside>

        {/* 中央内容区 */}
        <main className="center-content">
          <div className="main-header">
            <h1 className="main-title">
              <span className="title-cn">创意工作台</span>
              <span className="title-en">CREATIVE WORKBENCH</span>
            </h1>
            <div className="title-decor"></div>
          </div>

          <div className="nav-cards-container">
            {navCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <div
                  key={card.id}
                  className={`nav-card ${card.color} ${hoveredCard === card.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(card.path)}
                >
                  <div className="card-top">
                    <span className="card-num">{String(index + 1).padStart(2, '0')}</span>
                    <div className="card-icon-wrap">
                      <IconComponent size={36} color="currentColor" />
                    </div>
                  </div>
                  <div className="card-mid">
                    <h3 className="card-title-cn">{card.title}</h3>
                    <p className="card-title-en">{card.subtitle}</p>
                    <p className="card-desc">{card.description}</p>
                  </div>
                  <div className="card-bottom">
                    <span className="card-enter">ENTER</span>
                    <span className="card-arrow">→</span>
                  </div>
                  <div className="card-line"></div>
                </div>
              )
            })}
          </div>
        </main>

        {/* 右侧信息区 */}
        <aside className="right-info-zone">
          <div className="info-block date-block">
            <ClockIcon size={32} color="#ff9500" />
            <div className="date-info">
              <span className="date-year">{new Date().getFullYear()}</span>
              <span className="date-month">{new Date().toLocaleDateString('zh-CN', { month: 'long' })}</span>
              <span className="date-day">{String(new Date().getDate()).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="info-block connect-block">
            <div className="block-header">
              <span>CONNECT</span>
              <div className="block-line"></div>
            </div>
            <div className="connect-list">
              <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="connect-item">
                <span>GITHUB</span>
                <span className="arrow">↗</span>
              </a>
              <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="connect-item">
                <span>BILIBILI</span>
                <span className="arrow">↗</span>
              </a>
              <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="connect-item">
                <span>TAPTAP</span>
                <span className="arrow">↗</span>
              </a>
              <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="connect-item">
                <span>QQ:950087304</span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="info-block wave-block">
            <div className="wave-viz">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="wave-col" style={{ animationDelay: `${i * 0.08}s` }}></div>
              ))}
            </div>
          </div>
        </aside>

        {/* 底部装饰条 */}
        <footer className="bottom-decor">
          <div className="decor-left">
            <span>EST.2024</span>
          </div>
          <div className="decor-center">
            <div className="center-line"></div>
          </div>
          <div className="decor-right">
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
