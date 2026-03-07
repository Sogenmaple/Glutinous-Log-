import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { GameIcon, ClockIcon, StarIcon, ExperimentIcon, BlockIcon, PlayIcon, TrophyIcon, BombIcon, SnakeIcon, BirdIcon, PacmanIcon, DinosaurIcon } from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 游戏宇宙页面 - 磁带未来主义风格
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
      description: '2024 CiGA Game Jam 作品。在多维空间之间穿梭，突破维度的限制。',
      icon: StarIcon,
      color: 'cyan',
      date: '2024-07-06',
      tags: ['CiGA', '维度', '解谜'],
      path: '/games/1'
    },
    {
      id: 5,
      title: '反物环',
      subtitle: 'ANTIMATTER',
      description: '2025 CiGA Game Jam 48 小时 Solo 作品。在反物质环带中生存。',
      icon: ExperimentIcon,
      color: 'purple',
      date: '2025-06-29',
      tags: ['CiGA', '物理', 'Solo'],
      path: '/games/5'
    },
    {
      id: 2,
      title: '声纹',
      subtitle: 'SOUNDWAVE',
      description: '2025 聚光灯武汉站作品。利用声波频率解谜。',
      icon: StarIcon,
      color: 'cyan',
      date: '2025-09-14',
      tags: ['聚光灯', '音乐', '解谜'],
      path: '/games/2'
    },
    {
      id: 3,
      title: '逃离俄罗斯方块',
      subtitle: 'ESCAPE TETRIS',
      description: '2026 聚光灯成都站 48 小时个人 Solo 作品。',
      icon: BlockIcon,
      color: 'amber',
      date: '2026-12-21',
      tags: ['聚光灯', '解谜', 'Solo'],
      path: '/games/3'
    },
    {
      id: 4,
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      description: '2025 Global Game Jam 作品。在宇宙中穿梭，破解泡泡。',
      icon: StarIcon,
      color: 'cyan',
      date: '2025-01-19',
      tags: ['GGJ2025', '太空', '休闲'],
      path: '/games/4'
    },
    {
      id: 6,
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      description: '2026 Global Game Jam 作品。结合传统划拳文化的创意对战。',
      icon: PlayIcon,
      color: 'amber',
      date: '2026-02-01',
      tags: ['GGJ2026', '对战', '休闲'],
      path: '/games/6'
    },
    {
      id: 7,
      title: '扫雷',
      subtitle: 'MINESWEEPER',
      description: '经典扫雷游戏，排除所有地雷，完成挑战。',
      icon: BombIcon,
      color: 'amber',
      date: '2024',
      tags: ['经典', '益智'],
      path: '/special/minesweeper'
    },
    {
      id: 8,
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇游戏，粒子特效，难度递增。',
      icon: SnakeIcon,
      color: 'cyan',
      date: '2024',
      tags: ['经典', '动作'],
      path: '/special/snake'
    },
    {
      id: 9,
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '飞扬的小鸟，穿越障碍，挑战极限。',
      icon: BirdIcon,
      color: 'amber',
      date: '2024',
      tags: ['经典', '动作'],
      path: '/special/flybird'
    },
    {
      id: 10,
      title: '吃豆人',
      subtitle: 'PACMAN',
      description: '经典吃豆人游戏，幽灵 AI，能量豆模式。',
      icon: PacmanIcon,
      color: 'amber',
      date: '2024',
      tags: ['经典', '动作'],
      path: '/special/pacman'
    },
    {
      id: 11,
      title: '恐龙快跑',
      subtitle: 'DINOSAUR RUN',
      description: 'Chrome 恐龙游戏，粒子特效，难度 progression。',
      icon: DinosaurIcon,
      color: 'cyan',
      date: '2024',
      tags: ['经典', '动作'],
      path: '/special/dinosaur'
    }
  ]

  return (
    <div className="games-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="games-tape-bg"></div>
      <div className="games-tape-grid"></div>
      <div className="games-scanlines"></div>

      {/* 主布局 - 非对称三栏 */}
      <div className="games-main-layout">
        {/* 左侧边栏 */}
        <aside className="sidebar-left">
          <div className="sidebar-logo">
            <ClockIcon size={100} color="#ff9500" />
            <h1 className="sidebar-title">游戏宇宙</h1>
            <p className="sidebar-subtitle">GAMES UNIVERSE</p>
          </div>
          
          <div className="sidebar-stats">
            <div className="stat-item">
              <span className="stat-num">11</span>
              <span className="stat-label">PROJECTS</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">06</span>
              <span className="stat-label">RELEASED</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">03</span>
              <span className="stat-label">IN DEV</span>
            </div>
          </div>
          
          <div className="sidebar-date">
            <ClockIcon size={32} color="#ff9500" />
            <div className="date-display">
              <span className="date-year">{new Date().getFullYear()}</span>
              <span className="date-month-day">
                {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </aside>

        {/* 中央内容区 */}
        <main className="games-content">
          <header className="games-header">
            <h2 className="games-title-cn">游戏作品集</h2>
            <p className="games-title-en">TANGYUAN'S GAME PORTFOLIO</p>
            <div className="title-line"></div>
          </header>

          {/* 游戏网格 */}
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
                  <div className="card-header">
                    <span className="card-id">#{String(game.id).padStart(2, '0')}</span>
                    <div className="card-icon-wrapper">
                      <IconComponent size={32} color="currentColor" />
                    </div>
                  </div>

                  <div className="card-divider"></div>

                  <div className="card-body">
                    <h3 className="card-title-cn">{game.title}</h3>
                    <p className="card-title-en">{game.subtitle}</p>
                    <p className="card-desc">{game.description}</p>
                    
                    {game.tags && game.tags.length > 0 && (
                      <div className="card-tags">
                        {game.tags.map(tag => (
                          <span key={tag} className="card-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <span className="card-date">{game.date}</span>
                    <span className="card-arrow">→</span>
                  </div>

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
                <span className="social-label">QQ:950087304</span>
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
