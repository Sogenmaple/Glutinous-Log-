import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import '../styles/Dinosaur.css'

const GRAVITY = 0.65
const JUMP_STRENGTH = -14
const BASE_SPEED = 7
const GROUND_Y = 380
const DINO_X = 50

export default function Dinosaur() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [dinoY, setDinoY] = useState(GROUND_Y)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isDucking, setIsDucking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [particles, setParticles] = useState([])
  const [speedLevel, setSpeedLevel] = useState(1)
  
  const dinoVelocityRef = useRef(0)
  const speedRef = useRef(BASE_SPEED)
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)
  const scoreRef = useRef(0)

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

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setDinoY(GROUND_Y)
    dinoVelocityRef.current = 0
    setObstacles([{ x: 700, type: Math.random() > 0.6 ? 'bird' : 'cactus' }])
    setScore(0)
    setIsDucking(false)
    speedRef.current = BASE_SPEED
    setSpeedLevel(1)
    setParticles([])
    lastTimeRef.current = performance.now()
  }, [])

  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    if (dinoY >= GROUND_Y - 5) {
      dinoVelocityRef.current = JUMP_STRENGTH
      createParticles(DINO_X + 20, dinoY - 10, 6)
    }
  }, [gameStarted, gameOver, isPaused, dinoY, startGame, createParticles])

  const duck = useCallback((ducking) => {
    if (gameStarted && !gameOver && !isPaused) {
      setIsDucking(ducking)
    }
  }, [gameStarted, gameOver, isPaused])

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
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        duck(true)
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePause()
      }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowDown') {
        duck(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [jump, duck, togglePause])

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const update = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp
        
        setDinoY(prevY => {
          const newY = prevY + dinoVelocityRef.current
          if (newY >= GROUND_Y) {
            dinoVelocityRef.current = 0
            return GROUND_Y
          }
          dinoVelocityRef.current += GRAVITY
          return newY
        })

        setObstacles(prev => {
          let newObstacles = prev.map(obs => ({ 
            ...obs, 
            x: obs.x - speedRef.current 
          }))
          newObstacles = newObstacles.filter(obs => obs.x > -50)
          
          const lastObs = newObstacles[newObstacles.length - 1]
          const minGap = 300 + speedRef.current * 12
          
          if (!lastObs || lastObs.x < 750 - minGap) {
            const type = Math.random() > 0.6 ? 'bird' : 'cactus'
            newObstacles.push({
              x: 800,
              type,
              y: type === 'bird' ? GROUND_Y - 60 : GROUND_Y
            })
          }
          
          return newObstacles
        })

        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.2,
              life: p.life - 0.03
            }))
            .filter(p => p.life > 0)
        )

        setScore(s => s + 1)
        
        const currentScore = scoreRef.current
        if (currentScore > 0 && currentScore % 300 === 0) {
          const newLevel = Math.floor(currentScore / 300) + 1
          if (newLevel !== speedLevel) {
            setSpeedLevel(newLevel)
            speedRef.current = Math.min(BASE_SPEED + (newLevel - 1) * 0.7, 13)
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

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const dinoWidth = isDucking ? 50 : 40
    const dinoHeight = isDucking ? 25 : 45
    const dinoLeft = DINO_X + 5
    const dinoRight = DINO_X + dinoWidth - 5
    const dinoTop = dinoY - dinoHeight + 5
    const dinoBottom = dinoY - 3

    for (const obs of obstacles) {
      const obsWidth = obs.type === 'bird' ? 35 : 25
      const obsHeight = obs.type === 'bird' ? 20 : 35
      const obsLeft = obs.x + 3
      const obsRight = obs.x + obsWidth - 3
      const obsTop = obs.y - obsHeight + 3
      const obsBottom = obs.y - 3

      if (dinoRight > obsLeft && 
          dinoLeft < obsRight && 
          dinoBottom > obsTop && 
          dinoTop < obsBottom) {
        setGameOver(true)
        createParticles(DINO_X + 20, dinoY - dinoHeight / 2, 12)
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

      <div className="dino-layout">
        <aside className="dino-sidebar-left">
          <div className="logo-section">
            <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="3">
              <ellipse cx="50" cy="50" rx="35" ry="20"/>
              <circle cx="70" cy="40" r="12"/>
              <path d="M80 35l15-5M82 40l15-3M80 45l15-2"/>
              <path d="M30 55l-8 15M40 58l-5 18"/>
              <path d="M60 65q5 10 15 10"/>
            </svg>
            <h1 className="logo-title">恐龙快跑</h1>
            <p className="logo-subtitle">DINO RUN</p>
          </div>

          <div className="status-panel">
            <div className="panel-header">
              <span>SYSTEM STATUS</span>
            </div>
            <div className="panel-content">
              <div className="status-row">
                <span className="label">状态</span>
                <span className={`value ${gameOver ? 'danger' : gameStarted ? 'active' : 'ready'}`}>
                  {gameOver ? 'GAME OVER' : gameStarted ? 'RUNNING' : 'READY'}
                </span>
              </div>
              <div className="status-row">
                <span className="label">等级</span>
                <span className="value level">{speedLevel}</span>
              </div>
              <div className="status-row">
                <span className="label">速度</span>
                <span className="value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
              </div>
              <div className="status-row">
                <span className="label">得分</span>
                <span className="value">{score}</span>
              </div>
            </div>
          </div>

          <div className="tips-box">
            <div className="tips-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>游戏技巧</span>
            </div>
            <ul className="tips-list">
              <li>长按跳跃更高</li>
              <li>飞鸟需要蹲下通过</li>
              <li>仙人掌需要跳跃</li>
              <li>提前预判障碍物</li>
            </ul>
          </div>
        </aside>

        <main className="dino-main">
          <div className="top-bar">
            <div className="top-info">
              <span className="info-label">LEVEL</span>
              <span className="info-value">{speedLevel}</span>
            </div>
            <div className="top-divider"></div>
            <div className="top-info">
              <span className="info-label">SPEED</span>
              <span className="info-value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
            </div>
            <div className="top-divider"></div>
            <div className="top-info">
              <span className="info-label">SCORE</span>
              <span className="info-value">{String(score).padStart(6, '0')}</span>
            </div>
          </div>

          <div className="game-container">
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

              {/* 恐龙 - 简约线条风格 */}
              <div 
                className={`dino ${isDucking ? 'ducking' : ''}`}
                style={{ top: dinoY - (isDucking ? 25 : 45) }}
              >
                <svg viewBox="0 0 50 45" fill="none" stroke="#fff" strokeWidth="2">
                  {/* 身体 */}
                  <ellipse cx="25" cy="30" rx="18" ry="12"/>
                  {/* 头部 */}
                  <circle cx="38" cy="20" r="8"/>
                  {/* 嘴巴 */}
                  <path d="M44 18l6-2"/>
                  <path d="M44 20l6 0"/>
                  {/* 眼睛 */}
                  <circle cx="40" cy="18" r="2" fill="#fff"/>
                  {/* 腿 */}
                  <path d="M20 40l-3 5" className="leg-left"/>
                  <path d="M30 40l3 5" className="leg-right"/>
                  {/* 尾巴 */}
                  <path d="M8 32l-8 3"/>
                  {!isDucking && <path d="M25 18l0-8"/>}
                </svg>
              </div>

              {/* 障碍物 */}
              {obstacles.map((obs, index) => (
                <div 
                  key={index}
                  className={`obstacle ${obs.type}`}
                  style={{ 
                    left: obs.x, 
                    top: obs.y - (obs.type === 'bird' ? 20 : 35)
                  }}
                >
                  {obs.type === 'bird' ? (
                    <svg viewBox="0 0 35 20" fill="none" stroke="#fff" strokeWidth="2">
                      <ellipse cx="18" cy="10" rx="12" ry="6"/>
                      <path d="M30 8l5-2"/>
                      <path d="M30 12l5 0"/>
                      <circle cx="32" cy="9" r="1.5" fill="#fff"/>
                      <path d="M10 8q-3-5-8-6" className="wing"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 25 35" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 35l0-25"/>
                      <path d="M12 20l-8-5"/>
                      <path d="M12 25l8-4"/>
                      <path d="M12 15l-6-4"/>
                      <path d="M12 10l6-3"/>
                    </svg>
                  )}
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
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
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
                        <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                          {gameOver ? '再玩一次' : '开始游戏'}
                        </button>
                        <p className="controls-hint">
                          <span className="key-badge">空格</span> 跳跃 · 
                          <span className="key-badge">↓</span> 蹲下 · 
                          <span className="key-badge">P</span> 暂停
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="dino-sidebar-right">
              <div className="stat-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span className="stat-label">得分</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 13l.523-.11a.5.5 0 0 1 .581.374l1.708 6.83a.5.5 0 0 1-.374.581l-.175.043a2 2 0 0 1-2.414-1.442L16.5 18l-1.023.286a2 2 0 0 1-2.414-1.442l-.42-1.686a2 2 0 0 1 1.442-2.414l.392-.098Z"/>
                </svg>
                <span className="stat-label">最佳</span>
                <span className="stat-value highlight">{highScore}</span>
              </div>
              <div className="stat-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span className="stat-label">等级</span>
                <span className="stat-value">{speedLevel}</span>
              </div>
              <div className="stat-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
                </svg>
                <span className="stat-label">速度</span>
                <span className="stat-value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="controls-panel">
            <div className="controls-header">
              <span>操作说明</span>
              <div className="header-line"></div>
            </div>
            <div className="controls-grid">
              <div className="control-item">
                <span className="key-icon">␣</span>
                <span className="key-label">空格</span>
                <span className="key-action">跳跃</span>
              </div>
              <div className="control-item">
                <span className="key-icon">↑</span>
                <span className="key-label">上箭头</span>
                <span className="key-action">跳跃</span>
              </div>
              <div className="control-item">
                <span className="key-icon">↓</span>
                <span className="key-label">下箭头</span>
                <span className="key-action">蹲下</span>
              </div>
              <div className="control-item">
                <span className="key-icon">P</span>
                <span className="key-label">P 键</span>
                <span className="key-action">暂停</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
