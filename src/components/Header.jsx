import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserIcon, LoginIcon } from './icons/SiteIcons'

export default function Header() {
  const [expanded, setExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
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
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsAdmin(parsedUser.role === 'admin')
    }
  }, [])

  const navItems = [
    { id: 'home', label: '小窝', path: '/' },
    { id: 'games', label: '游戏', path: '/games' },
    { id: 'blog', label: '博客', path: '/blog' },
    { id: 'about', label: '关于', path: '/about' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="header-main">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-bracket">[</span>
          <span className="logo-text">汤圆的小窝</span>
          <span className="logo-bracket">]</span>
        </div>

        {/* 导航菜单 */}
        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
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
                <UserIcon size={16} />
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item" onClick={() => {
                    navigate('/profile')
                    setShowUserMenu(false)
                  }}>
                    👤 个人中心
                  </div>
                  <div className="dropdown-item" onClick={() => {
                    navigate('/special/pomodoro')
                    setShowUserMenu(false)
                  }}>
                    🍅 番茄钟
                  </div>
                  {isAdmin && (
                    <>
                      <div className="dropdown-item" onClick={() => {
                        navigate('/admin/dashboard')
                        setShowUserMenu(false)
                      }}>
                        🔧 后台管理
                      </div>
                      <div className="dropdown-item" onClick={() => {
                        navigate('/')
                        setShowUserMenu(false)
                      }}>
                        🏠 返回前端
                      </div>
                    </>
                  )}
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    退出登录
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              <LoginIcon size={16} />
            </button>
          )}
        </div>

        {/* 展开/收起按钮 */}
        <button 
          className={`expand-btn ${expanded ? 'active' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* 面包屑 */}
      <Breadcrumb location={location} navigate={navigate} />
    </header>
  )
}

// 面包屑组件
function Breadcrumb({ location, navigate }) {
  const path = location.pathname
  if (path === '/' || path === '/login' || path === '/register') return null

  const crumbs = [{ label: '首页', path: '/' }]
  const segments = path.split('/').filter(Boolean)
  let currentPath = ''
  
  const nameMap = {
    games: '游戏',
    blog: '博客',
    about: '关于',
    special: '特殊',
    pomodoro: '番茄钟'
  }

  segments.forEach(segment => {
    currentPath += '/' + segment
    crumbs.push({ 
      label: nameMap[segment] || segment, 
      path: currentPath 
    })
  })

  return (
    <div className="breadcrumb-bar">
      <div className="breadcrumb-content">
        {crumbs.map((crumb, index) => (
          <div key={crumb.path} className="breadcrumb-item">
            {index > 0 && <span className="breadcrumb-separator">/</span>}
            <button 
              className={`breadcrumb-link ${index === crumbs.length - 1 ? 'active' : ''}`}
              onClick={() => navigate(crumb.path)}
            >
              {crumb.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
