import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { GameIcon, TangyuanIcon, CodeIcon, BlockIcon, StarIcon, ExperimentIcon, PlayIcon, TrophyIcon } from '../components/icons/SiteIcons'
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

      {/* 报头 */}
      <header className="newspaper-header">
        <div className="header-top">
          <span className="header-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="header-issue">ISSUE NO.2024</span>
        </div>
        
        <div className="header-main">
          <TangyuanIcon size={80} color="#ff9500" />
          <h1 className="header-title">游戏宇宙</h1>
          <p className="header-subtitle">GAMES UNIVERSE // 汤圆游戏作品集</p>
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
                style={{ animationDelay: `${index * 0.06}s` }}
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
                  
                  {/* 标签 */}
                  {game.tags && game.tags.length > 0 && (
                    <div className="article-tags">
                      {game.tags.map(tag => (
                        <span key={tag} className="article-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 文章底部 */}
                <div className="article-footer">
                  {game.links && game.links.gmhub && (
                    <a href={game.links.gmhub} target="_blank" rel="noopener noreferrer" className="article-link" onClick={(e) => e.stopPropagation()}>
                      GMHUB ↗
                    </a>
                  )}
                  {game.links && game.links.bilibili && (
                    <a href={game.links.bilibili} target="_blank" rel="noopener noreferrer" className="article-link" onClick={(e) => e.stopPropagation()}>
                      BILI ↗
                    </a>
                  )}
                  {game.links && game.links.taptap && (
                    <a href={game.links.taptap} target="_blank" rel="noopener noreferrer" className="article-link" onClick={(e) => e.stopPropagation()}>
                      TAPTAP ↗
                    </a>
                  )}
                  <span className="read-more">VIEW →</span>
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
          <p>汤圆游戏作品集 · 独立游戏开发</p>
          <p className="footer-tagline">CREATED WITH PASSION</p>
        </div>
      </footer>
    </div>
  )
}
