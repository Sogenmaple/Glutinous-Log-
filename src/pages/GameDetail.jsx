import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  ShopIcon
} from '../components/icons/SiteIcons'
import '../styles/GameDetail.css'

/**
 * 作品详情页 - 黑白漫画风格 v5.0
 */
export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // GameJam 作品数据
  const games = {
    '1': {
      date: '2023.2.3-2.5',
      event: '2023 GGJ 武汉站',
      theme: 'ROOT',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '零时密境',
      members: 'Resine-策划，米线 - 程序，愛夜游 yzz，新酱 - 美术，某鱼 - 美术，CC-策划，汤圆 - 策划',
      title: '根植于心',
      subtitle: 'ROOTED HEART',
      description: '在 ROOT 主题下创作的 GameJam 作品。探索生命的根源与意义，在有限的时间内创造无限的可能。',
      icon: StarIcon,
      gmhub: 'https://gmhub.com/game/2302',
      bilibili: 'https://www.bilibili.com/video/BV1RT411X7iv',
      tags: ['GGJ', '2023', '团队', '7 人']
    },
    '2': {
      date: '2023.7.7-7.9',
      event: '2023 CIGA 武汉站',
      theme: 'TOUCH',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '跑路策程只会梦见 AI 画师',
      members: '灵儿 - 策划，汤圆 - 动画，SolaWhite-美术，南瓜 - 程序',
      title: '美莱姆大战史少女',
      subtitle: 'SLIME BATTLE',
      description: '在 TOUCH 主题下的创意作品。结合史莱姆与少女元素，打造独特的战斗体验。',
      icon: ExperimentIcon,
      gmhub: 'https://gmhub.com/game/3037',
      tags: ['CIGA', '2023', '团队', '4 人']
    },
    '3': {
      date: '2024.7.5-7.7',
      event: '2024 CIGA 武汉站',
      theme: 'Limited And Limitless',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '渡维',
      subtitle: 'DIMENSIONAL',
      description: '在多维空间之间穿梭，突破维度的限制。Limited And Limitless 主题下的 Solo 作品，探索维度切换的解谜体验。',
      icon: StarIcon,
      gmhub: 'https://gmhub.com/game/5421',
      tags: ['CIGA', '2024', 'Solo', '维度']
    },
    '4': {
      date: '2025.1.17-1.19',
      event: '2025 GGJ 武汉站',
      theme: 'BUBBLE',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '宇宙泡破',
      subtitle: 'COSMIC BUBBLE',
      description: '在宇宙中穿梭，破解泡泡。BUBBLE 主题下的太空探索游戏，在浩瀚星空中寻找答案。',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/799850',
      bilibili: 'https://www.bilibili.com/video/BV1HogSz9Eke',
      tags: ['GGJ', '2025', 'Solo', '太空']
    },
    '5': {
      date: '2025.6.27-6.29',
      event: '2025 CIGA 武汉站',
      theme: 'Everything is Alive',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '反物环',
      subtitle: 'ANTIMATTER',
      description: '在反物质环带中生存，体验物理引擎带来的极致挑战。Everything is Alive 主题下的物理解谜游戏。',
      icon: ExperimentIcon,
      gmhub: 'https://gmhub.com/game/7868',
      baidu: 'https://pan.baidu.com/s/1ePHaGrNnDBzgY-qKoESWCA',
      baiduPwd: '2345',
      taptap: 'https://www.taptap.cn/app/799022',
      tags: ['CIGA', '2025', 'Solo', '物理']
    },
    '6': {
      date: '2025.9.12-9.14',
      event: '2025 聚光灯武汉场',
      theme: '一段铃声',
      location: '湖北省武汉市光谷大道西保利光谷中心 12 层',
      organizer: '心动',
      team: 'T-Cat',
      members: '汤圆，CC, 阿察，涂朗明',
      title: '声纹',
      subtitle: 'SOUNDWAVE',
      description: '利用声波频率解谜，声音就是你的武器。一段铃声主题下的音乐解谜游戏。',
      icon: StarIcon,
      tags: ['聚光灯', '2025', '团队', '4 人', '音乐']
    },
    '7': {
      date: '2025.12.19-12.21',
      event: '2025 聚光灯成都场',
      theme: '模拟器',
      location: '四川省成都市高新区天府五街 168 号德必天府五街 WE',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '逃离俄罗斯方块',
      subtitle: 'ESCAPE TETRIS',
      description: '经典方块的全新演绎，这次你要逃出去！模拟器主题下的创意解谜游戏。',
      icon: BlockIcon,
      taptap: 'https://www.taptap.cn/app/797090',
      tags: ['聚光灯', '2025', 'Solo', '解谜']
    },
    '8': {
      date: '2026.3.28-3.29',
      event: '2026 GGJ 武汉站',
      theme: 'MASK',
      location: '武汉嘉嘉悦',
      organizer: '武汉铃空',
      team: '牛战士不会摘下他的面具',
      members: '汤圆，王宇珩，周易，柯善主，徐子康',
      title: '稽面划拳',
      subtitle: 'FIST GAME',
      description: '结合传统划拳文化的创意对战，搞笑又刺激。MASK 主题下的多人对战游戏。',
      icon: PlayIcon,
      gmhub: 'https://gmhub.com/game/9098',
      tags: ['GGJ', '2026', '团队', '5 人', '对战']
    },
    '9': {
      date: '2026.3.28-3.29',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '环俄罗斯方块',
      subtitle: 'RING TETRIS',
      description: '俄罗斯方块的环形变体，全新的空间挑战。',
      icon: BlockIcon,
      taptap: 'https://www.taptap.cn/app/834981',
      tags: ['聚光灯', '2026', 'Solo', '解谜']
    },
    '10': {
      date: '2026.3.28-3.29',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '耶梦加得 - 球面贪吃蛇大作战',
      subtitle: 'JORMUNGANDR',
      description: '球面空间中的贪吃蛇大战，北欧神话-inspired 的创意游戏。',
      icon: SnakeIcon,
      taptap: 'https://www.taptap.cn/app/834979',
      tags: ['聚光灯', '2026', 'Solo', '动作']
    },
    '11': {
      date: '2026.3.28-3.29',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '逃离直角坐标系',
      subtitle: 'ESCAPE COORDINATES',
      description: '在数学世界中寻找出路，坐标系中的冒险之旅。',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/835135',
      tags: ['聚光灯', '2026', 'Solo', '解谜']
    },
    '12': {
      date: '2026.3.28-3.29',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '真将棋',
      subtitle: 'SHOGI',
      description: '传统将棋的现代演绎，策略与智慧的较量。',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/834980',
      tags: ['聚光灯', '2026', 'Solo', '策略']
    },
    '13': {
      date: '2026.3.28-3.29',
      event: '2026 聚光灯上海场',
      theme: '不限',
      location: '上海市静安区万荣路 700 号 A3',
      organizer: '心动',
      team: '大锅炖汤圆队',
      members: '汤圆',
      title: '色盲派对',
      subtitle: 'COLOR BLIND',
      description: '色彩识别的挑战，在色盲的世界中寻找真相。',
      icon: StarIcon,
      taptap: 'https://www.taptap.cn/app/835219',
      tags: ['聚光灯', '2026', 'Solo', '益智']
    }
  }

  const game = games[id]

  if (!game) {
    return (
      <div className="manga-detail-page">
        <div className="manga-halftone"></div>
        <Header />
        <div className="manga-detail-container">
          <div className="manga-error">
            <h1>404</h1>
            <p>作品不存在</p>
            <button onClick={() => navigate('/games')}>返回作品集</button>
          </div>
        </div>
      </div>
    )
  }

  const IconComponent = game.icon

  // 计算指针角度
  const seconds = currentTime.getSeconds()
  const minutes = currentTime.getMinutes()
  const hours = currentTime.getHours() % 12
  
  const secondAngle = (seconds / 60) * 360
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360
  const hourAngle = ((hours + minutes / 60) / 12) * 360

  return (
    <div className="manga-detail-page">
      {/* 背景装饰 */}
      <div className="manga-halftone"></div>
      
      {/* 导航栏 */}
      <Header />
      
      <div className="manga-detail-container">
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

        {/* 作品详情 */}
        <main className="manga-detail-main">
          {/* 返回按钮 */}
          <button className="manga-back-btn" onClick={() => navigate('/games')}>
            ← 返回作品集
          </button>

          {/* 主卡片 */}
          <article className="manga-detail-card">
            {/* 图标 */}
            <div className="manga-detail-icon">
              <IconComponent size={80} />
            </div>

            {/* 标题 */}
            <div className="manga-detail-header">
              <h2 className="manga-detail-title-cn">{game.title}</h2>
              <span className="manga-detail-title-en">{game.subtitle}</span>
            </div>

            {/* 描述 */}
            <div className="manga-detail-description">
              <p>{game.description}</p>
            </div>

            {/* 标签 */}
            <div className="manga-detail-tags">
              {game.tags.map((tag, i) => (
                <span key={i} className="manga-tag">{tag}</span>
              ))}
            </div>
          </article>

          {/* 信息面板 */}
          <section className="manga-info-panel">
            <div className="manga-panel-header">
              <span>GAME INFORMATION</span>
            </div>

            <div className="manga-info-grid">
              <div className="manga-info-item">
                <span className="manga-info-label">DATE</span>
                <span className="manga-info-value">{game.date}</span>
              </div>
              <div className="manga-info-item">
                <span className="manga-info-label">EVENT</span>
                <span className="manga-info-value">{game.event}</span>
              </div>
              <div className="manga-info-item">
                <span className="manga-info-label">THEME</span>
                <span className="manga-info-value">{game.theme}</span>
              </div>
              <div className="manga-info-item">
                <span className="manga-info-label">LOCATION</span>
                <span className="manga-info-value">{game.location}</span>
              </div>
              <div className="manga-info-item">
                <span className="manga-info-label">ORGANIZER</span>
                <span className="manga-info-value">{game.organizer}</span>
              </div>
              <div className="manga-info-item">
                <span className="manga-info-label">TEAM</span>
                <span className="manga-info-value">{game.team}</span>
              </div>
              <div className="manga-info-item full-width">
                <span className="manga-info-label">MEMBERS</span>
                <span className="manga-info-value">{game.members}</span>
              </div>
            </div>
          </section>

          {/* 链接面板 */}
          <section className="manga-links-panel">
            <div className="manga-panel-header">
              <span>EXTERNAL LINKS</span>
            </div>

            <div className="manga-links-grid">
              {game.gmhub && (
                <a href={game.gmhub} target="_blank" rel="noopener noreferrer" className="manga-link-card">
                  <span>GmHub 顽社</span>
                  <span className="manga-link-arrow">↗</span>
                </a>
              )}
              {game.taptap && (
                <a href={game.taptap} target="_blank" rel="noopener noreferrer" className="manga-link-card">
                  <span>TapTap</span>
                  <span className="manga-link-arrow">↗</span>
                </a>
              )}
              {game.bilibili && (
                <a href={game.bilibili} target="_blank" rel="noopener noreferrer" className="manga-link-card">
                  <span>Bilibili</span>
                  <span className="manga-link-arrow">↗</span>
                </a>
              )}
              {game.baidu && (
                <a href={game.baidu} target="_blank" rel="noopener noreferrer" className="manga-link-card">
                  <span>百度网盘 (密码：{game.baiduPwd})</span>
                  <span className="manga-link-arrow">↗</span>
                </a>
              )}
            </div>
          </section>
        </main>

        {/* 底部 */}
        <footer className="manga-footer">
          <div className="manga-footer-content">
            <div className="manga-footer-line">
              <span>EST.2023</span>
              <span className="manga-sep">◆</span>
              <span>13 GAME JAM PROJECTS</span>
              <span className="manga-sep">◆</span>
              <span>MADE WITH ♥ BY TANGYUAN</span>
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
