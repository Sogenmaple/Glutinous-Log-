import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameIcon, BookIcon, UserIcon, ToolIcon, ClockIcon, CodeIcon, BombIcon, SnakeIcon, BirdIcon, PacmanIcon, DinosaurIcon } from '../components/icons/SiteIcons'
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

  // 子页面内容预览
  const subPages = {
    games: [
      { name: '扫雷', icon: BombIcon, path: '/special/minesweeper' },
      { name: '贪吃蛇', icon: SnakeIcon, path: '/special/snake' },
      { name: 'FlyBird', icon: BirdIcon, path: '/special/flybird' },
      { name: '吃豆人', icon: PacmanIcon, path: '/special/pacman' },
      { name: '恐龙快跑', icon: DinosaurIcon, path: '/special/dinosaur' }
    ],
    blog: [
      { title: '开发日志 #001', date: '2024-12-01', excerpt: '项目启动与架构设计' },
      { title: '开发日志 #002', date: '2024-12-05', excerpt: '游戏引擎选型与实现' },
      { title: '开发日志 #003', date: '2024-12-10', excerpt: 'UI/UX 设计心得' }
    ],
    special: [
      { name: '番茄钟', icon: ClockIcon, desc: '25 分钟专注工作法' },
      { name: '计算器', icon: CodeIcon, desc: '科学计算工具' },
      { name: '代码片段', icon: CodeIcon, desc: '常用代码库' }
    ],
    about: [
      { label: '技能', value: 'Unity / React / Node.js' },
      { label: '坐标', value: '中国·武汉' },
      { label: '状态', value: '独立开发中' }
    ]
  }

  return (
    <div className="home-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      {/* 报纸风格布局 - 非对称铺满 */}
      <div className="newspaper-home-layout">
        {/* 报头通栏 */}
        <header className="home-masthead">
          <div className="masthead-top">
            <span className="masthead-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
            <span className="masthead-issue">VOL.2024.NO.12</span>
            <span className="masthead-weather">成都 · 晴</span>
          </div>
          
          <div className="masthead-main">
            <ClockIcon size={120} color="#ff9500" />
            <h1 className="masthead-title">汤圆的小窝</h1>
            <p className="masthead-subtitle">TANGYUAN'S CREATIVE CORNER // 创意工作台</p>
          </div>
          
          <div className="masthead-nav">
            <span>首页</span>
            <span className="nav-dot">●</span>
            <span>导航</span>
            <span className="nav-dot">●</span>
            <span>探索</span>
            <span className="nav-dot">●</span>
            <span>联系</span>
          </div>
          
          <div className="masthead-line"></div>
        </header>

        {/* 主内容区 - 非对称网格 */}
        <div className="home-main-grid">
          {/* 左侧栏 - 时钟 + 状态 */}
          <aside className="home-sidebar-left">
            <div className="clock-status-block">
              <div className="clock-display">
                <ClockIcon size={140} color="#ff9500" />
                <div className="clock-glow-ring"></div>
              </div>
              <div className="clock-text">
                <span className="ct-cn">汤圆</span>
                <span className="ct-en">TANGYUAN</span>
              </div>
              <div className="status-grid">
                <div className="status-box">
                  <span className="status-num">09</span>
                  <span className="status-label">PROJECTS</span>
                </div>
                <div className="status-box">
                  <span className="status-num">06</span>
                  <span className="status-label">RELEASED</span>
                </div>
                <div className="status-box">
                  <span className="status-num">03</span>
                  <span className="status-label">IN DEV</span>
                </div>
              </div>
            </div>

            <div className="date-weather-block">
              <div className="dw-row">
                <span className="dw-label">DATE</span>
                <span className="dw-value">{new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="dw-row">
                <span className="dw-label">TIME</span>
                <span className="dw-value">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="dw-row">
                <span className="dw-label">LOCATION</span>
                <span className="dw-value">武汉 · 中国</span>
              </div>
            </div>

            <div className="quote-block">
              <p className="quote-text">"创意是生活的燃料"</p>
              <p className="quote-author">- TANGYUAN</p>
            </div>
          </aside>

          {/* 中央主栏 - 四个导航大区 */}
          <main className="home-central">
            {/* 头条区 */}
            <div className="featured-section">
              <span className="featured-tag">FEATURED</span>
              <h2 className="featured-headline">欢迎来到创意工作台</h2>
              <p className="featured-lead">独立游戏开发 · 技术分享 · 创意实验 · 开发者日志</p>
            </div>

            {/* 导航卡片区 - 报纸分栏 */}
            <div className="nav-sections-grid">
              {/* 游戏宇宙区 */}
              <section className="nav-section games-section">
                <div className="section-header amber">
                  <GameIcon size={28} color="#ff9500" />
                  <div className="section-title">
                    <span className="st-cn">游戏宇宙</span>
                    <span className="st-en">GAMES</span>
                  </div>
                  <span className="section-more" onClick={() => navigate('/games')}>MORE →</span>
                </div>
                <div className="section-content">
                  <div className="sub-pages-list">
                    {subPages.games.map((game, i) => {
                      const IconComp = game.icon
                      return (
                        <div key={i} className="sub-page-item" onClick={() => navigate(game.path)}>
                          <div className="spi-icon"><IconComp size={24} color="currentColor" /></div>
                          <span className="spi-name">{game.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* 思维碎片区 */}
              <section className="nav-section blog-section">
                <div className="section-header cyan">
                  <BookIcon size={28} color="#06b6d2" />
                  <div className="section-title">
                    <span className="st-cn">思维碎片</span>
                    <span className="st-en">BLOG</span>
                  </div>
                  <span className="section-more" onClick={() => navigate('/blog')}>MORE →</span>
                </div>
                <div className="section-content">
                  <div className="blog-posts-list">
                    {subPages.blog.map((post, i) => (
                      <div key={i} className="blog-post-item">
                        <span className="bpi-date">{post.date}</span>
                        <h4 className="bpi-title">{post.title}</h4>
                        <p className="bpi-excerpt">{post.excerpt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 特殊构造区 */}
              <section className="nav-section special-section">
                <div className="section-header red">
                  <ToolIcon size={28} color="#ff453a" />
                  <div className="section-title">
                    <span className="st-cn">特殊构造</span>
                    <span className="st-en">SPECIAL</span>
                  </div>
                  <span className="section-more" onClick={() => navigate('/special')}>MORE →</span>
                </div>
                <div className="section-content">
                  <div className="sub-pages-list">
                    {subPages.special.map((item, i) => {
                      const IconComp = item.icon
                      return (
                        <div key={i} className="sub-page-item" onClick={() => navigate(item.path || '/special')}>
                          <div className="spi-icon"><IconComp size={24} color="currentColor" /></div>
                          <div className="spi-info">
                            <span className="spi-name">{item.name}</span>
                            <span className="spi-desc">{item.desc}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              {/* 关于汤圆区 */}
              <section className="nav-section about-section">
                <div className="section-header purple">
                  <UserIcon size={28} color="#bd00ff" />
                  <div className="section-title">
                    <span className="st-cn">关于汤圆</span>
                    <span className="st-en">ABOUT</span>
                  </div>
                  <span className="section-more" onClick={() => navigate('/about')}>MORE →</span>
                </div>
                <div className="section-content">
                  <div className="about-info-list">
                    {subPages.about.map((item, i) => (
                      <div key={i} className="about-info-item">
                        <span className="aii-label">{item.label}</span>
                        <span className="aii-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="social-quick-links">
                    <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="sql-item">GITHUB</a>
                    <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="sql-item">BILIBILI</a>
                    <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="sql-item">TAPTAP</a>
                    <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="sql-item">QQ</a>
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* 右侧栏 - 社交 + 波形 */}
          <aside className="home-sidebar-right">
            <div className="connect-block">
              <div className="block-title">
                <span>CONNECT</span>
                <div className="bt-line"></div>
              </div>
              <div className="connect-items">
                <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="ci-item">
                  <span>GITHUB</span>
                  <span className="ci-arrow">↗</span>
                </a>
                <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="ci-item">
                  <span>BILIBILI</span>
                  <span className="ci-arrow">↗</span>
                </a>
                <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="ci-item">
                  <span>TAPTAP</span>
                  <span className="ci-arrow">↗</span>
                </a>
                <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="ci-item">
                  <span>QQ 群</span>
                  <span className="ci-arrow">↗</span>
                </a>
              </div>
            </div>

            <div className="wave-viz-block">
              <div className="wvb-title">SIGNAL</div>
              <div className="wave-viz-container">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s` }}></div>
                ))}
              </div>
            </div>

            <div className="qr-block">
              <div className="qr-placeholder">
                <span>QR CODE</span>
              </div>
              <p className="qr-hint">扫码访问</p>
            </div>
          </aside>
        </div>

        {/* 底部通栏 */}
        <footer className="home-footer-newspaper">
          <div className="footer-line-top"></div>
          <div className="footer-content">
            <div className="footer-left">
              <GameIcon size={40} color="#ff9500" />
              <div className="footer-brand">
                <p>汤圆的小窝</p>
                <p className="footer-en">TANGYUAN'S CREATIVE CORNER</p>
              </div>
            </div>
            <div className="footer-center">
              <span>EST.2024</span>
              <span className="footer-sep">◆</span>
              <span>ALL RIGHTS RESERVED</span>
              <span className="footer-sep">◆</span>
              <span>MADE WITH ♥</span>
            </div>
            <div className="footer-right">
              <span>ISSUE NO.2024.12</span>
            </div>
          </div>
          <div className="footer-line-bottom"></div>
        </footer>
      </div>
    </div>
  )
}
