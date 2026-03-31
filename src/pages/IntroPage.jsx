import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Intro from '../components/Intro'

/**
 * Intro 动画独立页面
 * 通过特殊构造页面入口访问
 */
export default function IntroPage() {
  const navigate = useNavigate()
  const [showExitHint, setShowExitHint] = useState(false)

  const handleIntroComplete = () => {
    // 动画完成后返回上一页或主页
    navigate('/')
  }

  useEffect(() => {
    // 3 秒后显示退出提示
    const timer = setTimeout(() => {
      setShowExitHint(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="intro-page-wrapper">
      <Intro onComplete={handleIntroComplete} />
      
      {showExitHint && (
        <div className="exit-hint-overlay" style={{
          position: 'fixed',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'fade-in-up 0.5s ease forwards'
        }}>
          <div className="hint-content" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 149, 0, 0.1)',
            border: '1px solid rgba(255, 149, 0, 0.3)',
            borderRadius: '8px',
            color: 'rgba(255, 149, 0, 0.8)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono, monospace)',
            backdropFilter: 'blur(10px)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>点击任意位置退出动画</span>
          </div>
        </div>
      )}
    </div>
  )
}
