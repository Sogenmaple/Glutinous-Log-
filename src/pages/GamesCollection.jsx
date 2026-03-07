import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { BombIcon, BirdIcon, DinosaurIcon, SnakeIcon, PacmanIcon, GameIcon, TangyuanIcon } from '../components/icons/SiteIcons'
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

  return (
    <div className="games-collection-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="newspaper-bg"></div>
      <div className="newspaper-grid"></div>

      {/* 报头 */}
      <header className="newspaper-header">
        <div className="header-top">
          <span className="header-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="header-issue">ISSUE NO.2024</span>
        </div>
        
        <div className="header-main">
          <TangyuanIcon size={80} color="#ff9500" />
          <h1 className="header-title">游戏宇宙</h1>
          <p className="header-subtitle">GAMES UNIVERSE // 休闲游戏集合</p>
        </div>
        
        <div className="header-divider"></div>
      </header>

      {/* 主要内容区 - 报纸分栏 */}
      <main className="newspaper-content">
        {/* 游戏网格 - 报纸分栏布局 */}
        <div className="games-columns">
          {games.map((game, index) => {
            const IconComponent = game.icon
            return (
              <article
                key={game.id}
                className={`game-article ${game.color} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.08}s` }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => navigate(game.path)}
              >
                {/* 文章头部 */}
                <div className="article-header">
                  <span className="article-status">{game.status === 'active' ? '可玩' : '开发中'}</span>
                  <div className="article-icon">
                    <IconComponent size={36} color="currentColor" />
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="article-divider"></div>

                {/* 文章内容 */}
                <div className="article-content">
                  <h3 className="article-title">{game.title}</h3>
                  <p className="article-subtitle">{game.subtitle}</p>
                  <p className="article-text">{game.description}</p>
                </div>

                {/* 文章底部 */}
                <div className="article-footer">
                  <span className="read-more">PLAY →</span>
                </div>

                {/* 装饰元素 */}
                <div className="article-corner tl"></div>
                <div className="article-corner tr"></div>
              </article>
            )
          })}
        </div>
      </main>

      {/* 底部 */}
      <footer className="newspaper-footer">
        <div className="footer-divider"></div>
        <div className="footer-content">
          <GameIcon size={32} color="#ff9500" />
          <p>点击任意卡片开始游戏</p>
          <p className="footer-tagline">ALL GAMES SUPPORT KEYBOARD & TOUCH</p>
        </div>
      </footer>
    </div>
  )
}
