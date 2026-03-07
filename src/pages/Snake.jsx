import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Snake.css'

const COLS = 20
const ROWS = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 200
const MIN_SPEED = 80
const SPEED_DECREMENT = 8

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

export default function Snake() {
  const [gameState, setGameState] = useState('start') // start, playing, paused, gameover
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 10 })
  const [direction, setDirection] = useState(DIRECTION.RIGHT)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved) : 0
  })
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [particles, setParticles] = useState([])
  
  const gameLoopRef = useRef(null)
  const directionRef = useRef(direction)
  const canChangeDirection = useRef(true)

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const generateFood = useCallback((currentSnake) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const createParticles = (x, y, color) => {
    const newParticles = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      newParticles.push({
        id: Date.now() + i,
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1,
        color
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection(DIRECTION.RIGHT)
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setParticles([])
    setGameState('playing')
  }

  const gameOver = useCallback(() => {
    setGameState('gameover')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('snakeHighScore', score.toString())
    }
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
  }, [score, highScore])

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0]
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      }

      // 撞墙检测
      if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
        gameOver()
        return prevSnake
      }

      // 撞自己检测
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver()
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      // 吃食物检测
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10
          // 难度递增：每 50 分加速一次
          if (newScore % 50 === 0) {
            setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_DECREMENT))
          }
          return newScore
        })
        createParticles(food.x, food.y, '#f59e0b')
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      canChangeDirection.current = true
      return newSnake
    })
  }, [food, gameOver, generateFood])

  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    gameLoopRef.current = setInterval(moveSnake, speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState, speed, moveSnake])

  // 粒子动画
  useEffect(() => {
    if (particles.length === 0) return

    const particleInterval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - 0.05
          }))
          .filter(p => p.life > 0)
      )
    }, 30)

    return () => clearInterval(particleInterval)
  }, [particles])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        if (gameState === 'playing') {
          setGameState('paused')
        } else if (gameState === 'paused') {
          setGameState('playing')
        }
        return
      }

      if (gameState !== 'playing' || !canChangeDirection.current) return

      const currentDir = directionRef.current
      let newDirection = null

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== DIRECTION.DOWN) newDirection = DIRECTION.UP
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== DIRECTION.UP) newDirection = DIRECTION.DOWN
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== DIRECTION.RIGHT) newDirection = DIRECTION.LEFT
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== DIRECTION.LEFT) newDirection = DIRECTION.RIGHT
          break
        default:
          return
      }

      if (newDirection) {
        setDirection(newDirection)
        canChangeDirection.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  return (
    <>
      <Header />
      <main className="snake-page-main">
        <div className="snake-game-container">
          <div className="snake-game-wrapper">
            {/* 游戏头部 */}
            <div className="game-header">
              <div className="game-title">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <path d="M2 12h20" />
                  <path d="M12 2v20" />
                  <path d="M4.93 4.93l14.14 14.14" />
                  <path d="M19.07 4.93L4.93 19.07" />
                </svg>
                <span>贪吃蛇</span>
              </div>
              <div className="game-stats">
                <div className="stat">
                  <span className="stat-label">得分</span>
                  <span className="stat-value">{score}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">最佳</span>
                  <span className="stat-value">{highScore}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">速度</span>
                  <span className="stat-value">{Math.round((INITIAL_SPEED - speed + MIN_SPEED) / 10)}级</span>
                </div>
              </div>
            </div>

            {/* 游戏画布 */}
            <div className="snake-canvas-wrapper">
              <div 
                className="snake-canvas"
                style={{ 
                  width: COLS * CELL_SIZE, 
                  height: ROWS * CELL_SIZE 
                }}
              >
                {/* 网格背景 */}
                <div className="snake-grid">
                  {Array.from({ length: COLS * ROWS }).map((_, i) => (
                    <div key={i} className="grid-cell" />
                  ))}
                </div>

                {/* 蛇 */}
                {snake.map((segment, index) => (
                  <div
                    key={index}
                    className={`snake-segment ${index === 0 ? 'head' : ''}`}
                    style={{
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      width: CELL_SIZE - 1,
                      height: CELL_SIZE - 1,
                      opacity: 1 - (index / snake.length) * 0.4
                    }}
                  />
                ))}

                {/* 食物 */}
                <div
                  className="snake-food"
                  style={{
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE - 1,
                    height: CELL_SIZE - 1
                  }}
                />

                {/* 粒子效果 */}
                {particles.map(particle => (
                  <div
                    key={particle.id}
                    className="particle"
                    style={{
                      left: particle.x,
                      top: particle.y,
                      opacity: particle.life,
                      backgroundColor: particle.color,
                      transform: `scale(${particle.life})`
                    }}
                  />
                ))}

                {/* 开始界面 */}
                {gameState === 'start' && (
                  <div className="game-overlay start-overlay">
                    <div className="overlay-content">
                      <h2>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                          <path d="M2 22h20" />
                          <path d="M12 2v20" />
                          <path d="M4.93 4.93l14.14 14.14" />
                          <path d="M19.07 4.93L4.93 19.07" />
                        </svg>
                        贪吃蛇
                      </h2>
                      <p className="hint">准备好开始挑战了吗？</p>
                      <button className="start-btn" onClick={resetGame}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        开始游戏
                      </button>
                    </div>
                  </div>
                )}

                {/* 暂停界面 */}
                {gameState === 'paused' && (
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

                {/* 游戏结束界面 */}
                {gameState === 'gameover' && (
                  <div className="game-overlay gameover-overlay">
                    <div className="overlay-content">
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
                      <button className="start-btn" onClick={resetGame}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        再玩一次
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 控制说明 */}
            <div className="game-controls">
              <div className="control-item">
                <kbd>↑↓←→</kbd>
                <span>或</span>
                <kbd>WASD</kbd>
                <span>移动方向</span>
              </div>
              <div className="control-item">
                <kbd>P</kbd>
                <span>或</span>
                <kbd>ESC</kbd>
                <span>暂停游戏</span>
              </div>
            </div>

            {/* 游戏技巧 */}
            <div className="tips-section">
              <h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                  <path d="M9 18h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" />
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26C17.81 13.47 19 11.38 19 9a7 7 0 0 0-7-7z" />
                </svg>
                游戏技巧
              </h4>
              <ul className="tips-list">
                <li>提前规划路线，避免进入死胡同</li>
                <li>利用边缘空间，保持移动灵活性</li>
                <li>蛇身变长后，注意不要追尾</li>
                <li>每吃 5 个食物速度会提升，做好准备</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
