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
  DinosaurIcon,
  GithubIcon,
  VideoIcon,
  ShopIcon,
  ChatIcon
} from '../components/icons/SiteIcons'
import '../styles/GamesCollection.css'

/**
 * 汤圆的作品集 - 时间轴排版 v5.0
 * 基于 GameJam 表格数据，滚动式时间轴展示
 */
export default function GamesCollection() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // 滚动视差效果
    const handleScroll = () => {
      const items = document.querySelectorAll('.manga-timeline-item')
      const scrollY = window.scrollY
      
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.85
        
        if (isVisible) {
          item.classList.add('visible')
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化
    
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // GameJam 作品数据（按时间排序）
  const games = [
    {
      id: 1,
      date: '2023.2.3-2.5',
      fullDate: '2023-02-03',
      event: '2023 GGJ 武汉站',
      theme: 'ROOT',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '零时密境',
      members: 'Resine-策划，米线 - 程序，愛夜游 yzz，新酱 - 美术，某鱼 - 美术，CC-策划，汤圆 - 策划',
      title: '根植于心',
      subtitle: 'ROOTED HEART',
      icon: StarIcon,
      gmhub: 'https://gmhub.com/game/2302',
      bilibili: 'https://www.bilibili.com/video/BV1RT411X7iv',
      path: '/games/1'
    },
    {
      id: 2,
      date: '2023.7.7-7.9',
      fullDate: '2023-07-07',
      event: '2023 CIGA 武汉站',
      theme: 'TOUCH',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '跑路策程只会梦见 AI 画师',
      members: '灵儿 - 策划，汤圆 - 动画，SolaWhite-美术，南瓜 - 程序',
      title: '美莱姆大战史少女',
      subtitle: 'SLIME BATTLE',
      icon: ExperimentIcon,
      gmhub: 'https://gmhub.com/game/3037',
      path: '/games/2'
    },
    {
      id: 3,
      date: '2024.7.5-7.7',
      fullDate: '2024-07-05',
      event: '2024 CIGA 武汉站',
      theme: 'Limited And Limitless',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '渡维',
      subtitle: 'DIMENSIONAL',
      icon: StarIcon,
      gmhub: 'https://gmhub.com/game/5421',
      path: '/games/3'
    },
    {
      id: 4,
      date: '2025.1.17-1.19',
      fullDate: '2025-01-17',
      event: '2025 GGJ 武汉站',
      theme: 'BUBBLE',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      icon: StarIcon,
      gmhub: null,
      taptap: 'https://www.taptap.cn/app/799850',
      bilibili: 'https://www.bilibili.com/video/BV1HogSz9Eke',
      path: '/games/4'
    },
    {
      id: 5,
      date: '2025.6.27-6.29',
      fullDate: '2025-06-27',
      event: '2025 CIGA 武汉站',
      theme: 'Everything is Alive',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '反物环',
      subtitle: 'ANTIMATTER',
      icon: ExperimentIcon,
      gmhub: 'https://gmhub.com/game/7868',
      baidu: 'https://pan.baidu.com/s/1ePHaGrNnDBzgY-qKoESWCA',
      baiduPwd: '2345',
      taptap: 'https://www.taptap.cn/app/799022',
      path: '/games/5'
    },
    {
      id: 6,
      date: '2025.9.12-9.14',
      fullDate: '2025-09-12',
      event: '2025 聚光灯武汉场',
      theme: '一段铃声',
      location: '湖北省武汉市光谷大道西保利光谷中心 12 层',
      organizer: '心动',
      team: 'T-Cat',
      members: '汤圆，CC, 阿察，涂朗明',
      title: '声纹',
      subtitle: 'SOUNDWAVE',
      icon: StarIcon,
      path: '/games/6'
    },
    {
      id: 7,
      date: '2025.12.19-12.21',
      fullDate: '2025-12-19',
      event: '2025 聚光灯成都场',
      theme: '模拟器',
      location: '四川省成都市高新区天府五街 168 号德必天府五街 WE',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '逃离俄罗斯方块',
      subtitle: 'ESCAPE TETRIS',
      icon: BlockIcon,
      taptap: 'https://www.taptap.cn/app/797090',
      path: '/games/7'
    },
    {
      id: 8,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 GGJ 武汉站',
      theme: 'MASK',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '牛战士不会摘下他的面具',
      members: '汤圆，王宇珩，周易，柯善主，徐子康',
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      icon: PlayIcon,
      gmhub: 'https://gmhub.com/game/9098',
      path: '/games/8'
    },
    {
      id: 9,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '环俄罗斯方块',
      subtitle: 'RING TETRIS',
      icon: BlockIcon,
      taptap: 'https://www.taptap.cn/app/834981',
      path: '/games/9'
    },
    {
      id: 10,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '耶梦加得 - 球面贪吃蛇大作战',
      subtitle: 'JORMUNGANDR',
      icon: SnakeIcon,
      taptap: 'https://www.taptap.cn/app/834979',
      path: '/games/10'
    },
    {
      id: 11,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '逃离直角坐标系',
      subtitle: 'ESCAPE COORDINATES',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/835135',
      path: '/games/11'
    },
    {
      id: 12,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '真将棋',
      subtitle: 'SHOGI',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/834980',
      path: '/games/12'
    },
    {
      id: 13,
      date: '2026.3.28-3.29',
      fullDate: '2026-03-28',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '色盲派对',
      subtitle: 'COLOR BLIND',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/835219',
      path: '/games/13'
    }
  ]

  // 社交链接
  const socialLinks = [
    { name: 'GITHUB', path: 'https://github.com/Sogenmaple', icon: GithubIcon },
    { name: 'BILIBILI', path: 'https://space.bilibili.com/389369217', icon: VideoIcon },
    { name: 'TAPTAP', path: 'https://www.taptap.cn/developer/338837', icon: ShopIcon },
    { name: 'QQ 群', path: 'https://qm.qq.com/q/AxbQpuKKsK', icon: ChatIcon }
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

        {/* 时间轴 */}
        <main className="manga-timeline">
          <div className="manga-timeline-line"></div>
          
          {games.map((game, index) => {
            const IconComponent = game.icon
            const isLeft = index % 2 === 0
            
            return (
              <article
                key={game.id}
                className={`manga-timeline-item ${isLeft ? 'left' : 'right'} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(game.path)}
              >
                {/* 时间标记 */}
                <div className="manga-timeline-marker">
                  <span className="manga-timeline-date">{game.date}</span>
                </div>

                {/* 卡片内容 */}
                <div className="manga-timeline-card">
                  {/* 图标 */}
                  <div className="manga-card-icon">
                    <IconComponent size={32} />
                  </div>

                  {/* 头部信息 */}
                  <div className="manga-timeline-header">
                    <h3 className="manga-card-title-cn">{game.title}</h3>
                    <span className="manga-card-title-en">{game.subtitle}</span>
                  </div>

                  {/* 活动信息 */}
                  <div className="manga-timeline-info">
                    <div className="manga-info-row">
                      <span className="manga-info-label">活动</span>
                      <span className="manga-info-value">{game.event}</span>
                    </div>
                    <div className="manga-info-row">
                      <span className="manga-info-label">主题</span>
                      <span className="manga-info-value">{game.theme}</span>
                    </div>
                    <div className="manga-info-row">
                      <span className="manga-info-label">队伍</span>
                      <span className="manga-info-value">{game.team}</span>
                    </div>
                  </div>

                  {/* 链接 */}
                  <div className="manga-timeline-links">
                    {game.gmhub && (
                      <a href={game.gmhub} target="_blank" rel="noopener noreferrer" className="manga-link-btn" onClick={(e) => e.stopPropagation()}>
                        GmHub ↗
                      </a>
                    )}
                    {game.taptap && (
                      <a href={game.taptap} target="_blank" rel="noopener noreferrer" className="manga-link-btn" onClick={(e) => e.stopPropagation()}>
                        TapTap ↗
                      </a>
                    )}
                    {game.bilibili && (
                      <a href={game.bilibili} target="_blank" rel="noopener noreferrer" className="manga-link-btn" onClick={(e) => e.stopPropagation()}>
                        Bilibili ↗
                      </a>
                    )}
                    {game.baidu && (
                      <a href={game.baidu} target="_blank" rel="noopener noreferrer" className="manga-link-btn" onClick={(e) => e.stopPropagation()}>
                        百度网盘 ({game.baiduPwd}) ↗
                      </a>
                    )}
                  </div>

                  {/* 角落装饰 */}
                  <div className="manga-corner tl"></div>
                  <div className="manga-corner tr"></div>
                  <div className="manga-corner bl"></div>
                  <div className="manga-corner br"></div>
                </div>
              </article>
            )
          })}
        </main>

      </div>
    </div>
  )
}
