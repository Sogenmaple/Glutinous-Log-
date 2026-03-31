import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import '../styles/Dinosaur.css'

const GRAVITY = 0.7
const JUMP_STRENGTH = 14
const BASE_SPEED = 8
const CANVAS_HEIGHT = 450
const GROUND_HEIGHT = 60
const DINO_X = 100

export default function Dinosaur() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [dinoY, setDinoY] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isDucking, setIsDucking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [particles, setParticles] = useState([])
  const [speedLevel, setSpeedLevel] = useState(1)
  
  const dinoYRef = useRef(0)
  const dinoVelocityRef = useRef(0)
  const speedRef = useRef(BASE_SPEED)
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)
  const scoreRef = useRef(0)
  const canvasHeightRef = useRef(CANVAS_HEIGHT)

  useEffect(() => {
    const saved = localStorage.getItem('dinosaur_highscore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('dinosaur_highscore', String(score))
    }
  }, [score, highScore])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  const createParticles = useCallback((x, y, count = 8) => {
    const newParticles = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        size: Math.random() * 3 + 2
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  const resetGame = useCallback(() => {
    setGameStarted(false)
    setGameOver(false)
    setIsPaused(false)
    setDinoY(0)
    dinoYRef.current = 0
    dinoVelocityRef.current = 0
    setObstacles([])
    setScore(0)
    setIsDucking(false)
    speedRef.current = BASE_SPEED
    setSpeedLevel(1)
    setParticles([])
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setDinoY(0)
    dinoYRef.current = 0
    dinoVelocityRef.current = 0
    setObstacles([{ x: 700, type: 'cactus' }])
    setScore(0)
    setIsDucking(false)
    speedRef.current = BASE_SPEED
    setSpeedLevel(1)
    setParticles([])
    lastTimeRef.current = performance.now()
  }, [])

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame()
      return
    }
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    // 使用 ref 检查是否在地面
    if (dinoYRef.current === 0) {
      dinoVelocityRef.current = JUMP_STRENGTH
      const groundY = canvasHeightRef.current - GROUND_HEIGHT
      createParticles(DINO_X + 20, groundY - 10, 6)
    }
  }, [gameStarted, gameOver, isPaused, startGame, resetGame, createParticles])

  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [jump, togglePause])

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const update = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp
        
        // 更新恐龙位置
        dinoYRef.current += dinoVelocityRef.current
        if (dinoYRef.current <= 0) {
          dinoYRef.current = 0
          dinoVelocityRef.current = 0
        } else {
          dinoVelocityRef.current -= GRAVITY
        }
        setDinoY(dinoYRef.current)

        // 更新障碍物
        setObstacles(prev => {
          let newObstacles = prev.map(obs => ({ 
            ...obs, 
            x: obs.x - speedRef.current 
          }))
          newObstacles = newObstacles.filter(obs => obs.x > -50)
          
          const lastObs = newObstacles[newObstacles.length - 1]
          const minGap = 350 + speedRef.current * 12
          
          if (!lastObs || lastObs.x < 750 - minGap) {
            newObstacles.push({
              x: 800,
              type: 'cactus'
            })
          }
          
          return newObstacles
        })

        // 更新粒子
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.25,
              life: p.life - 0.03
            }))
            .filter(p => p.life > 0)
        )

        // 更新分数
        setScore(s => s + 1)
        
        // 难度递增
        const currentScore = scoreRef.current
        if (currentScore > 0 && currentScore % 300 === 0) {
          const newLevel = Math.floor(currentScore / 300) + 1
          if (newLevel !== speedLevel) {
            setSpeedLevel(newLevel)
            speedRef.current = Math.min(BASE_SPEED + (newLevel - 1) * 0.5, 11)
          }
        }
      }
      
      gameLoopRef.current = requestAnimationFrame(update)
    }

    gameLoopRef.current = requestAnimationFrame(update)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused, speedLevel])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const groundY = canvasHeightRef.current - GROUND_HEIGHT
    const dinoWidth = 50
    const dinoHeight = 40
    const dinoLeft = DINO_X + 8
    const dinoRight = DINO_X + dinoWidth - 8
    const dinoTop = groundY + dinoY - dinoHeight + 8
    const dinoBottom = groundY + dinoY - 8

    for (const obs of obstacles) {
      const obsWidth = 25
      const obsHeight = 40
      const obsLeft = obs.x + 3
      const obsRight = obs.x + obsWidth - 3
      const obsTop = groundY - obsHeight + 3
      const obsBottom = groundY - 3

      if (dinoRight > obsLeft && 
          dinoLeft < obsRight && 
          dinoBottom > obsTop && 
          dinoTop < obsBottom) {
        setGameOver(true)
        createParticles(DINO_X + 20, groundY + dinoY - dinoHeight / 2, 12)
        return
      }
    }
  }, [dinoY, obstacles, gameStarted, gameOver, isPaused, isDucking, createParticles])

  return (
    <div className="dinosaur-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="dino-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>恐龙快跑</h1>
            <p className="subtitle">DINO RUN · 磁带未来风</p>
          </div>
          <div className="header-status">
            <span className={`status-badge ${gameOver ? 'danger' : gameStarted ? 'active' : 'ready'}`}>
              {gameOver ? 'GAME OVER' : gameStarted ? 'RUNNING' : 'READY'}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="newspaper-content">
          {/* 左侧边栏 */}
          <aside className="news-sidebar-left">
            <div className="score-box">
              <span className="score-label">SCORE</span>
              <span className="score-value">{String(score).padStart(6, '0')}</span>
            </div>
            <div className="score-box">
              <span className="score-label">BEST</span>
              <span className="score-value highlight">{String(highScore).padStart(6, '0')}</span>
            </div>
            <div className="info-box">
              <span className="info-label">LEVEL</span>
              <span className="info-value">{speedLevel}</span>
            </div>
            <div className="info-box">
              <span className="info-label">SPEED</span>
              <span className="info-value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
            </div>
            
            {/* 操作说明移到左侧边栏底部 */}
            <div className="controls-mini">
              <div className="controls-mini-header">
                <span>CONTROLS</span>
              </div>
              <div className="controls-mini-grid">
                <div className="control-mini">
                  <span className="mini-key">␣</span>
                  <span className="mini-label">跳</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">↑</span>
                  <span className="mini-label">跳</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">P</span>
                  <span className="mini-label">停</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area">
            <div className="game-canvas" onClick={jump}>
              <div className="bg-lines"></div>
              
              {particles.map(p => (
                <div
                  key={p.id}
                  className="particle"
                  style={{
                    left: p.x,
                    top: p.y,
                    backgroundColor: '#fff',
                    opacity: p.life,
                    width: p.size,
                    height: p.size
                  }}
                />
              ))}

              {/* 恐龙 */}
              <div 
                className="dino"
                style={{ bottom: GROUND_HEIGHT + dinoY, left: DINO_X }}
              >
                <svg viewBox="0 0 60 50" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* 身体 */}
                  <ellipse cx="30" cy="32" rx="20" ry="14"/>
                  {/* 脖子 */}
                  <path d="M45 28l12-8"/>
                  {/* 头 */}
                  <circle cx="52" cy="18" r="9"/>
                  {/* 嘴巴 */}
                  <path d="M58 16l4-2"/>
                  <path d="M58 20l4 0"/>
                  {/* 眼睛 */}
                  <circle cx="54" cy="16" r="2" fill="#fff"/>
                  {/* 背刺 */}
                  <path d="M25 20l-3-8"/>
                  <path d="M30 19l-2-7"/>
                  <path d="M35 20l-1-6"/>
                  {/* 腿 */}
                  <path d="M22 44l-4 6" className="leg-left"/>
                  <path d="M38 44l4 6" className="leg-right"/>
                  {/* 尾巴 */}
                  <path d="M12 34l-10-3"/>
                  <path d="M12 38l-8 2"/>
                </svg>
              </div>

              {/* 障碍物 - 仙人掌 */}
              {obstacles.map((obs, index) => (
                <div 
                  key={index}
                  className="obstacle cactus"
                  style={{ 
                    left: obs.x, 
                    bottom: GROUND_HEIGHT
                  }}
                >
                  <svg viewBox="0 0 30 45" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* 主干 */}
                    <path d="M15 45L15 12"/>
                    {/* 左分支 */}
                    <path d="M15 28l-8-6a4 4 0 0 0-4 4v3a3 3 0 0 0 3 3h3"/>
                    {/* 右分支 */}
                    <path d="M15 22l8-4a4 4 0 0 1 4 4v4a3 3 0 0 1-3 3h-3"/>
                    {/* 顶部 */}
                    <circle cx="15" cy="10" r="3"/>
                  </svg>
                </div>
              ))}

              <div className="ground">
                <div className="ground-line"></div>
              </div>

              {isPaused && !gameOver && (
                <div className="overlay pause">
                  <div className="overlay-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    <h2>游戏暂停</h2>
                    <p className="hint">按 P 或 ESC 继续</p>
                  </div>
                </div>
              )}

              {(!gameStarted || gameOver) && (
                <div className="overlay">
                  <div className="overlay-content">
                    {gameOver ? (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        <h2 className="result-title">游戏结束</h2>
                        <div className="score-board">
                          <div className="score-item">
                            <span className="label">得分</span>
                            <span className="value">{score}</span>
                          </div>
                          <div className="score-item">
                            <span className="label">最佳</span>
                            <span className="value highlight">{highScore}</span>
                          </div>
                        </div>
                        {score >= highScore && score > 0 && (
                          <div className="new-record">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                              <path d="M4 22h16"/>
                              <path d="M10 14.66V18c0 .55-.47.98-.97 1.21C7.85 19.75 5.97 21 3 21"/>
                              <path d="M14 14.66V18c0 .55.47.98.97 1.21C16.15 19.75 18.03 21 21 21"/>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                            </svg>
                            <span>新纪录!</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <h2 className="result-title">恐龙快跑</h2>
                        <p className="subtitle">简约黑白风格</p>
                      </>
                    )}
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                      {gameOver ? '再玩一次' : '开始游戏'}
                    </button>
                    <p className="controls-hint">
                      <span className="key-badge">空格</span> 跳跃 · 
                      <span className="key-badge">P</span> 暂停
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* 右侧边栏 */}
          <aside className="news-sidebar-right">
            <div className="wave-box">
              <span className="wave-label">SIGNAL</span>
              <div className="wave-bars">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="wave-bar"></div>
                ))}
              </div>
            </div>
            <div className="deco-box">
              <div className="deco-circle"></div>
              <span className="deco-text">TAPE</span>
            </div>
            <div className="deco-box">
              <div className="deco-circle"></div>
              <span className="deco-text">FUTURE</span>
            </div>
          </aside>
        </div>

        {/* 报尾 */}
        <div className="newspaper-footer">
          <span>DINO RUN © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>MINIMALIST DESIGN</span>
        </div>
      </div>
    </div>
  )
}
