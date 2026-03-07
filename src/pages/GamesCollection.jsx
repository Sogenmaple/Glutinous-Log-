import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { BombIcon, BirdIcon, DinosaurIcon, SnakeIcon, PacmanIcon, GameIcon, CodeIcon, BlockIcon, StarIcon, ExperimentIcon, PlayIcon, TrophyIcon } from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 游戏宇宙页面 - 优雅展示所有项目
 */
export default function GamesCollection() {
  const navigate = useNavigate()
  const [hoveredGame, setHoveredGame] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 主要游戏项目
  const mainGames = [
    {
      id: 'minesweeper',
      title: '扫雷',
      subtitle: 'MINESWEEPER',
      description: '经典益智游戏，排除所有地雷',
      icon: BombIcon,
      color: 'red',
      path: '/special/minesweeper'
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇，吃掉食物成长',
      icon: SnakeIcon,
      color: 'green',
      path: '/special/snake'
    },
    {
      id: 'flybird',
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '穿越管道，飞翔挑战',
      icon: BirdIcon,
      color: 'cyan',
      path: '/special/flybird'
    },
    {
      id: 'pacman',
      title: '吃豆人',
      subtitle: 'PAC-MAN',
      description: '吃掉所有豆子，躲避幽灵',
      icon: PacmanIcon,
      color: 'amber',
      path: '/special/pacman'
    },
    {
      id: 'dinosaur',
      title: '恐龙快跑',
      subtitle: 'DINO RUN',
      description: '躲避障碍，奔跑生存',
      icon: DinosaurIcon,
      color: 'green',
      path: '/special/dinosaur'
    }
  ]

  // 游戏宇宙项目（按时间排序）
  const universeGames = [
    {
      id: 'block-puzzle',
      title: '方块谜题',
      subtitle: 'BLOCK PUZZLE',
      description: '几何方块拼接挑战，益智解谜',
      icon: BlockIcon,
      color: 'amber',
      path: '/special/tetris',
      year: '2024'
    },
    {
      id: 'code-warrior',
      title: '代码战士',
      subtitle: 'CODE WARRIOR',
      description: '编程挑战游戏，提升技能',
      icon: CodeIcon,
      color: 'cyan',
      path: '/games/code',
      year: '2024'
    },
    {
      id: 'star-collector',
      title: '星星收集者',
      subtitle: 'STAR COLLECTOR',
      description: '平台跳跃收集，挑战反应',
      icon: StarIcon,
      color: 'amber',
      path: '/games/star',
      year: '2023'
    },
    {
      id: 'experiment-lab',
      title: '实验实验室',
      subtitle: 'EXPERIMENT LAB',
      description: '物理模拟实验，探索发现',
      icon: ExperimentIcon,
      color: 'purple',
      path: '/games/experiment',
      year: '2023'
    },
    {
      id: 'play-ground',
      title: '游乐场',
      subtitle: 'PLAY GROUND',
      description: '休闲小游戏集合',
      icon: PlayIcon,
      color: 'green',
      path: '/games/play',
      year: '2022'
    },
    {
      id: 'trophy-hunt',
      title: '奖杯猎人',
      subtitle: 'TROPHY HUNT',
      description: '成就挑战系统',
      icon: TrophyIcon,
      color: 'amber',
      path: '/games/trophy',
      year: '2022'
    }
  ]

  return (
    <div className="games-collection-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="collection-bg-grid"></div>
      <div className="collection-bg-glow"></div>

      {/* 页面标题 */}
      <div className={`collection-header ${mounted ? 'visible' : ''}`}>
        <GameIcon size={64} color="#ff9500" />
        <h1 className="collection-title">游戏宇宙</h1>
        <p className="collection-subtitle">GAMES UNIVERSE // 汤圆游戏作品集</p>
        <div className="collection-divider"></div>
      </div>

      {/* 主要游戏区域 */}
      <section className="games-section">
        <div className="section-label">
          <span className="label-icon">◆</span>
          <span>休闲游戏</span>
          <span className="label-sub">QUICK GAMES</span>
        </div>
        
        <div className="main-games-grid">
          {mainGames.map((game, index) => {
            const IconComponent = game.icon
            return (
              <div
                key={game.id}
                className={`main-game-card ${game.color} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => navigate(game.path)}
              >
                <div className="card-icon">
                  <IconComponent size={56} color="currentColor" />
                </div>
                <h3 className="card-title">{game.title}</h3>
                <p className="card-subtitle">{game.subtitle}</p>
                <p className="card-desc">{game.description}</p>
                <div className="card-arrow">
                  <span>PLAY</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="corner tl"></div>
                <div className="corner tr"></div>
                <div className="corner bl"></div>
                <div className="corner br"></div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 游戏宇宙时间线 */}
      <section className="universe-section">
        <div className="section-label">
          <span className="label-icon">◆</span>
          <span>游戏宇宙</span>
          <span className="label-sub">GAME UNIVERSE</span>
        </div>

        <div className="universe-timeline">
          {universeGames.map((game, index) => {
            const IconComponent = game.icon
            return (
              <div
                key={game.id}
                className={`universe-item ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.08}s` }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => navigate(game.path)}
              >
                <div className="universe-year">{game.year}</div>
                <div className="universe-content">
                  <div className="universe-icon">
                    <IconComponent size={40} color="currentColor" />
                  </div>
                  <div className="universe-info">
                    <h3 className="universe-title">{game.title}</h3>
                    <p className="universe-subtitle">{game.subtitle}</p>
                    <p className="universe-desc">{game.description}</p>
                  </div>
                  <div className="universe-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 底部装饰 */}
      <div className="collection-footer">
        <div className="footer-line"></div>
        <p>EXPLORE THE UNIVERSE</p>
      </div>
    </div>
  )
}
