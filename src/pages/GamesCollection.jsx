import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { GameIcon, ClockIcon, CodeIcon, BlockIcon, StarIcon, ExperimentIcon, PlayIcon, TrophyIcon } from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 游戏宇宙页面 - 报纸风格排版
 */
export default function GamesCollection() {
  const navigate = useNavigate()
  const [hoveredGame, setHoveredGame] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const games = [
    {
      id: 1,
      title: '渡维',
      subtitle: 'DIMENSIONAL',
      description: '2024 CiGA Game Jam (7.5-7.6) 作品。在多维空间之间穿梭，突破维度的限制。',
      icon: StarIcon,
      color: 'cyan',
      date: '2024-07-06',
      jam: 'CiGA Game Jam 2024',
      tags: ['CiGA', '维度', '解谜'],
      status: 'released',
      links: {
        gmhub: 'https://gmhub.com/game/5421'
      }
    },
    {
      id: 5,
      title: '反物环',
      subtitle: 'ANTIMATTER',
      description: '2025 CiGA Game Jam (6.27-6.29) 48 小时 Solo 作品。在反物质环带中生存，利用物理机制解开谜题。',
      icon: ExperimentIcon,
      color: 'purple',
      date: '2025-06-29',
      jam: 'CiGA Game Jam 2025',
      tags: ['CiGA', '物理', '解谜', 'Solo'],
      status: 'released',
      links: {
        gmhub: 'https://gmhub.com/game/7868',
        bilibili: 'https://www.bilibili.com/video/BV1HogSz9Eke',
        taptap: 'https://www.taptap.cn/app/799022'
      }
    },
    {
      id: 2,
      title: '声纹',
      subtitle: 'SOUNDWAVE',
      description: '2025 聚光灯武汉站 (9.12-9.14) 作品。利用声波频率解谜，在声音的轨迹中寻找真相。T-cat 战队：美术 - 涂朗铭，程序 - 汤圆，策划-cc，策划 - 阿察。',
      icon: StarIcon,
      color: 'cyan',
      date: '2025-09-14',
      jam: '聚光灯 Game Jam 武汉站',
      tags: ['聚光灯', '音乐', '解谜', 'T-cat'],
      status: 'released',
      links: {}
    },
    {
      id: 3,
      title: '逃离俄罗斯方块',
      subtitle: 'ESCAPE TETRIS',
      description: '2026 聚光灯成都站 (12.19-12.21) 48 小时个人 Solo 作品。经典的俄罗斯方块玩法，但这次你要逃离即将闭合的方块牢笼。',
      icon: BlockIcon,
      color: 'amber',
      date: '2026-12-21',
      jam: '聚光灯 Game Jam 成都站',
      tags: ['聚光灯', '解谜', '经典', 'Solo'],
      status: 'released',
      links: {}
    },
    {
      id: 4,
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      description: '2025 Global Game Jam (1.17-1.19) 作品。在宇宙中穿梭，破解泡泡，探索未知星系。',
      icon: StarIcon,
      color: 'cyan',
      date: '2025-01-19',
      jam: 'Global Game Jam 2025',
      tags: ['GGJ2025', '太空', '休闲'],
      status: 'released',
      links: {}
    },
    {
      id: 6,
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      description: '2026 Global Game Jam (1.30-2.1) 作品。结合传统划拳文化的创意对战游戏。',
      icon: PlayIcon,
      color: 'amber',
      date: '2026-02-01',
      jam: 'Global Game Jam 2026',
      tags: ['GGJ2026', '对战', '休闲'],
      status: 'released',
      links: {
        gmhub: 'https://gmhub.com/game/9098',
        bilibili: 'https://www.bilibili.com/video/BV1xeZ7BKEAG'
      }
    },
    {
      id: 7,
      title: 'Cheat',
      subtitle: 'COMMERCIAL PROJECT',
      description: '正在与大隆盛工作室一起开发的商业项目。',
      icon: CodeIcon,
      color: 'green',
      date: '2026-03-05',
      jam: '商业项目',
      tags: ['商业', '开发中', '大隆盛工作室'],
      status: 'development',
      links: {}
    },
    {
      id: 8,
      title: '球状围棋',
      subtitle: 'SPHERE GO',
      description: '创新围棋变体，在球面上进行对弈，带来全新的空间策略体验。',
      icon: PlayIcon,
      color: 'cyan',
      date: '2026-03-05',
      jam: '个人项目',
      tags: ['围棋', '策略', '开发中'],
      status: 'development',
      links: {}
    },
    {
      id: 9,
      title: '层色棋',
      subtitle: 'LAYERED CHESS',
      description: '多层色彩棋盘游戏，融合传统棋类与色彩机制的创新玩法。',
      icon: TrophyIcon,
      color: 'purple',
      date: '2026-03-05',
      jam: '个人项目',
      tags: ['棋类', '策略', '开发中'],
      status: 'development',
      links: {}
    }
  ]

  return (
    <div className="games-collection-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="newspaper-bg"></div>
      <div className="newspaper-grid"></div>

      {/* 主布局 - 非对称分区 */}
      <div className="cyber-layout">
        {/* 左侧边栏 - 导航区 */}
        <aside className="sidebar-left">
          <div className="sidebar-section">
            <ClockIcon size={60} color="#ff9500" />
            <h2 className="sidebar-title">CYBER<br/>GAMES</h2>
            <div className="sidebar-divider"></div>
            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-value">09</span>
                <span className="stat-label">PROJECTS</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">06</span>
                <span className="stat-label">RELEASED</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">03</span>
                <span className="stat-label">DEVELOPING</span>
              </div>
            </div>
          </div>
          
          <div className="sidebar-section">
            <div className="date-display">
              <span className="date-year">{new Date().getFullYear()}</span>
              <span className="date-month">{new Date().toLocaleDateString('zh-CN', { month: 'long' })}</span>
              <span className="date-day">{new Date().getDate()}</span>
            </div>
          </div>
        </aside>

        {/* 中央主内容区 */}
        <main className="main-content">
          {/* 顶部通栏标题 */}
          <header className="content-header">
            <div className="header-line"></div>
            <h1 className="main-title">
              <span className="title-cn">游戏宇宙</span>
              <span className="title-en">GAMES UNIVERSE</span>
            </h1>
            <p className="main-subtitle">独立游戏作品集 · 创意与技术的结晶</p>
            <div className="header-line bottom"></div>
          </header>

          {/* 游戏网格 - 非对称布局 */}
          <div className="games-grid-asymmetric">
            {games.map((game, index) => {
              const IconComponent = game.icon
              const isWide = index === 0 || index === 3 || index === 6
              return (
                <article
                  key={game.id}
                  className={`game-card ${game.color} ${isWide ? 'wide' : ''} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                  onClick={() => navigate(game.path)}
                >
                  {/* 卡片头部 */}
                  <div className="card-header">
                    <span className="card-id">#{String(game.id).padStart(2, '0')}</span>
                    <div className="card-icon-wrapper">
                      <IconComponent size={32} color="currentColor" />
                    </div>
                  </div>

                  {/* 分隔线 */}
                  <div className="card-divider"></div>

                  {/* 卡片内容 */}
                  <div className="card-body">
                    <h3 className="card-title-cn">{game.title}</h3>
                    <p className="card-title-en">{game.subtitle}</p>
                    <p className="card-desc">{game.description}</p>
                    
                    {/* 标签组 */}
                    {game.tags && game.tags.length > 0 && (
                      <div className="card-tags">
                        {game.tags.map(tag => (
                          <span key={tag} className="card-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 卡片底部 */}
                  <div className="card-footer">
                    <span className="card-date">{game.date}</span>
                    <div className="card-links">
                      {game.links && game.links.gmhub && (
                        <a href={game.links.gmhub} target="_blank" rel="noopener noreferrer" className="card-link" onClick={(e) => e.stopPropagation()}>G</a>
                      )}
                      {game.links && game.links.bilibili && (
                        <a href={game.links.bilibili} target="_blank" rel="noopener noreferrer" className="card-link" onClick={(e) => e.stopPropagation()}>B</a>
                      )}
                      {game.links && game.links.taptap && (
                        <a href={game.links.taptap} target="_blank" rel="noopener noreferrer" className="card-link" onClick={(e) => e.stopPropagation()}>T</a>
                      )}
                    </div>
                    <span className="card-arrow">→</span>
                  </div>

                  {/* 角落装饰 */}
                  <div className="corner-decor tl"></div>
                  <div className="corner-decor tr"></div>
                  <div className="corner-decor bl"></div>
                  <div className="corner-decor br"></div>
                </article>
              )
            })}
          </div>
        </main>

        {/* 右侧信息栏 */}
        <aside className="sidebar-right">
          <div className="info-panel">
            <div className="panel-header">
              <span className="panel-title">SYSTEM INFO</span>
            </div>
            <div className="panel-content">
              <div className="info-row">
                <span className="info-label">ENGINE</span>
                <span className="info-value">Unity</span>
              </div>
              <div className="info-row">
                <span className="info-label">JAMS</span>
                <span className="info-value">CiGA / GGJ / 聚光灯</span>
              </div>
              <div className="info-row">
                <span className="info-label">STATUS</span>
                <span className="info-value active">ONLINE</span>
              </div>
            </div>
            <div className="panel-footer">
              <div className="wave-visualizer">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="social-panel">
            <div className="panel-header">
              <span className="panel-title">CONNECT</span>
            </div>
            <div className="panel-content">
              <a href="https://github.com/Sogenmaple" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-label">GITHUB</span>
                <span className="social-arrow">↗</span>
              </a>
              <a href="https://space.bilibili.com/389369217" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-label">BILIBILI</span>
                <span className="social-arrow">↗</span>
              </a>
              <a href="https://www.taptap.cn/developer/338837" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-label">TAPTAP</span>
                <span className="social-arrow">↗</span>
              </a>
              <a href="https://qm.qq.com/q/AxbQpuKKsK" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="social-label">QQ 群：950087304</span>
                <span className="social-arrow">↗</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* 底部通栏 */}
      <footer className="cyber-footer">
        <div className="footer-grid"></div>
        <div className="footer-content">
          <GameIcon size={40} color="#ff9500" />
          <div className="footer-text">
            <p>汤圆游戏作品集</p>
            <p className="footer-en">TANGYUAN'S GAME UNIVERSE</p>
          </div>
          <div className="footer-decor"></div>
        </div>
      </footer>
    </div>
  )
}
