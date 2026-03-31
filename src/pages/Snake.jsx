import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import LeaderboardSidebar from '../components/LeaderboardSidebar'
import '../styles/Snake.css'

const CELL_SIZE = 20
const COLS = 31
const ROWS = 31
const INITIAL_SPEED = 200
const MIN_SPEED = 50
const SPEED_DECREMENT = 5

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

export default function Snake() {
  const [snake, setSnake] = useState([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 10 })
  const [direction, setDirection] = useState(DIRECTION.RIGHT)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0')
  })
  const [gameState, setGameState] = useState('start')
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const directionRef = useRef(DIRECTION.RIGHT)
  const gameLoopRef = useRef(null)
  const canChangeDirection = useRef(true)
  const canvasRef = useRef(null)

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

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection(DIRECTION.RIGHT)
    directionRef.current = DIRECTION.RIGHT
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setGameState('playing')
    canChangeDirection.current = true
  }, [generateFood])

  const gameOver = useCallback(() => {
    setGameState('gameover')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('snakeHighScore', score.toString())
    }
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current)
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
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !canChangeDirection.current) return

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
      if (newDir) {
        e.preventDefault()
        const current = directionRef.current
        if (newDir.x !== -current.x && newDir.y !== -current.y) {
          directionRef.current = newDir
          setDirection(newDir)
          canChangeDirection.current = false
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  return (
    <div className="manga-snake-page">
      <Header />
      
      {/* 背景装饰 */}
      <div className="manga-halftone"></div>
      <div className="manga-concentration"></div>
      
      <div className="manga-container">
        {/* 报头 */}
        <header className="manga-masthead">
          <div className="manga-masthead-top">
            <span className="manga-issue">VOL.2024.NO.12</span>
            <span className="manga-date">
              {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <div className="manga-main-title">
            <h1 className="manga-title-cn">贪吃蛇</h1>
            <span className="manga-title-en">SNAKE</span>
          </div>
          
          <div className="manga-tagline">
            <span>CLASSIC GAME</span>
            <span className="manga-sep">◆</span>
            <span>RETRO STYLE</span>
            <span className="manga-sep">◆</span>
            <span>INFINITE FUN</span>
          </div>
        </header>

        {/* 游戏主区域 */}
        <div className="manga-snake-main">
          {/* 左侧信息面板 */}
          <aside className="manga-side-panel">
            <div className="manga-panel-header">
              <span>GAME STATUS</span>
            </div>
            <div className="manga-panel-content">
              <div className="manga-stat-row">
                <span className="manga-stat-label">SCORE</span>
                <span className="manga-stat-value">{String(score).padStart(4, '0')}</span>
              </div>
              <div className="manga-stat-row">
                <span className="manga-stat-label">BEST</span>
                <span className="manga-stat-value highlight">{String(highScore).padStart(4, '0')}</span>
              </div>
              <div className="manga-stat-row">
                <span className="manga-stat-label">SPEED</span>
                <span className="manga-stat-value">{Math.round((200 - speed) / 1.2)}%</span>
              </div>
              <div className="manga-stat-row">
                <span className="manga-stat-label">LENGTH</span>
                <span className="manga-stat-value">{snake.length}</span>
              </div>
            </div>
            
            <div className="manga-status-badge-container">
              <span className={`manga-status-badge ${gameState === 'playing' ? 'active' : gameState === 'gameover' ? 'danger' : 'ready'}`}>
                {gameState === 'playing' ? 'PLAYING' : gameState === 'gameover' ? 'GAME OVER' : 'READY'}
              </span>
            </div>
          </aside>

          {/* 游戏画布 */}
          <div className="manga-game-section">
            <div className="manga-game-container" ref={canvasRef}>
              <div className="manga-game-board">
                <div className="manga-bg-grid"></div>
                
                {snake.map((segment, index) => (
                  <div
                    key={index}
                    className={`manga-snake-segment ${index === 0 ? 'head' : 'body'}`}
                    style={{
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2
                    }}
                  />
                ))}

                <div
                  className="manga-food"
                  style={{
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2
                  }}
                />

                {gameState === 'start' && (
                  <div className="manga-overlay">
                    <div className="manga-overlay-content">
                      <div className="manga-icon-box">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="28" width="14" height="14" fill="#1a1a1a" rx="2"/>
                          <rect x="25" y="28" width="14" height="14" fill="#1a1a1a" rx="2"/>
                          <rect x="42" y="28" width="14" height="14" fill="#1a1a1a" rx="2"/>
                          <circle cx="49" cy="35" r="6" fill="#1a1a1a"/>
                        </svg>
                      </div>
                      <h2 className="manga-overlay-title">贪吃蛇</h2>
                      <span className="manga-overlay-subtitle">CLASSIC SNAKE GAME</span>
                      <button className="manga-start-btn" onClick={resetGame}>START GAME</button>
                      <p className="manga-controls-hint">
                        <span className="manga-key-badge">WASD</span> 或 <span className="manga-key-badge">方向键</span> 控制方向
                      </p>
                    </div>
                  </div>
                )}

                {gameState === 'gameover' && (
                  <div className="manga-overlay">
                    <div className="manga-overlay-content">
                      <div className="manga-icon-box">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <circle cx="32" cy="32" r="28" stroke="#1a1a1a" strokeWidth="3"/>
                          <line x1="42" y1="22" x2="22" y2="42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
                          <line x1="22" y1="22" x2="42" y2="42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <h2 className="manga-overlay-title">GAME OVER</h2>
                      <div className="manga-score-board">
                        <div className="manga-score-item">
                          <span className="manga-score-label">SCORE</span>
                          <span className="manga-score-value">{score}</span>
                        </div>
                        <div className="manga-score-item">
                          <span className="manga-score-label">BEST</span>
                          <span className="manga-score-value highlight">{highScore}</span>
                        </div>
                        <div className="manga-score-item">
                          <span className="manga-score-label">LENGTH</span>
                          <span className="manga-score-value">{snake.length}</span>
                        </div>
                      </div>
                      {score >= highScore && score > 0 && (
                        <div className="manga-new-record">
                          <span>🏆 NEW RECORD!</span>
                        </div>
                      )}
                      <div className="manga-button-group">
                        <button className="manga-start-btn" onClick={resetGame}>PLAY AGAIN</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧排行榜 */}
          <aside className="manga-side-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <LeaderboardSidebar gameId="snake" gameName="贪吃蛇" />
          </aside>
        </div>

        {/* 底部 */}
        <footer className="manga-footer">
          <div className="manga-footer-content">
            <div className="manga-footer-line">
              <span>EST.2024</span>
              <span className="manga-sep">◆</span>
              <span>MADE WITH ♥ BY TANGYUAN</span>
              <span className="manga-sep">◆</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
            <div className="manga-icp">
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noopener noreferrer"
              >
                鄂 ICP 备 2026010257 号
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
