import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, ToolIcon } from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/Home.css'

/**
 * 汤圆的小窝 - 主导航页面
 * 报纸风格排版
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
      description: '独立游戏作品集，包含扫雷、贪吃蛇、FlyBird、吃豆人、恐龙快跑等 5 款核心游戏',
      icon: GameIcon,
      color: 'amber',
      path: '/games',
    },
    {
      id: 'blog',
      title: '思维碎片',
      subtitle: 'THOUGHT FRAGMENTS',
      description: '开发日志与技术分享，记录成长轨迹',
      icon: BookIcon,
      color: 'cyan',
      path: '/blog',
    },
    {
      id: 'special',
      title: '特殊构造',
      subtitle: 'SPECIAL CONSTRUCTS',
      description: '实用工具与创意实验的集合，包含番茄钟、计算器等',
      icon: ToolIcon,
      color: 'red',
      path: '/special',
    },
    {
      id: 'about',
      title: '关于汤圆',
      subtitle: 'ABOUT ME',
      description: '独立游戏开发者，创意实现者',
      icon: UserIcon,
      color: 'purple',
      path: '/about',
    }
  ]

  return (
    <div className="home-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="home-bg"></div>
      <div className="home-grid"></div>

      {/* 报纸布局 */}
      <div className="newspaper-layout">
        {/* 报头 */}
        <header className="home-header">
          <div className="header-top">
            <span className="header-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="header-issue">ISSUE NO.2024</span>
          </div>
          
          <div className="header-main">
            <h1 className="header-title">汤圆的小窝</h1>
            <p className="header-subtitle">TANGYUAN'S CREATIVE CORNER // 创意工作台</p>
          </div>
          
          <div className="header-divider"></div>
          
          <div className="header-nav">
            <span>首页</span>
            <span className="nav-sep">/</span>
            <span>导航</span>
            <span className="nav-sep">/</span>
            <span>探索</span>
          </div>
        </header>

        {/* 主要内容区 */}
        <main className="home-content">
          {/* 头条区域 */}
          <div className="home-featured">
            <span className="featured-label">FEATURED</span>
            <div className="featured-content">
              <h2 className="featured-title">欢迎来到创意工作台</h2>
              <p className="featured-text">独立游戏开发 · 技术分享 · 创意实验</p>
            </div>
          </div>

          {/* 导航网格 - 报纸分栏 */}
          <div className="home-nav-grid">
            {navCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <article
                  key={card.id}
                  className={`home-nav-card ${card.color} ${hoveredCard === card.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(card.path)}
                >
                  {/* 文章头部 */}
                  <div className="card-header">
                    <span className="card-vol">VOL.{String(index + 1).padStart(3, '0')}</span>
                    <div className="card-icon">
                      <IconComponent size={48} color="currentColor" />
                    </div>
                  </div>

                  {/* 分隔线 */}
                  <div className="card-divider"></div>

                  {/* 文章内容 */}
                  <div className="card-body">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-subtitle">{card.subtitle}</p>
                    <p className="card-desc">{card.description}</p>
                  </div>

                  {/* 文章底部 */}
                  <div className="card-footer">
                    <span className="read-more">ENTER →</span>
                  </div>

                  {/* 角落装饰 */}
                  <div className="card-corner tl"></div>
                  <div className="card-corner tr"></div>
                </article>
              )
            })}
          </div>

          {/* 社交链接区 */}
          <div className="home-social-section">
            <div className="social-header">
              <div className="social-line"></div>
              <span className="social-title">CONNECT</span>
              <div className="social-line"></div>
            </div>
            <div className="social-links">
              <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="link-text">GITHUB</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="link-text">BILIBILI</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="link-text">TAPTAP</span>
                <span className="link-arrow">↗</span>
              </a>
              <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="link-text">QQ 群：950087304</span>
                <span className="link-arrow">↗</span>
              </a>
            </div>
          </div>
        </main>

        {/* 底部 */}
        <footer className="home-footer">
          <div className="footer-divider"></div>
          <div className="footer-content">
            <GameIcon size={40} color="#ff9500" />
            <div className="footer-text">
              <p>汤圆的小窝</p>
              <p className="footer-en">TANGYUAN'S CREATIVE CORNER</p>
            </div>
            <div className="footer-decor"></div>
          </div>
        </footer>
      </div>
    </div>
  )
}
