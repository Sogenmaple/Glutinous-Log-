import { useState, useEffect } from 'react'
import CassetteClock from './CassetteClock'

export default function Hero() {
  const [text, setText] = useState('')
  const fullText = '游戏创作者 / 独立开发者'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-bg-grid"></div>
      <div className="hero-content">
        <div className="hero-label">◈ PLAYER ONE ◈</div>
        <h1 className="hero-title">汤圆</h1>
        <div className="hero-subtitle">
          <span className="typing-text">{text}</span>
          <span className="cursor">_</span>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-label">GAMES</span>
            <span className="stat-value">06</span>
          </div>
          <div className="stat-divider">│</div>
          <div className="stat">
            <span className="stat-label">GENRE</span>
            <span className="stat-value">多元</span>
          </div>
          <div className="stat-divider">│</div>
          <div className="stat">
            <span className="stat-label">STATUS</span>
            <span className="stat-value blink-slow">创作中</span>
          </div>
        </div>
        <a href="#games" className="hero-cta">
          <span className="cta-bracket">[</span>
          <span className="cta-text">&gt; 查看作品集</span>
          <span className="cta-bracket">]</span>
        </a>
        <div className="hero-clock">
          <CassetteClock />
        </div>
      </div>
    </section>
  )
}
