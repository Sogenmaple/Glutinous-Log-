import { useState, useEffect } from 'react'

export default function Hero() {
  const [text, setText] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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

  // 鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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
      </div>
      <div
        className="hero-decoration"
        style={{
          transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px) rotate(${mousePos.x * 0.5}deg)`,
        }}
      >
        <div className="cassette">
          <div className="cassette-body">
            <div className="cassette-holes">
              <div className="cassette-hole"></div>
              <div className="cassette-hole"></div>
            </div>
            <div className="cassette-window">
              <div className="cassette-reel left-reel">
                <div className="reel-center"></div>
              </div>
              <div className="cassette-tape"></div>
              <div className="cassette-reel right-reel">
                <div className="reel-center"></div>
              </div>
            </div>
            <div className="cassette-label">
              <span>TANGYUAN</span>
              <span>GAMES VOL.1</span>
            </div>
            <div className="cassette-bottom">
              <div className="cassette-groove"></div>
              <div className="cassette-groove"></div>
              <div className="cassette-groove"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
