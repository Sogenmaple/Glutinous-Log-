import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserIcon, LoginIcon } from './icons/SiteIcons'

export default function Header() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 检查登录状态
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // 根据当前路由设置激活状态
  useEffect(() => {
    const path = location.pathname
    if (path === '/' || path === '') setActive('home')
    else if (path === '/games') setActive('games')
    else if (path === '/blog') setActive('blog')
    else if (path === '/about') setActive('about')
    else if (path === '/login' || path === '/register') setActive('auth')
    else if (path.startsWith('/special')) setActive('special')
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowUserMenu(false)
    navigate('/')
  }

  // 获取面包屑导航
  const getBreadcrumbs = () => {
    const path = location.pathname
    const crumbs = [{ label: '首页', path: '/' }]
    
    if (path === '/' || path === '') return crumbs
    
    const segments = path.split('/').filter(Boolean)
    let currentPath = ''
    
    segments.forEach(segment => {
      currentPath += '/' + segment
      const navItem = navItems.find(item => item.path === currentPath)
      if (navItem) {
        crumbs.push({ label: navItem.label, path: currentPath })
      } else if (segment === 'pomodoro') {
        crumbs.push({ label: '番茄钟', path: currentPath })
      } else if (segment === 'login') {
        crumbs.push({ label: '登录', path: currentPath })
      } else if (segment === 'register') {
        crumbs.push({ label: '注册', path: currentPath })
      }
    })
    
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-top">
        <div className="header-content">
          {/* Logo - 点击返回首页 */}
          <div className="logo" onClick={() => goTo('/')}>
            <span className="logo-bracket">[</span>
            <span className="logo-text">汤圆</span>
            <span className="logo-bracket">]</span>
            <div className="logo-glow"></div>
          </div>

          {/* 导航菜单 - 桌面端 */}
          <nav className="nav nav-desktop">
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

          {/* 用户区域 */}
          <div className="header-user">
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <UserIcon size={18} />
                  <span className="user-name">{user.username}</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={() => {
                      goTo('/special/pomodoro')
                      setShowUserMenu(false)
                    }}>
                      <span>我的待办</span>
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <span>退出登录</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => goTo('/login')}
              >
                <LoginIcon size={18} />
                <span>登录</span>
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button className="mobile-menu-btn" onClick={() => setActive(active === 'mobile' ? 'home' : 'mobile')}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* 移动端导航菜单 */}
        <nav className={`nav nav-mobile ${active === 'mobile' ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => {
                goTo(item.path)
                setActive('home')
              }}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-label-en">{item.labelEn}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 面包屑导航 */}
      {breadcrumbs.length > 1 && (
        <div className="breadcrumb-bar">
          <div className="breadcrumb-content">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="breadcrumb-item">
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <button 
                  className={`breadcrumb-link ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                  onClick={() => goTo(crumb.path)}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
