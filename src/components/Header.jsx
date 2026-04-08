import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserIcon, LoginIcon, SettingsIcon, TomatoIcon, AdminToolsIcon, ReturnIcon } from './icons/SiteIcons'

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
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          console.log('Header: 从 localStorage 加载用户:', parsedUser)
          setUser(parsedUser)
          setIsAdmin(parsedUser.role === 'admin')
        } else {
          console.log('Header: localStorage 中没有用户数据')
        }
      } catch (err) {
        console.error('Header: 解析用户数据失败:', err)
      }
    }
    loadUser()
    
    // 监听头像更新事件
    window.addEventListener('avatar-updated', loadUser)
    return () => window.removeEventListener('avatar-updated', loadUser)
  }, [])

  const navItems = [
    { id: 'home', label: '首页', path: '/' },
    { id: 'games', label: '作品集', path: '/games' },
    { id: 'special', label: '构造', path: '/special' },
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
          <span className="logo-text">汤圆的作品集</span>
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
                {user.avatar ? (
                  <img src={user.avatar} alt="头像" className="header-avatar" />
                ) : (
                  <UserIcon size={16} />
                )}
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  {user.avatar && (
                    <div className="dropdown-avatar">
                      <img src={user.avatar} alt="头像" />
                    </div>
                  )}
                  <div className="dropdown-item" onClick={() => {
                    navigate('/profile')
                    setShowUserMenu(false)
                  }}>
                    <UserIcon size={18} />
                    <span>个人中心</span>
                  </div>
                  <div className="dropdown-item" onClick={() => {
                    navigate('/special/pomodoro')
                    setShowUserMenu(false)
                  }}>
                    <TomatoIcon size={18} />
                    <span>番茄钟</span>
                  </div>
                  {isAdmin && (
                    <>
                      <div className="dropdown-item" onClick={() => {
                        navigate('/admin/dashboard')
                        setShowUserMenu(false)
                      }}>
                        <AdminToolsIcon size={18} />
                        <span>后台管理</span>
                      </div>
                      <div className="dropdown-item" onClick={() => {
                        navigate('/')
                        setShowUserMenu(false)
                      }}>
                        <ReturnIcon size={18} />
                        <span>返回前端</span>
                      </div>
                    </>
                  )}
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <LoginIcon size={18} />
                    <span>退出登录</span>
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
