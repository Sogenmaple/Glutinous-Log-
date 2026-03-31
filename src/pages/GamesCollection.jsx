import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { 
  GameIcon, 
  StarIcon, 
  ExperimentIcon, 
  BlockIcon, 
  PlayIcon, 
  BombIcon, 
  SnakeIcon, 
  BirdIcon, 
  PacmanIcon, 
  DinosaurIcon,
  GithubIcon,
  VideoIcon,
  ShopIcon,
  ChatIcon
} from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 游戏宇宙页面 - 极致黑白漫画风格
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
      description: '2024 CiGA Game Jam 作品。在多维空间之间穿梭，突破维度的限制。独特的维度切换机制，带来前所未有的解谜体验。',
      icon: StarIcon,
      date: '2024-07-06',
      tags: ['CiGA', '维度', '解谜'],
      path: '/games/1'
    },
    {
      id: 5,
      title: '反物环',
      subtitle: 'ANTIMATTER',
      description: '2025 CiGA Game Jam 48 小时 Solo 作品。在反物质环带中生存，体验物理引擎带来的极致挑战。',
      icon: ExperimentIcon,
      date: '2025-06-29',
      tags: ['CiGA', '物理', 'Solo'],
      path: '/games/5'
    },
    {
      id: 2,
      title: '声纹',
      subtitle: 'SOUNDWAVE',
      description: '2025 聚光灯武汉站作品。利用声波频率解谜，声音就是你的武器。',
      icon: StarIcon,
      date: '2025-09-14',
      tags: ['聚光灯', '音乐', '解谜'],
      path: '/games/2'
    },
    {
      id: 3,
      title: '逃离俄罗斯方块',
      subtitle: 'ESCAPE TETRIS',
      description: '2026 聚光灯成都站 48 小时个人 Solo 作品。经典方块的全新演绎，这次你要逃出去！',
      icon: BlockIcon,
      date: '2026-12-21',
      tags: ['聚光灯', '解谜', 'Solo'],
      path: '/games/3'
    },
    {
      id: 4,
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      description: '2025 Global Game Jam 作品。在宇宙中穿梭，破解泡泡，探索未知的星系。',
      icon: StarIcon,
      date: '2025-01-19',
      tags: ['GGJ2025', '太空', '休闲'],
      path: '/games/4'
    },
    {
      id: 6,
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      description: '2026 Global Game Jam 作品。结合传统划拳文化的创意对战，搞笑又刺激。',
      icon: PlayIcon,
      date: '2026-01-25',
      tags: ['GGJ2026', '对战', '休闲'],
      path: '/games/6'
    },
    {
      id: 7,
      title: '扫雷',
      subtitle: 'MINESWEEPER',
      description: '经典扫雷游戏，排除所有地雷，完成挑战。多种难度可选。',
      icon: BombIcon,
      date: '2024-03-15',
      tags: ['经典', '益智'],
      path: '/special/minesweeper'
    },
    {
      id: 8,
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇游戏，粒子特效，难度递增。支持双人模式。',
      icon: SnakeIcon,
      date: '2024-02-20',
      tags: ['经典', '动作'],
      path: '/special/snake'
    },
    {
      id: 9,
      title: 'FlyBird',
      subtitle: 'FLAPPY BIRD',
      description: '飞扬的小鸟，穿越障碍，挑战极限。超流畅的物理效果。',
      icon: BirdIcon,
      date: '2024-04-10',
      tags: ['经典', '动作'],
      path: '/special/flybird'
    },
    {
      id: 10,
      title: '吃豆人',
      subtitle: 'PACMAN',
      description: '经典吃豆人游戏，幽灵 AI，能量豆模式。复古像素风格。',
      icon: PacmanIcon,
      date: '2024-05-05',
      tags: ['经典', '动作'],
      path: '/special/pacman'
    },
    {
      id: 11,
      title: '恐龙快跑',
      subtitle: 'DINOSAUR RUN',
      description: 'Chrome 恐龙游戏，粒子特效，难度 progression。离线也能玩。',
      icon: DinosaurIcon,
      date: '2024-01-08',
      tags: ['经典', '动作'],
      path: '/special/dinosaur'
    }
  ]

  // 社交链接
  const socialLinks = [
    { name: 'GITHUB', path: 'https://github.com/Sogenmaple', icon: GithubIcon },
    { name: 'BILIBILI', path: 'https://space.bilibili.com/389369217', icon: VideoIcon },
    { name: 'TAPTAP', path: 'https://www.taptap.cn/developer/338837', icon: ShopIcon },
    { name: 'QQ 群', path: 'https://qm.qq.com/q/AxbQpuKKsK', icon: ChatIcon }
  ]

  // 计算指针角度（同心圆环缺口位置）
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
        {/* 报头 - 黑底白字 */}
        <header className="manga-masthead">
          <div className="manga-masthead-content">
            <div className="manga-masthead-left">
              {/* 黑白环形钟 - 同心圆环 */}
              <div className="manga-ring-clock">
                <svg viewBox="0 0 100 100" className="manga-clock-svg">
                  {/* 外圈 - 秒针环（完整圆环，缺口指示时间） */}
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
                  {/* 中圈 - 分针环 */}
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
                  {/* 内圈 - 时针环 */}
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
                  {/* 中心点 */}
                  <circle cx="50" cy="50" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="manga-masthead-text">
                <h1 className="manga-main-title">汤圆的游戏</h1>
                <span className="manga-subtitle">TANGYUAN'S GAMES</span>
              </div>
            </div>
            <div className="manga-masthead-right">
              <span className="manga-date">{currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="manga-issue">VOL.2024</span>
            </div>
          </div>
        </header>

        {/* 主布局 - 不对称三栏 */}
        <div className="manga-main-layout">
          {/* 左侧栏 - 黑底白字 */}
          <aside className="manga-sidebar-left">
            <div className="manga-stat-card">
              <div className="manga-card-header">
                <GameIcon size={20} />
                <span>TOTAL GAMES</span>
              </div>
              <div className="manga-stat-num">11</div>
              <div className="manga-stat-label">游戏总数</div>
            </div>

            <div className="manga-stat-card">
              <div className="manga-card-header">
                <StarIcon size={20} />
                <span>RELEASED</span>
              </div>
              <div className="manga-stat-num">06</div>
              <div className="manga-stat-label">已发布</div>
            </div>

            <div className="manga-social-card">
              <div className="manga-card-header">
                <span>CONNECT</span>
              </div>
              <div className="manga-social-list">
                {socialLinks.map((link, i) => {
                  const LinkIcon = link.icon
                  return (
                    <a
                      key={i}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="manga-social-item"
                    >
                      <LinkIcon size={18} />
                      <span>{link.name}</span>
                      <span className="manga-social-arrow">↗</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* 中央 - 游戏网格 */}
          <main className="manga-games-main">
            <div className="manga-games-grid">
              {games.map((game, index) => {
                const IconComponent = game.icon
                const isWide = index === 0 || index === 3 || index === 6
                return (
                  <article
                    key={game.id}
                    className={`manga-game-card ${isWide ? 'wide' : ''} ${hoveredGame === game.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onMouseEnter={() => setHoveredGame(game.id)}
                    onMouseLeave={() => setHoveredGame(null)}
                    onClick={() => navigate(game.path)}
                  >
                    {/* 图标容器 */}
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

                    {/* 底部信息 */}
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

          {/* 右侧栏 - 白底黑字 */}
          <aside className="manga-sidebar-right">
            <div className="manga-info-card">
              <div className="manga-card-header">
                <span>INFO</span>
              </div>
              <div className="manga-info-content">
                <div className="manga-info-row">
                  <span className="manga-info-label">ENGINE</span>
                  <span className="manga-info-value">Unity</span>
                </div>
                <div className="manga-info-row">
                  <span className="manga-info-label">JAMS</span>
                  <span className="manga-info-value">CiGA / GGJ / 聚光灯</span>
                </div>
                <div className="manga-info-row">
                  <span className="manga-info-label">STATUS</span>
                  <span className="manga-info-value active">ONLINE</span>
                </div>
              </div>
            </div>

            <div className="manga-tech-card">
              <div className="manga-card-header">
                <span>TECH</span>
              </div>
              <div className="manga-tech-tags">
                {['React', 'Vite', 'JavaScript', 'CSS3', 'HTML5', 'Git'].map((tech, i) => (
                  <span key={i} className="manga-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 底部 - 黑底白字 */}
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
