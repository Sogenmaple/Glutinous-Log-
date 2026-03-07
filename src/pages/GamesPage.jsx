import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  GameIcon, 
  BombIcon, 
  SnakeIcon, 
  PacmanIcon, 
  DinosaurIcon, 
  BirdIcon,
  BlockIcon,
  PlayIcon
} from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 休闲小游戏集合页面 - 磁带未来主义风格
 */
export default function GamesPage() {
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
      description: '经典益智游戏，在磁带未来风格的网格中找出所有地雷',
      icon: BombIcon,
      color: 'red',
      path: '/special/minesweeper',
      featured: true
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '磁带未来风格贪吃蛇，收集光点不断成长',
      icon: SnakeIcon,
      color: 'green',
      path: '/special/snake',
      featured: true
    },
    {
      id: 'pacman',
      title: '吃豆人',
      subtitle: 'PACMAN',
      description: '报纸风格吃豆人，在迷宫中吃掉所有豆子',
      icon: PacmanIcon,
      color: 'amber',
      path: '/special/pacman',
      featured: true
    },
    {
      id: 'dinosaur',
      title: '恐龙快跑',
      subtitle: 'DINOSAUR',
      description: '休闲跑酷游戏，躲避障碍物跑得越远越好',
      icon: DinosaurIcon,
      color: 'cyan',
      path: '/special/dinosaur',
      featured: true
    },
    {
      id: 'flybird',
      title: '飞扬的小鸟',
      subtitle: 'FLY BIRD',
      description: '穿越管道障碍，挑战你的反应速度',
      icon: BirdIcon,
      color: 'purple',
      path: '/special/flybird',
      featured: true
    },
    {
      id: 'tetris',
      title: '俄罗斯方块',
      subtitle: 'TETRIS',
      description: '经典消除游戏，排列方块消除得分',
      icon: BlockIcon,
      color: 'cyan',
      path: '/special/tetris',
      featured: true
    }
  ]

  return (
    <>
      <Header />
      <main className="special-constructs-page">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <GameIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">休闲小游戏</span>
          </h1>
          <p className="page-subtitle">CASUAL GAMES // CLASSIC FUN</p>
        </div>

        <div className="special-grid">
          {games.map((game, index) => {
            const IconComponent = game.icon
            return (
              <div
                key={game.id}
                className={`special-card ${game.color} ${game.featured ? 'featured' : ''} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => navigate(game.path)}
              >
                <div className="card-icon">
                  <IconComponent size={48} color="currentColor" />
                </div>

                <div className="card-content">
                  <h3 className="card-title">{game.title}</h3>
                  <p className="card-subtitle">{game.subtitle}</p>
                  <p className="card-description">{game.description}</p>
                </div>

                <span className="status-badge active">可用</span>

                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
              </div>
            )
          })}
        </div>

        <Footer />
      </main>
    </>
  )
}
