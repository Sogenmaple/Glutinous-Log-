import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { BombIcon, BirdIcon, DinosaurIcon, SnakeIcon, PacmanIcon, GameIcon } from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 小游戏集锦页面
 * 集合所有休闲小游戏
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
      id: 'minesweeper',
      title: '扫雷',
      subtitle: 'MINESWEEPER',
      description: '经典扫雷游戏，排除所有地雷',
      icon: BombIcon,
      color: 'red',
      path: '/special/minesweeper',
      status: 'active'
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇，吃掉食物成长',
      icon: SnakeIcon,
      color: 'green',
      path: '/special/snake',
      status: 'active'
    },
    {
      id: 'flybird',
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '穿越管道，飞翔挑战',
      icon: BirdIcon,
      color: 'cyan',
      path: '/special/flybird',
      status: 'active'
    },
    {
      id: 'pacman',
      title: '吃豆人',
      subtitle: 'PAC-MAN',
      description: '吃掉所有豆子，躲避幽灵',
      icon: PacmanIcon,
      color: 'amber',
      path: '/special/pacman',
      status: 'active'
    },
    {
      id: 'dinosaur',
      title: '恐龙快跑',
      subtitle: 'DINO RUN',
      description: '躲避障碍，奔跑生存',
      icon: DinosaurIcon,
      color: 'green',
      path: '/special/dinosaur',
      status: 'active'
    }
  ]

  const colorMap = {
    amber: '#ff9500',
    cyan: '#06b6d4',
    red: '#ff453a',
    green: '#22c55e',
    purple: '#bd00ff'
  }

  return (
    <div className="games-collection-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="collection-bg-grid"></div>
      <div className="collection-bg-glow"></div>

      {/* 页面标题 */}
      <div className={`collection-header ${mounted ? 'visible' : ''}`}>
        <GameIcon size={60} color="#ff9500" />
        <h1 className="collection-title">小游戏</h1>
        <p className="collection-subtitle">GAMES // 休闲游戏集合</p>
        <div className="collection-divider"></div>
      </div>

      {/* 游戏卡片网格 */}
      <div className="games-grid">
        {games.map((game, index) => (
          <div
            key={game.id}
            className={`game-card ${game.color} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => navigate(game.path)}
          >
            {/* 游戏图标 */}
            <div className="game-icon">
              <game.icon size={48} color="currentColor" />
            </div>

            {/* 游戏信息 */}
            <div className="game-info">
              <h3 className="game-title">{game.title}</h3>
              <p className="game-subtitle">{game.subtitle}</p>
              <p className="game-desc">{game.description}</p>
            </div>

            {/* 开始按钮 */}
            <div className="game-action">
              <span className="play-btn">开始游戏</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* 状态标签 */}
            {game.status === 'active' && (
              <span className="status-badge active">可玩</span>
            )}

            {/* 角落装饰 */}
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="collection-footer">
        <p>点击任意卡片开始游戏</p>
        <p className="footer-note">所有游戏均支持键盘和触摸操作</p>
      </div>
    </div>
  )
}
