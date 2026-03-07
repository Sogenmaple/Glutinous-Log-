import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TangyuanIcon } from '../components/icons/SiteIcons'
import '../styles/ScreenSaver.css'

/**
 * 屏保页面 - 开屏动画作为屏保
 * 从 localStorage 读取配置
 */
export default function ScreenSaver() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [showExitHint, setShowExitHint] = useState(false)
  const [settings, setSettings] = useState({
    style: 'tangyuan',
    showClock: false,
    showHint: true
  })

  useEffect(() => {
    setMounted(true)
    
    // 加载配置
    const saved = localStorage.getItem('screensaver_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
    
    // 显示退出提示
    const timer = setTimeout(() => {
      setShowExitHint(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  // 退出屏保
  const exitScreenSaver = useCallback(() => {
    navigate('/')
  }, [navigate])

  // 键盘退出
  useEffect(() => {
    const handleKeyDown = () => {
      exitScreenSaver()
    }
    
    const handleMouseMove = () => {
      exitScreenSaver()
    }
    
    const handleClick = () => {
      exitScreenSaver()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [exitScreenSaver])

  return (
    <div className="screensaver-page">
      {/* 背景装饰 */}
      <div className="screensaver-bg-grid"></div>
      <div className="screensaver-bg-glow"></div>

      {/* 主视觉区域 */}
      <div className={`screensaver-content ${mounted ? 'visible' : ''}`}>
        <div className="screensaver-avatar">
          <TangyuanIcon size={120} color="#ff9500" />
          <div className="avatar-ring"></div>
          <div className="avatar-ring ring-outer"></div>
        </div>
        
        <h1 className="screensaver-title">汤圆的小窝</h1>
        <p className="screensaver-subtitle">TANGYUAN'S CREATIVE CORNER</p>
        
        <div className="screensaver-divider"></div>
        
        <p className="screensaver-hint">屏保模式 · 任意操作退出</p>
      </div>

      {/* 退出提示 */}
      {showExitHint && (
        <div className="exit-hint">
          <div className="hint-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>按任意键、移动鼠标或点击退出屏保</span>
          </div>
        </div>
      )}

      {/* 装饰性粒子 */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
