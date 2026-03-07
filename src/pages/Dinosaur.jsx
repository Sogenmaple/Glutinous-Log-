import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import { DinosaurIcon, ClockIcon } from '../components/icons/SiteIcons'
import '../styles/Dinosaur.css'

const GRAVITY = 0.6
const JUMP_STRENGTH = -12
const BASE_SPEED = 5
const GROUND_Y = 400
const DINO_X = 80

export default function Dinosaur() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [dinoY, setDinoY] = useState(GROUND_Y)
  const [dinoVelocity, setDinoVelocity] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isDucking, setIsDucking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [particles, setParticles] = useState([])
  const [speed, setSpeed] = useState(BASE_SPEED)
  const [level, setLevel] = useState(1)
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)
  const scoreRef = useRef(0)

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

  // 保持 scoreRef 同步
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
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color,
        size: Math.random() * 4 + 2
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
    setDinoVelocity(0)
    setObstacles([{ x: 900, type: Math.random() > 0.7 ? 'bird' : 'cactus', width: 30 }])
    setScore(0)
    setIsDucking(false)
    setSpeed(BASE_SPEED)
    setLevel(1)
    setParticles([])
    lastTimeRef.current = Date.now()
    createParticles(DINO_X + 30, GROUND_Y - 30, '#ff9500', 15)
  }, [createParticles])

  // 跳跃
  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    if (dinoY >= GROUND_Y - 10) {
      setDinoVelocity(JUMP_STRENGTH)
      createParticles(DINO_X + 30, dinoY, 'rgba(255,149,0,0.6)', 8)
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

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp
        
        // 更新恐龙
        setDinoY(prevY => {
          const newY = prevY + dinoVelocity
          if (newY >= GROUND_Y) {
            setDinoVelocity(0)
            return GROUND_Y
          }
          setDinoVelocity(v => v + GRAVITY)
          return newY
        })

        // 更新障碍物
        setObstacles(current => {
          let newObstacles = current.map(obs => ({ ...obs, x: obs.x - speed }))
          newObstacles = newObstacles.filter(obs => obs.x > -50)
          
          const lastObs = newObstacles[newObstacles.length - 1]
          const minGap = 400 - speed * 20
          
          if (!lastObs || lastObs.x < 900 - minGap) {
            const type = Math.random() > 0.7 ? 'bird' : 'cactus'
            newObstacles.push({ 
              x: 950, 
              type, 
              width: type === 'bird' ? 40 : 30,
              y: type === 'bird' ? GROUND_Y - 40 - Math.floor(Math.random() * 30) : GROUND_Y
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
              vy: p.vy + 0.3,
              life: p.life - 0.03
            }))
            .filter(p => p.life > 0)
        )

        // 增加分数
        setScore(s => s + 1)
        
        // 难度提升
        const newLevel = Math.floor(scoreRef.current / 500) + 1
        if (newLevel > level) {
          setLevel(newLevel)
          setSpeed(s => Math.min(s + 1, 15))
        }
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused, dinoVelocity, speed, level])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const dinoWidth = isDucking ? 50 : 40
    const dinoHeight = isDucking ? 30 : 60
    const dinoLeft = DINO_X + 5
    const dinoRight = DINO_X + dinoWidth - 5
    const dinoTop = dinoY - dinoHeight + 5
    const dinoBottom = dinoY - 5

    for (const obs of obstacles) {
      const obsHeight = obs.type === 'bird' ? 30 : 40
      const obsLeft = obs.x + 5
      const obsRight = obs.x + obs.width - 5
      const obsTop = obs.y - obsHeight + 5
      const obsBottom = obs.y - 5

      if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom) {
        setGameOver(true)
        createParticles(DINO_X + 30, dinoY - 30, '#ef4444', 20)
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
            <DinosaurIcon size={100} color="#ff9500" />
            <h1 className="logo-title">恐龙快跑</h1>
            <p className="logo-subtitle">DINO RUN</p>
          </div>

          <div className="status-panel">
            <div className="panel-header">
              <span>STATUS</span>
            </div>
            <div className="panel-content">
              <div className="status-row">
                <span className="label">状态</span>
                <span className={`value ${gameOver ? 'danger' : gameStarted ? 'active' : ''}`}>
                  {gameOver ? 'GAME OVER' : gameStarted ? 'RUNNING' : 'READY'}
                </span>
              </div>
              <div className="status-row">
                <span className="label">等级</span>
                <span className="value">{level}</span>
              </div>
              <div className="status-row">
                <span className="label">速度</span>
                <span className="value">{Math.round(speed / BASE_SPEED * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="clock-section">
            <ClockIcon size={40} color="#ff9500" />
            <div className="time-display">
              <span className="time">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </aside>

        {/* 中央游戏区 */}
        <main className="dino-main">
          <div className="game-area">
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
                style={{ top: dinoY - (isDucking ? 30 : 60) }}
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
                  style={{ left: obs.x, top: obs.type === 'bird' ? obs.y - 30 : obs.y - 40 }}
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

              {/* 分数显示 */}
              <div className="hud-score">
                <span className="hud-label">SCORE</span>
                <span className="hud-value">{String(score).padStart(6, '0')}</span>
              </div>

              {/* 暂停遮罩 */}
              {isPaused && !gameOver && (
                <div className="overlay pause">
                  <div className="overlay-content">
                    <h2>⏸ 游戏暂停</h2>
                    <p>按 P 或 ESC 继续</p>
                  </div>
                </div>
              )}

              {/* 开始/结束遮罩 */}
              {(!gameStarted || gameOver) && (
                <div className="overlay">
                  <div className="overlay-content">
                    {gameOver ? (
                      <>
                        <div className="game-over-icon">✖</div>
                        <h2>游戏结束</h2>
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
                          <div className="new-record">🏆 新纪录!</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="start-icon">▶</div>
                        <h2>恐龙快跑</h2>
                        <p className="subtitle">无尽跑酷挑战</p>
                      </>
                    )}
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                      {gameOver ? '再玩一次' : '开始游戏'}
                    </button>
                    <p className="controls-hint">空格/↑跳跃 | ↓蹲下 | P 暂停</p>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧状态栏 */}
            <div className="dino-sidebar-right">
              <div className="stat-card">
                <span className="stat-label">当前得分</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">最佳记录</span>
                <span className="stat-value highlight">{highScore}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">游戏等级</span>
                <span className="stat-value">{level}</span>
              </div>
            </div>
          </div>

          {/* 操作说明 */}
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
