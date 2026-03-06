import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 根据当前路由设置激活状态
  useEffect(() => {
    const path = location.pathname
    if (path === '/' || path === '') setActive('home')
    else if (path === '/games') setActive('games')
    else if (path === '/blog') setActive('blog')
    else if (path === '/about') setActive('about')
  }, [location])

  const navItems = [
    { id: 'home', label: '小窝', labelEn: 'HOME', path: '/' },
    { id: 'games', label: '游戏', labelEn: 'GAMES', path: '/games' },
    { id: 'blog', label: '博客', labelEn: 'BLOG', path: '/blog' },
    { id: 'about', label: '关于', labelEn: 'ABOUT', path: '/about' },
  ]

  const goTo = (path) => {
    navigate(path)
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-content">
        {/* Logo - 点击返回首页 */}
        <div className="logo" onClick={() => goTo('/')}>
          <span className="logo-bracket">[</span>
          <span className="logo-text">汤圆</span>
          <span className="logo-bracket">]</span>
          <div className="logo-glow"></div>
        </div>

        {/* 导航菜单 */}
        <nav className="nav">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => goTo(item.path)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-label-en">{item.labelEn}</span>
              <span className="nav-indicator"></span>
            </button>
          ))}
        </nav>

        {/* 状态指示器 */}
        <div className="header-status">
          <span className="status-dot"></span>
          <span className="status-text">ONLINE</span>
          <div className="status-pulse"></div>
        </div>
      </div>
    </header>
  )
}
