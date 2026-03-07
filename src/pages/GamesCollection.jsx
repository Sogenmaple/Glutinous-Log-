import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { BombIcon, BirdIcon, DinosaurIcon, SnakeIcon, PacmanIcon, GameIcon, CodeIcon, BlockIcon, StarIcon, ExperimentIcon, PlayIcon, TrophyIcon, BookIcon, ClockIcon, TangyuanIcon } from '../components/icons/SiteIcons'
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
      description: '经典益智游戏，排除所有地雷，考验逻辑思维能力',
      icon: BombIcon,
      color: 'red',
      path: '/special/minesweeper',
      date: 'VOL.001'
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇，吃掉食物成长，挑战反应速度',
      icon: SnakeIcon,
      color: 'green',
      path: '/special/snake',
      date: 'VOL.002'
    },
    {
      id: 'flybird',
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '穿越管道，飞翔挑战，极限操作',
      icon: BirdIcon,
      color: 'cyan',
      path: '/special/flybird',
      date: 'VOL.003'
    },
    {
      id: 'pacman',
      title: '吃豆人',
      subtitle: 'PAC-MAN',
      description: '吃掉所有豆子，躲避幽灵，经典街机回忆',
      icon: PacmanIcon,
      color: 'amber',
      path: '/special/pacman',
      date: 'VOL.004'
    },
    {
      id: 'dinosaur',
      title: '恐龙快跑',
      subtitle: 'DINO RUN',
      description: '躲避障碍，奔跑生存，无尽挑战模式',
      icon: DinosaurIcon,
      color: 'green',
      path: '/special/dinosaur',
      date: 'VOL.005'
    },
    {
      id: 'tetris',
      title: '俄罗斯方块',
      subtitle: 'TETRIS',
      description: '几何方块拼接，消除挑战，益智经典',
      icon: BlockIcon,
      color: 'amber',
      path: '/special/tetris',
      date: 'VOL.006'
    },
    {
      id: 'code',
      title: '代码挑战',
      subtitle: 'CODE CHALLENGE',
      description: '编程技能提升，算法练习，逻辑思维',
      icon: CodeIcon,
      color: 'cyan',
      path: '/special/code',
      date: 'VOL.007'
    },
    {
      id: 'star',
      title: '星星收集',
      subtitle: 'STAR COLLECTOR',
      description: '平台跳跃，收集挑战，反应测试',
      icon: StarIcon,
      color: 'amber',
      path: '/special/star',
      date: 'VOL.008'
    },
    {
      id: 'experiment',
      title: '实验实验室',
      subtitle: 'EXPERIMENT LAB',
      description: '物理模拟，探索发现，创意实验',
      icon: ExperimentIcon,
      color: 'purple',
      path: '/special/experiment',
      date: 'VOL.009'
    },
    {
      id: 'play',
      title: '游乐场',
      subtitle: 'PLAY GROUND',
      description: '休闲游戏集合，轻松娱乐',
      icon: PlayIcon,
      color: 'green',
      path: '/special/play',
      date: 'VOL.010'
    },
    {
      id: 'trophy',
      title: '奖杯猎人',
      subtitle: 'TROPHY HUNT',
      description: '成就挑战系统，收集荣誉',
      icon: TrophyIcon,
      color: 'amber',
      path: '/special/trophy',
      date: 'VOL.011'
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
          <h1 className="header-title">游戏宇宙报</h1>
          <p className="header-subtitle">GAMES UNIVERSE NEWSPAPER</p>
        </div>
        
        <div className="header-divider"></div>
        
        <div className="header-nav">
          <span>休闲游戏</span>
          <span>益智挑战</span>
          <span>动作冒险</span>
          <span>创意实验</span>
        </div>
      </header>

      {/* 主要内容区 - 报纸分栏 */}
      <main className="newspaper-content">
        {/* 头条区域 */}
        <section className="headline-section">
          <div className="headline-box">
            <span className="headline-label">FEATURED</span>
            <GameIcon size={60} color="#ff9500" />
            <h2 className="headline-title">汤圆游戏作品集</h2>
            <p className="headline-desc">探索互动娱乐的无限可能 · 独立游戏开发者的创意结晶</p>
          </div>
        </section>

        {/* 游戏网格 - 报纸分栏布局 */}
        <div className="games-columns">
          {games.map((game, index) => {
            const IconComponent = game.icon
            return (
              <article
                key={game.id}
                className={`game-article ${game.color} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => navigate(game.path)}
              >
                {/* 文章头部 */}
                <div className="article-header">
                  <span className="article-date">{game.date}</span>
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
                  <span className="read-more">READ MORE →</span>
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
          <BookIcon size={32} color="#ff9500" />
          <p>汤圆的小窝 · 游戏宇宙报</p>
          <p className="footer-tagline">CREATED WITH PASSION · DESIGNED WITH LOVE</p>
          <ClockIcon size={24} color="#ff9500" />
        </div>
      </footer>
    </div>
  )
}
