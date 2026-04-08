import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { 
  StarIcon, 
  ExperimentIcon, 
  BlockIcon, 
  PlayIcon, 
  BombIcon, 
  SnakeIcon, 
  BirdIcon, 
  PacmanIcon, 
  DinosaurIcon
} from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 汤圆的作品集 - 简洁网格布局 v4.0
 */
export default function GamesCollection() {
  const navigate = useNavigate()
  const [hoveredGame, setHoveredGame] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const games = [
    {
      id: 1,
      title: '渡维',
      subtitle: 'DIMENSIONAL',
      description: '2024 CiGA Game Jam 作品。在多维空间之间穿梭，突破维度的限制。',
      icon: StarIcon,
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
      date: '2026-12-21',
      tags: ['聚光灯', '解谜', 'Solo'],
      path: '/games/3'
    },
    {
      id: 4,
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      description: '2025 Global Game Jam 作品。在宇宙中穿梭。',
      icon: StarIcon,
      date: '2025-01-19',
      tags: ['GGJ2025', '太空', '休闲'],
      path: '/games/4'
    },
    {
      id: 6,
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      description: '2026 Global Game Jam 作品。结合传统划拳文化。',
      icon: PlayIcon,
      date: '2026-01-25',
      tags: ['GGJ2026', '对战', '休闲'],
      path: '/games/6'
    },
    {
      id: 7,
      title: '扫雷',
      subtitle: 'MINESWEEPER',
      description: '经典扫雷游戏，多种难度可选。',
      icon: BombIcon,
      date: '2024-03-15',
      tags: ['经典', '益智'],
      path: '/special/minesweeper'
    },
    {
      id: 8,
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇游戏，支持双人模式。',
      icon: SnakeIcon,
      date: '2024-02-20',
      tags: ['经典', '动作'],
      path: '/special/snake'
    },
    {
      id: 9,
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '飞扬的小鸟，穿越障碍。',
      icon: BirdIcon,
      date: '2024-04-10',
      tags: ['经典', '动作'],
      path: '/special/flybird'
    },
    {
      id: 10,
      title: '吃豆人',
      subtitle: 'PACMAN',
      description: '经典吃豆人游戏，幽灵 AI。',
      icon: PacmanIcon,
      date: '2024-05-05',
      tags: ['经典', '动作'],
      path: '/special/pacman'
    },
    {
      id: 11,
      title: '恐龙快跑',
      subtitle: 'DINOSAUR RUN',
      description: 'Chrome 恐龙游戏，粒子特效。',
      icon: DinosaurIcon,
      date: '2024-01-08',
      tags: ['经典', '动作'],
      path: '/special/dinosaur'
    }
  ]

  // 计算指针角度
  const seconds = currentTime.getSeconds()
  const minutes = currentTime.getMinutes()
  const hours = currentTime.getHours() % 12
  
  const secondAngle = (seconds / 60) * 360
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360
  const hourAngle = ((hours + minutes / 60) / 12) * 360

  return (
    <div className="manga-games-page">
      {/* 背景装饰 */}
      <div className="manga-halftone"></div>
      
      {/* 导航栏 */}
      <Header />
      
      <div className="manga-container">
        {/* 报头 */}
        <header className="manga-masthead">
          <div className="manga-masthead-content">
            <div className="manga-masthead-left">
              {/* 环形钟 */}
              <div className="manga-ring-clock">
                <svg viewBox="0 0 100 100" className="manga-clock-svg">
                  <circle
                    className="manga-ring-second"
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
                    className="manga-ring-minute"
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
                    className="manga-ring-hour"
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
              <div className="manga-masthead-text">
                <h1 className="manga-main-title">汤圆的作品集</h1>
                <span className="manga-subtitle">TANGYUAN'S PORTFOLIO</span>
              </div>
            </div>
            <div className="manga-masthead-right">
              <span className="manga-date">{currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="manga-issue">VOL.2024</span>
            </div>
          </div>
        </header>

        {/* 游戏网格 */}
        <main className="manga-main-layout">
          <div className="manga-games-grid">
            {games.map((game, index) => {
              const IconComponent = game.icon
              return (
                <article
                  key={game.id}
                  className={`manga-game-card ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                  onClick={() => navigate(game.path)}
                >
                  {/* 图标 */}
                  <div className="manga-card-icon">
                    <IconComponent size={40} />
                  </div>

                  {/* 内容 */}
                  <div className="manga-card-content">
                    <h3 className="manga-card-title-cn">{game.title}</h3>
                    <span className="manga-card-title-en">{game.subtitle}</span>
                    
                    <div className="manga-divider"></div>
                    
                    <p className="manga-card-desc">{game.description}</p>
                    
                    <div className="manga-tags">
                      {game.tags.map((tag, i) => (
                        <span key={i} className="manga-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* 底部 */}
                  <div className="manga-card-footer">
                    <span className="manga-card-date">{game.date}</span>
                    <span className="manga-card-arrow">›</span>
                  </div>

                  {/* 角落装饰 */}
                  <div className="manga-corner tl"></div>
                  <div className="manga-corner tr"></div>
                  <div className="manga-corner bl"></div>
                  <div className="manga-corner br"></div>
                </article>
              )
            })}
          </div>
        </main>

        {/* 底部 */}
        <footer className="manga-footer">
          <div className="manga-footer-content">
            <div className="manga-footer-line">
              <span>EST.2024</span>
              <span className="manga-sep">◆</span>
              <span>MADE WITH ♥ BY TANGYUAN</span>
              <span className="manga-sep">◆</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
            <div className="manga-icp">
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
