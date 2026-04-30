import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  GameIcon, BookIcon, UserIcon, ToolIcon,
  GithubIcon, VideoIcon, ShopIcon, ChatIcon
} from '../components/icons/SiteIcons'
import Header from '../components/Header'
import '../styles/MobileHome.css'

/**
 * 汤圆的小窝 - 手机系统风格首页
 * 类似 iOS/Android 主屏幕的 app 图标布局
 */
export default function MobileHome() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 四个核心版块
  const mainChannels = [
    {
      id: 'games',
      title: '作品集',
      desc: '独立游戏作品',
      icon: GameIcon,
      path: '/games',
      color: '#2c2c2c'
    },
    {
      id: 'special',
      title: '工具箱',
      desc: '实用工具与游戏',
      icon: ToolIcon,
      path: '/special',
      color: '#4a4a4a'
    },
    {
      id: 'blog',
      title: '博客',
      desc: '技术分享与随笔',
      icon: BookIcon,
      path: '/blog',
      color: '#666666'
    },
    {
      id: 'about',
      title: '关于',
      desc: '开发者信息',
      icon: UserIcon,
      path: '/about',
      color: '#888888'
    }
  ]

  // 社交链接
  const socialLinks = [
    { name: 'GitHub', path: 'https://github.com/Sogenmaple', icon: GithubIcon },
    { name: 'Bilibili', path: 'https://space.bilibili.com/389369217', icon: VideoIcon },
    { name: 'TapTap', path: 'https://www.taptap.cn/developer/338837', icon: ShopIcon },
    { name: 'QQ 群', path: 'https://qm.qq.com/q/AxbQpuKKsK', icon: ChatIcon }
  ]

  // 格式化时间
  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
  }

  return (
    <div className="mobile-home-page">
      <Header />
      
      <div className="mobile-home-container">
        {/* 状态栏 */}
        <div className="mobile-status-bar">
          <span className="time">{formatTime(currentTime)}</span>
          <span className="date">{formatDate(currentTime)}</span>
        </div>

        {/* 标题 */}
        <div className="mobile-home-title">
          <h1>湯圓的小窩</h1>
          <span className="subtitle">TANGYUAN'S CREATIVE CORNER</span>
        </div>

        {/* App 图标网格 */}
        <div className="app-grid">
          {mainChannels.map((channel) => {
            const IconComp = channel.icon
            return (
              <div
                key={channel.id}
                className="app-icon-wrapper"
                onClick={() => navigate(channel.path)}
              >
                <div className="app-icon" style={{ background: channel.color }}>
                  <IconComp size={isMobile ? 36 : 48} color="white" />
                </div>
                <span className="app-name">{channel.title}</span>
              </div>
            )
          })}
        </div>

        {/* Dock 栏 */}
        <div className="mobile-dock">
          {socialLinks.map((link, i) => {
            const LinkIcon = link.icon
            return (
              <a
                key={i}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="dock-item"
              >
                <div className="dock-icon">
                  <LinkIcon size={isMobile ? 24 : 28} />
                </div>
                <span className="dock-name">{link.name}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}