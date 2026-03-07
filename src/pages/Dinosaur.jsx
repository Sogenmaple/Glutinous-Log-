import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import { DinosaurIcon, ClockIcon } from '../components/icons/SiteIcons'
import '../styles/Dinosaur.css'

const GRAVITY = 0.6
const JUMP_STRENGTH = -11
const BASE_SPEED = 6
const GROUND_Y = 350
const DINO_X = 60
const DINO_WIDTH = 44
const DINO_HEIGHT = 50
const DINO_DUCK_HEIGHT = 28

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
  
  // 使用 refs 避免闭包问题
  const dinoVelocityRef = useRef(0)
  const speedRef = useRef(BASE_SPEED)
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)
  const scoreRef = useRef(0)
  const obstaclesRef = useRef([])

  // 加载最佳记录
  useEffect(() => {
    const saved = localStorage.getItem('dinosaur_highscore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // 保存最佳记录
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('dinosaur_highscore', String(score))
    }
  }, [score, highScore])

  // 同步 scoreRef
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  // 创建粒子效果
  const createParticles = useCallback((x, y, color, count = 10) => {
    const newParticles = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color,
        size: Math.random() * 3 + 2
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setDinoY(GROUND_Y)
    dinoVelocityRef.current = 0
    const firstObstacle = { 
      x: 800, 
      type: 'cactus', 
      width: 28,
      height: 40,
      y: GROUND_Y
    }
    setObstacles([firstObstacle])
    obstaclesRef.current = [firstObstacle]
    setScore(0)
    setIsDucking(false)
    speedRef.current = BASE_SPEED
    setSpeedLevel(1)
    setParticles([])
    lastTimeRef.current = performance.now()
    createParticles(DINO_X + 22, GROUND_Y - 25, '#ff9500', 12)
  }, [createParticles])

  // 跳跃
  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    // 检查是否在地面
    if (dinoY >= GROUND_Y - 5) {
      dinoVelocityRef.current = JUMP_STRENGTH
      createParticles(DINO_X + 22, dinoY - 10, 'rgba(255,149,0,0.6)', 6)
    }
  }, [gameStarted, gameOver, isPaused, dinoY, startGame, createParticles])

  // 蹲下
  const duck = useCallback((ducking) => {
    if (gameStarted && !gameOver && !isPaused) {
      setIsDucking(ducking)
    }
  }, [gameStarted, gameOver, isPaused])

  // 暂停/继续
  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [gameStarted, gameOver])

  // 键盘控制
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

  // 游戏循环 - 稳定版本
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const update = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp
        
        // 更新恐龙位置
        setDinoY(prevY => {
          const newY = prevY + dinoVelocityRef.current
          if (newY >= GROUND_Y) {
            dinoVelocityRef.current = 0
            return GROUND_Y
          }
          dinoVelocityRef.current += GRAVITY
          return newY
        })

        // 更新障碍物 - 固定 Y 位置，只移动 X
        setObstacles(prev => {
          let newObstacles = prev.map(obs => ({ 
            ...obs, 
            x: obs.x - speedRef.current,
            y: obs.y // Y 位置固定不变
          }))
          newObstacles = newObstacles.filter(obs => obs.x > -50)
          
          const lastObs = newObstacles[newObstacles.length - 1]
          const minGap = 350 + speedRef.current * 15
          
          if (!lastObs || lastObs.x < 800 - minGap) {
            const type = Math.random() > 0.6 ? 'cactus' : 'bird'
            const newObs = {
              x: 850,
              type,
              width: type === 'bird' ? 36 : 28,
              height: type === 'bird' ? 26 : 40,
              y: type === 'bird' ? GROUND_Y - 50 : GROUND_Y // 鸟固定高度，仙人掌在地面
            }
            newObstacles.push(newObs)
            obstaclesRef.current = newObstacles
          } else {
            obstaclesRef.current = newObstacles
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
              life: p.life - 0.025
            }))
            .filter(p => p.life > 0)
        )

        // 增加分数
        setScore(s => s + 1)
        
        // 难度提升 - 每 300 分加速
        const currentScore = scoreRef.current
        if (currentScore > 0 && currentScore % 300 === 0) {
          const newLevel = Math.floor(currentScore / 300) + 1
          if (newLevel !== speedLevel) {
            setSpeedLevel(newLevel)
            speedRef.current = Math.min(BASE_SPEED + (newLevel - 1) * 0.8, 14)
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

  // 碰撞检测 - 精确版本
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const currentHeight = isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT
    const dinoLeft = DINO_X + 8
    const dinoRight = DINO_X + DINO_WIDTH - 8
    const dinoTop = dinoY - currentHeight + 8
    const dinoBottom = dinoY - 5

    for (const obs of obstacles) {
      const obsLeft = obs.x + 4
      const obsRight = obs.x + obs.width - 4
      const obsTop = obs.y - obs.height + 4
      const obsBottom = obs.y - 5

      // 精确碰撞检测
      if (dinoRight > obsLeft && 
          dinoLeft < obsRight && 
          dinoBottom > obsTop && 
          dinoTop < obsBottom) {
        setGameOver(true)
        createParticles(DINO_X + 22, dinoY - currentHeight / 2, '#ef4444', 16)
        return
      }
    }
  }, [dinoY, obstacles, gameStarted, gameOver, isPaused, isDucking, createParticles])

  return (
    <div className="dinosaur-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="dino-layout">
        {/* 左侧信息栏 */}
        <aside className="dino-sidebar-left">
          <div className="logo-section">
            <DinosaurIcon size={80} color="#ff9500" />
            <h1 className="logo-title">恐龙快跑</h1>
            <p className="logo-subtitle">DINO RUN</p>
          </div>

          <div className="status-panel">
            <div className="panel-header amber">
              <span>SYSTEM STATUS</span>
            </div>
            <div className="panel-content">
              <div className="status-row">
                <span className="label">运行状态</span>
                <span className={`value ${gameOver ? 'danger' : gameStarted ? 'active' : 'ready'}`}>
                  {gameOver ? 'GAME OVER' : gameStarted ? 'RUNNING' : 'READY'}
                </span>
              </div>
              <div className="status-row">
                <span className="label">当前等级</span>
                <span className="value level">{speedLevel}</span>
              </div>
              <div className="status-row">
                <span className="label">移动速度</span>
                <span className="value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
              </div>
              <div className="status-row">
                <span className="label">实时得分</span>
                <span className="value">{score}</span>
              </div>
            </div>
            <div className="panel-footer">
              <span>TAPE FUTURISM v2.0</span>
            </div>
          </div>

          <div className="clock-section">
            <ClockIcon size={36} color="#ff9500" />
            <div className="time-display">
              <span className="time">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* 技巧提示框 */}
          <div className="tips-box">
            <div className="tips-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                <path d="M9 18h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z"/>
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26C17.81 13.47 19 11.38 19 9a7 7 0 0 0-7-7z"/>
              </svg>
              <span>游戏技巧</span>
            </div>
            <ul className="tips-list">
              <li>仙人掌需要跳跃躲避</li>
              <li>飞行鸟可以蹲下通过</li>
              <li>分数越高速速度越快</li>
              <li>保持节奏提前预判</li>
            </ul>
          </div>
        </aside>

        {/* 中央游戏区 */}
        <main className="dino-main">
          {/* 顶部信息条 */}
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

          <div className="game-wrapper">
            <div className="game-canvas" onClick={jump}>
              {/* 背景装饰线 */}
              <div className="bg-lines"></div>
              
              {/* 粒子效果 */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="particle"
                  style={{
                    left: p.x,
                    top: p.y,
                    backgroundColor: p.color,
                    opacity: p.life,
                    transform: `scale(${p.life})`,
                    width: p.size,
                    height: p.size
                  }}
                />
              ))}

              {/* 恐龙 */}
              <div 
                className={`dino ${isDucking ? 'ducking' : ''}`}
                style={{ top: dinoY - (isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT) }}
              >
                <div className="dino-body">
                  <div className="dino-segment"></div>
                  <div className="dino-segment"></div>
                  <div className="dino-segment"></div>
                </div>
                <div className="dino-head">
                  <div className="dino-eye"></div>
                  <div className="dino-mouth"></div>
                </div>
                <div className="dino-legs">
                  <div className="leg left"></div>
                  <div className="leg right"></div>
                </div>
                <div className="dino-tail"></div>
              </div>

              {/* 障碍物 */}
              {obstacles.map((obs, index) => (
                <div 
                  key={index}
                  className={`obstacle ${obs.type}`}
                  style={{ 
                    left: obs.x, 
                    top: obs.y - obs.height,
                    width: obs.width,
                    height: obs.height
                  }}
                >
                  {obs.type === 'bird' ? (
                    <div className="bird">
                      <div className="bird-body"></div>
                      <div className="bird-wing"></div>
                      <div className="bird-beak"></div>
                    </div>
                  ) : (
                    <div className="cactus">
                      <div className="cactus-main"></div>
                      <div className="cactus-arm left"></div>
                      <div className="cactus-arm right"></div>
                    </div>
                  )}
                </div>
              ))}

              {/* 地面 */}
              <div className="ground">
                <div className="ground-line"></div>
                <div className="ground-pattern"></div>
              </div>

              {/* 暂停遮罩 */}
              {isPaused && !gameOver && (
                <div className="overlay pause">
                  <div className="overlay-content">
                    <div className="pause-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    </div>
                    <h2>游戏暂停</h2>
                    <p className="hint">按 P 或 ESC 继续游戏</p>
                  </div>
                </div>
              )}

              {/* 开始/结束遮罩 */}
              {(!gameStarted || gameOver) && (
                <div className="overlay">
                  <div className="overlay-content">
                    {gameOver ? (
                      <>
                        <div className="result-icon gameover">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                        </div>
                        <h2 className="result-title">游戏结束</h2>
                        <div className="score-board">
                          <div className="score-item">
                            <span className="label">本局得分</span>
                            <span className="value">{score}</span>
                          </div>
                          <div className="score-item">
                            <span className="label">最佳记录</span>
                            <span className="value highlight">{highScore}</span>
                          </div>
                        </div>
                        {score >= highScore && score > 0 && (
                          <div className="new-record">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                              <path d="M4 22h16"/>
                              <path d="M10 14.66V18c0 .55-.47.98-.97 1.21C7.85 19.75 5.97 21 3 21"/>
                              <path d="M14 14.66V18c0 .55.47.98.97 1.21C16.15 19.75 18.03 21 21 21"/>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                            </svg>
                            <span>新纪录诞生!</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="result-icon start">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="#ff9500">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </div>
                        <h2 className="result-title">恐龙快跑</h2>
                        <p className="subtitle">无尽跑酷挑战 · 磁带未来风</p>
                        <div className="feature-list">
                          <span className="feature-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 6v6l4 2"/>
                            </svg>
                            粒子效果
                          </span>
                          <span className="feature-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                              <path d="M23 6l-9.5 9.5-5-5L1 18"/>
                              <path d="M17 6h6v6"/>
                            </svg>
                            难度递增
                          </span>
                          <span className="feature-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                              <path d="M4 22h16"/>
                              <path d="M10 14.66V18c0 .55-.47.98-.97 1.21C7.85 19.75 5.97 21 3 21"/>
                              <path d="M14 14.66V18c0 .55.47.98.97 1.21C16.15 19.75 18.03 21 21 21"/>
                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                            </svg>
                            最佳记录
                          </span>
                        </div>
                      </>
                    )}
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                      {gameOver ? '再玩一次' : '开始游戏'}
                    </button>
                    <p className="controls-hint">
                      <span className="key-badge">空格</span> 跳跃 · 
                      <span className="key-badge">↓</span> 蹲下 · 
                      <span className="key-badge">P</span> 暂停
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧状态栏 */}
            <div className="dino-sidebar-right">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <span className="stat-label">当前得分</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d2" strokeWidth="2">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89 17 13l.523-.11a.5.5 0 0 1 .581.374l1.708 6.83a.5.5 0 0 1-.374.581l-.175.043a2 2 0 0 1-2.414-1.442L16.5 18l-1.023.286a2 2 0 0 1-2.414-1.442l-.42-1.686a2 2 0 0 1 1.442-2.414l.392-.098Z"/>
                  </svg>
                </div>
                <span className="stat-label">最佳记录</span>
                <span className="stat-value highlight">{highScore}</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span className="stat-label">游戏等级</span>
                <span className="stat-value">{speedLevel}</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
                  </svg>
                </div>
                <span className="stat-label">移动速度</span>
                <span className="stat-value">{Math.round(speedRef.current / BASE_SPEED * 100)}%</span>
              </div>
            </div>
          </div>

          {/* 操作说明面板 */}
          <div className="controls-panel">
            <div className="controls-header">
              <span>操作说明</span>
              <div className="header-line"></div>
            </div>
            <div className="controls-grid">
              <div className="control-item">
                <span className="key-icon">␣</span>
                <span className="key-label">空格键</span>
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
