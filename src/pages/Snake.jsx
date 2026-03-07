import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import '../styles/Snake.css'

const COLS = 20
const ROWS = 20
const CELL_SIZE = 22
const INITIAL_SPEED = 180
const MIN_SPEED = 80
const SPEED_DECREMENT = 6

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

export default function Snake() {
  const [gameState, setGameState] = useState('start')
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 10 })
  const [direction, setDirection] = useState(DIRECTION.RIGHT)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved) : 0
  })
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  
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

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection(DIRECTION.RIGHT)
    directionRef.current = DIRECTION.RIGHT
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setGameState('playing')
    canChangeDirection.current = true
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

      if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
        gameOver()
        return prevSnake
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver()
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10)
        setFood(generateFood(newSnake))
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT))
      } else {
        newSnake.pop()
      }

      canChangeDirection.current = true
      return newSnake
    })
  }, [food, generateFood, gameOver])

  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      moveSnake()
      gameLoopRef.current = setTimeout(gameLoop, speed)
    }
    
    gameLoopRef.current = setTimeout(gameLoop, speed)
    
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [gameState, speed, moveSnake])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: DIRECTION.UP,
        ArrowDown: DIRECTION.DOWN,
        ArrowLeft: DIRECTION.LEFT,
        ArrowRight: DIRECTION.RIGHT,
        KeyW: DIRECTION.UP,
        KeyS: DIRECTION.DOWN,
        KeyA: DIRECTION.LEFT,
        KeyD: DIRECTION.RIGHT
      }

      const newDir = keyMap[e.code]
      if (!newDir) return

      e.preventDefault()
      
      if (!canChangeDirection.current) return
      
      const current = directionRef.current
      if (newDir.x !== -current.x && newDir.y !== -current.y) {
        setDirection(newDir)
        canChangeDirection.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="snake-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="snake-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>贪吃蛇</h1>
            <p className="subtitle">SNAKE · TAPE FUTURISM</p>
          </div>
          <div className="header-status">
            <span className={`status-badge ${gameState === 'playing' ? 'active' : gameState === 'gameover' ? 'danger' : 'ready'}`}>
              {gameState === 'playing' ? 'PLAYING' : gameState === 'gameover' ? 'GAME OVER' : 'READY'}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="newspaper-content">
          {/* 左侧边栏 */}
          <aside className="news-sidebar-left">
            <div className="score-box">
              <span className="score-label">SCORE</span>
              <span className="score-value">{String(score).padStart(4, '0')}</span>
            </div>
            <div className="score-box">
              <span className="score-label">BEST</span>
              <span className="score-value highlight">{String(highScore).padStart(4, '0')}</span>
            </div>
            <div className="info-box">
              <span className="info-label">SPEED</span>
              <span className="info-value">{Math.round((200 - speed) / 1.2)}%</span>
            </div>
            <div className="info-box">
              <span className="info-label">LENGTH</span>
              <span className="info-value">{snake.length}</span>
            </div>
            
            {/* 操作说明 */}
            <div className="controls-mini">
              <div className="controls-mini-header">
                <span>CONTROLS</span>
              </div>
              <div className="controls-mini-grid">
                <div className="control-mini">
                  <span className="mini-key">W</span>
                  <span className="mini-label">上</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">S</span>
                  <span className="mini-label">下</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">A</span>
                  <span className="mini-label">左</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">D</span>
                  <span className="mini-label">右</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area">
            <div className="game-canvas snake-canvas">
              {/* 背景网格 */}
              <div className="bg-grid"></div>
              
              {/* 蛇身 */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`snake-segment ${index === 0 ? 'head' : 'body'}`}
                  style={{
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2
                  }}
                />
              ))}

              {/* 食物 */}
              <div
                className="food"
                style={{
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2
                }}
              />

              {/* 开始界面 */}
              {gameState === 'start' && (
                <div className="overlay">
                  <div className="overlay-content">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <rect x="10" y="25" width="12" height="12" fill="#4ade80" rx="2"/>
                      <rect x="24" y="25" width="12" height="12" fill="#4ade80" rx="2"/>
                      <rect x="38" y="25" width="12" height="12" fill="#4ade80" rx="2"/>
                      <circle cx="45" cy="31" r="5" fill="#f87171"/>
                    </svg>
                    <h2>贪吃蛇</h2>
                    <p className="subtitle">经典休闲游戏</p>
                    <button className="start-btn" onClick={resetGame}>开始游戏</button>
                    <p className="controls-hint">
                      <span className="key-badge">WASD</span> 移动 · 
                      <span className="key-badge">方向键</span> 移动
                    </p>
                  </div>
                </div>
              )}

              {/* 游戏结束界面 */}
              {gameState === 'gameover' && (
                <div className="overlay">
                  <div className="overlay-content">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
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
                      <div className="score-item">
                        <span className="label">长度</span>
                        <span className="value">{snake.length}</span>
                      </div>
                    </div>
                    {score >= highScore && score > 0 && (
                      <div className="new-record">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
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
                    <button className="start-btn" onClick={resetGame}>再玩一次</button>
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
          <span>SNAKE © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>CLASSIC CASUAL</span>
        </div>
      </div>
    </div>
  )
}
