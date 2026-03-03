import { useState, useEffect } from 'react'

export default function Header() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { id: 'home', label: '首页', labelEn: 'HOME' },
    { id: 'timeline', label: '历程', labelEn: 'TIMELINE' },
    { id: 'games', label: '作品', labelEn: 'GAMES' },
    { id: 'about', label: '关于', labelEn: 'ABOUT' },
  ]

  const scrollTo = (id) => {
    setActive(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo" onClick={() => scrollTo('home')}>
          <span className="logo-bracket">[</span>
          <span className="logo-text">汤圆</span>
          <span className="logo-bracket">]</span>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-label-en">{item.labelEn}</span>
            </button>
          ))}
        </nav>
        <div className="header-status">
          <span className="status-dot"></span>
          <span className="status-text">ONLINE</span>
        </div>
      </div>
    </header>
  )
}
