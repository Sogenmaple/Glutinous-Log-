import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/Dinosaur.css'

const GRAVITY = 0.6
const JUMP_STRENGTH = -10
const BASE_OBSTACLE_SPEED = 6
const GROUND_Y = 420
const DINO_X = 50

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
  const [particleEffects, setParticleEffects] = useState([])
  const [obstacleSpeed, setObstacleSpeed] = useState(BASE_OBSTACLE_SPEED)
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)

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

  // 创建粒子效果
  const createParticles = useCallback((x, y, color = '#22c55e') => {
    const particles = []
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color
      })
    }
    setParticleEffects(prev => [...prev, ...particles])
  }, [])

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setDinoY(GROUND_Y)
    setDinoVelocity(0)
    setObstacles([{ x: 800, type: 'cactus', width: 30 }])
    setScore(0)
    setIsDucking(false)
    setObstacleSpeed(BASE_OBSTACLE_SPEED)
    setParticleEffects([])
    createParticles(DINO_X + 30, GROUND_Y - 30, '#22c55e')
  }, [createParticles])

  // 跳跃
  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    // 只有在地面或接近地面时才能跳跃
    if (dinoY >= GROUND_Y - 5) {
      setDinoVelocity(JUMP_STRENGTH)
      createParticles(DINO_X + 30, dinoY - 10, 'rgba(255,149,0,0.5)')
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

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = now
        
        // 更新恐龙位置和速度（使用函数式更新确保同步）
        setDinoY(prevY => {
          const newY = prevY + dinoVelocity
          const onGround = newY >= GROUND_Y
          
          // 如果在地面上，速度归零
          if (onGround) {
            setDinoVelocity(0)
            return GROUND_Y
          } else {
            // 在空中时应用重力
            setDinoVelocity(v => v + GRAVITY)
            return newY
          }
        })

        // 更新障碍物速度和生成
        setObstacles(current => {
          let newObstacles = current.map(obs => ({ ...obs, x: obs.x - obstacleSpeed }))
          
          // 移除屏幕外的障碍物
          newObstacles = newObstacles.filter(obs => obs.x > -50)
          
          // 添加新障碍物（难度递增）
          const difficulty = Math.min(score * 0.001, 1)
          const spawnDistance = 500 - difficulty * 150
          
          if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < spawnDistance) {
            const types = ['cactus', 'cactus', 'cactus', 'bird']
            const type = types[Math.floor(Math.random() * types.length)]
            newObstacles.push({ 
              x: 800, 
              type, 
              width: type === 'bird' ? 40 : 30,
              y: type === 'bird' ? GROUND_Y - 50 - Math.random() * 30 : GROUND_Y 
            })
          }
          
          return newObstacles
        })

        // 更新粒子
        setParticleEffects(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.5,
              life: p.life - 0.05
            }))
            .filter(p => p.life > 0)
        )

        // 增加分数
        setScore(s => s + 1)
        
        // 每 100 分提升速度
        if (score > 0 && score % 100 === 0) {
          setObstacleSpeed(prev => Math.min(prev + 0.5, 12))
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
  }, [gameStarted, gameOver, isPaused, dinoVelocity, dinoY, obstacleSpeed, score])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const dinoLeft = DINO_X + 10
    const dinoRight = isDucking ? DINO_X + 50 : DINO_X + 40
    const dinoTop = dinoY - (isDucking ? 30 : 60) + 10
    const dinoBottom = dinoY - 5

    for (const obs of obstacles) {
      const obsLeft = obs.x + 5
      const obsRight = obs.x + obs.width - 5
      const obsTop = obs.type === 'bird' ? obs.y - 30 + 5 : obs.y - 40 + 5
      const obsBottom = obs.y - 5

      if (dinoRight > obsLeft && dinoLeft < obsRight &&
          dinoBottom > obsTop && dinoTop < obsBottom) {
        setGameOver(true)
        createParticles(dinoLeft + 20, dinoTop, '#ef4444')
        return
      }
    }
  }, [dinoY, obstacles, gameStarted, gameOver, isPaused, isDucking, createParticles])

  return (
    <div className="dinosaur-page">
      <Header />
      <div className="dinosaur-container">
        <div className="dinosaur-header">
          <h1 className="dinosaur-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">恐龙快跑</span>
          </h1>
          <p className="dinosaur-subtitle">DINO RUN - 无尽跑酷挑战</p>
        </div>

        <div className="dinosaur-game-area" onClick={jump}>
          <div className="game-canvas">
            {/* 粒子效果 */}
            {particleEffects.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: particle.color,
                  opacity: particle.life,
                  transform: `scale(${particle.life})`
                }}
              />
            ))}

            {/* 恐龙 */}
            <div 
              className={`dino ${isDucking ? 'ducking' : ''}`}
              style={{ top: dinoY - (isDucking ? 30 : 60) }}
            >
              <div className="dino-body"></div>
              <div className="dino-head"></div>
              <div className="dino-eye"></div>
              <div className="dino-mouth"></div>
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
                  <div className="bird-obstacle">
                    <div className="bird-body"></div>
                    <div className="bird-wing"></div>
                    <div className="bird-beak"></div>
                  </div>
                ) : (
                  <div className="cactus-obstacle">
                    <div className="cactus-main"></div>
                    <div className="cactus-arm left"></div>
                    <div className="cactus-arm right"></div>
                  </div>
                )}
              </div>
            ))}

            {/* 地面 */}
            <div className="ground-line"></div>

            {/* 分数 */}
            <div className="score-display">
              HI {String(highScore).padStart(5, '0')}  {String(score).padStart(5, '0')}
            </div>

            {/* 暂停提示 */}
            {isPaused && !gameOver && (
              <div className="game-overlay pause-overlay">
                <div className="overlay-content">
                  <h2>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    游戏暂停
                  </h2>
                  <p className="hint">按 ESC 或 P 继续</p>
                </div>
              </div>
            )}

            {/* 开始/结束界面 */}
            {(!gameStarted || gameOver) && (
              <div className="game-overlay">
                <div className="overlay-content">
                  {gameOver ? (
                    <>
                      <h2>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        游戏结束
                      </h2>
                      <p className="final-score">得分：<strong>{score}</strong></p>
                      <p className="best-score">最佳：<strong>{highScore}</strong></p>
                      {score >= highScore && score > 0 && (
                        <p className="new-record">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V18c0 .55-.47.98-.97 1.21C7.85 19.75 5.97 21 3 21" />
                            <path d="M14 14.66V18c0 .55.47.98.97 1.21C16.15 19.75 18.03 21 21 21" />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                          </svg>
                          新纪录！
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <h2>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                          <path d="M2 22h20" />
                          <path d="M12 2v20" />
                          <path d="M2 12h20" />
                          <circle cx="12" cy="12" r="8" />
                        </svg>
                        恐龙快跑
                      </h2>
                      <p className="hint">准备好开始冒险了吗？</p>
                    </>
                  )}
                  <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                    {gameOver ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        再玩一次
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        开始游戏
                      </>
                    )}
                  </button>
                  <p className="hint">空格/↑跳跃 | ↓蹲下 | P 暂停</p>
                </div>
              </div>
            )}
          </div>

          <div className="dinosaur-sidebar">
            <div className="stat-box">
              <span className="stat-label">当前得分</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">最佳记录</span>
              <span className="stat-value high">{highScore}</span>
            </div>
            {gameStarted && !gameOver && (
              <div className="stat-box speed-indicator">
                <span className="stat-label">速度</span>
                <span className="stat-value speed">{Math.round(obstacleSpeed / BASE_OBSTACLE_SPEED * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="dinosaur-instructions">
          <h3>操作说明</h3>
          <div className="controls-grid">
            <div className="control-item"><span className="key">空格</span> 跳跃</div>
            <div className="control-item"><span className="key">↑</span> 跳跃</div>
            <div className="control-item"><span className="key">↓</span> 蹲下</div>
            <div className="control-item"><span className="key">P</span> 暂停/继续</div>
          </div>
          <div className="tips-section">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                <path d="M9 18h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" />
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26C17.81 13.47 19 11.38 19 9a7 7 0 0 0-7-7z" />
              </svg>
              游戏技巧
            </h4>
            <ul className="tips-list">
              <li>仙人掌需要跳跃，飞行鸟需要蹲下或跳跃</li>
              <li>随着分数提高，速度会越来越快</li>
              <li>提前预判障碍物类型，做好准备</li>
              <li>连续跳跃时机要准确，保持节奏</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
