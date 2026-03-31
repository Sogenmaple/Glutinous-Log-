import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GameIcon, BookIcon, UserIcon, ToolIcon,
  GithubIcon, VideoIcon, ShopIcon, ChatIcon,
  StarIcon, TrophyIcon, ClockIcon, CodeIcon
} from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/NewspaperHome.css'

/**
 * 汤圆的小窝 - 黑白漫画风格首页
 * 模仿游戏宇宙页面风格，只保留四个核心版块
 */
export default function NewspaperHome() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [hoveredChannel, setHoveredChannel] = useState(null)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 四个核心版块 - 汤圆主题
  const mainChannels = [
    {
      id: 'games',
      title: '汤圆的游戏',
      subtitle: "TANGYUAN'S GAMES",
      desc: '创意是生活的燃料 · 独立游戏作品展示',
      icon: GameIcon,
      path: '/games',
      color: 'black',
      tags: ['CiGA', 'GGJ', '聚光灯', '独立游戏']
    },
    {
      id: 'special',
      title: '汤圆的工具',
      subtitle: "TANGYUAN'S TOOLS",
      desc: '总有些美味的怪诞 · 实用工具与休闲游戏',
      icon: ToolIcon,
      path: '/special',
      color: 'black',
      tags: ['番茄钟', '计算器', '扫雷', '贪吃蛇']
    },
    {
      id: 'blog',
      title: '汤圆的博客',
      subtitle: "TANGYUAN'S BLOG",
      desc: '游戏 · 生活 · 随笔 · 技术分享',
      icon: BookIcon,
      path: '/blog',
      color: 'black',
      tags: ['项目', '技术', '设计', '随笔']
    },
    {
      id: 'about',
      title: '汤圆的关于',
      subtitle: 'ABOUT TANGYUAN',
      desc: '开发者信息 · 联系方式 · 社交网络',
      icon: UserIcon,
      path: '/about',
      color: 'black',
      tags: ['技能', '联系', '社交', '更多']
    }
  ]

  // 社交链接
  const socialLinks = [
    { name: 'GITHUB', path: 'https://github.com/Sogenmaple', icon: GithubIcon },
    { name: 'BILIBILI', path: 'https://space.bilibili.com/389369217', icon: VideoIcon },
    { name: 'TAPTAP', path: 'https://www.taptap.cn/developer/338837', icon: ShopIcon },
    { name: 'QQ 群', path: 'https://qm.qq.com/q/AxbQpuKKsK', icon: ChatIcon }
  ]

  // 计算环形钟角度
  const seconds = currentTime.getSeconds()
  const minutes = currentTime.getMinutes()
  const hours = currentTime.getHours() % 12
  
  const secondAngle = (seconds / 60) * 360
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360
  const hourAngle = ((hours + minutes / 60) / 12) * 360

  return (
    <div className="manga-home-page">
      {/* 漫画网点背景 */}
      <div className="manga-halftone"></div>
      
      <Header />
      
      <div className="manga-home-container">
        {/* 报头 - 黑底白字 */}
        <header className="manga-home-masthead">
          <div className="manga-home-masthead-content">
            <div className="manga-home-masthead-left">
              {/* 环形钟 */}
              <div className="manga-home-ring-clock">
                <svg viewBox="0 0 100 100" className="manga-home-clock-svg">
                  <circle
                    className="manga-home-ring-second"
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
                    className="manga-home-ring-minute"
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
                    className="manga-home-ring-hour"
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
              <div className="manga-home-masthead-text">
                <h1 className="manga-home-main-title">湯圓的小窩</h1>
                <span className="manga-home-subtitle">TANGYUAN'S CREATIVE CORNER</span>
              </div>
            </div>
            <div className="manga-home-masthead-right">
              <span className="manga-home-date">
                {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </span>
              <span className="manga-home-issue">VOL.2026</span>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="manga-home-main">
          {/* 左侧栏 - 统计数据 */}
          <aside className="manga-home-sidebar-left">
            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <TrophyIcon size={20} />
                <span>PROJECTS</span>
              </div>
              <div className="manga-home-stat-num">11</div>
              <div className="manga-home-stat-label">项目总数</div>
            </div>

            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <StarIcon size={20} />
                <span>RELEASED</span>
              </div>
              <div className="manga-home-stat-num">06</div>
              <div className="manga-home-stat-label">已发布</div>
            </div>

            <div className="manga-home-stat-card">
              <div className="manga-home-card-header">
                <ClockIcon size={20} />
                <span>EST.2024</span>
              </div>
              <div className="manga-home-stat-num">99.9%</div>
              <div className="manga-home-stat-label">运行时间</div>
            </div>
          </aside>

          {/* 中央 - 四个核心版块 */}
          <main className="manga-home-central">
            <div className="manga-home-channels">
              {mainChannels.map((channel, index) => {
                const IconComp = channel.icon
                return (
                  <article
                    key={channel.id}
                    className={`manga-home-channel ${hoveredChannel === channel.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setHoveredChannel(channel.id)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onClick={() => navigate(channel.path)}
                  >
                    {/* 图标容器 */}
                    <div className="manga-home-channel-icon">
                      <IconComp size={40} />
                    </div>

                    {/* 内容 */}
                    <div className="manga-home-channel-content">
                      <h3 className="manga-home-channel-title-cn">{channel.title}</h3>
                      <span className="manga-home-channel-title-en">{channel.subtitle}</span>
                      
                      <div className="manga-home-divider"></div>
                      
                      <p className="manga-home-channel-desc">{channel.desc}</p>
                      
                      <div className="manga-home-tags">
                        {channel.tags.map((tag, i) => (
                          <span key={i} className="manga-home-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* 底部信息 */}
                    <div className="manga-home-channel-footer">
                      <span className="manga-home-channel-arrow">› ENTER</span>
                    </div>

                    {/* 角落装饰 */}
                    <div className="manga-home-corner tl"></div>
                    <div className="manga-home-corner tr"></div>
                    <div className="manga-home-corner bl"></div>
                    <div className="manga-home-corner br"></div>
                  </article>
                )
              })}
            </div>
          </main>

          {/* 右侧栏 - 社交链接 */}
          <aside className="manga-home-sidebar-right">
            <div className="manga-home-social-card">
              <div className="manga-home-card-header">
                <span>CONNECT</span>
              </div>
              <div className="manga-home-social-list">
                {socialLinks.map((link, i) => {
                  const LinkIcon = link.icon
                  return (
                    <a
                      key={i}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="manga-home-social-item"
                    >
                      <LinkIcon size={18} />
                      <span>{link.name}</span>
                      <span className="manga-home-social-arrow">↗</span>
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="manga-home-tech-card">
              <div className="manga-home-card-header">
                <CodeIcon size={20} />
                <span>TECH</span>
              </div>
              <div className="manga-home-tech-tags">
                {['React', 'Vite', 'Node.js', 'JavaScript', 'CSS3', 'Git'].map((tech, i) => (
                  <span key={i} className="manga-home-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 底部 */}
        <footer className="manga-home-footer">
          <div className="manga-home-footer-content">
            <div className="manga-home-footer-line">
              <span>EST.2024</span>
              <span className="manga-home-sep">◆</span>
              <span>MADE WITH ♥ BY TANGYUAN</span>
              <span className="manga-home-sep">◆</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
            <div className="manga-home-icp">
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
