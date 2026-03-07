import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import '../styles/Pacman.css'

const COLS = 19
const ROWS = 21
const CELL_SIZE = 24

// 地图：0=空地，1=墙，2=豆子，3=能量豆
const INITIAL_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
  [0,2,2,2,2,0,0,1,0,0,0,1,0,0,2,2,2,2,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 }
}

const GHOST_COLORS = ['#ef4444', '#f97316', '#06b6d4', '#ec4899']

export default function Pacman() {
  const [gameState, setGameState] = useState('start')
  const [map, setMap] = useState([])
  const [pacman, setPacman] = useState({ x: 9, y: 15, direction: DIRECTION.RIGHT, nextDirection: DIRECTION.RIGHT })
  const [ghosts, setGhosts] = useState([
    { x: 9, y: 8, color: GHOST_COLORS[0], direction: DIRECTION.UP, scared: false },
    { x: 8, y: 10, color: GHOST_COLORS[1], direction: DIRECTION.UP, scared: false },
    { x: 10, y: 10, color: GHOST_COLORS[2], direction: DIRECTION.UP, scared: false },
    { x: 9, y: 10, color: GHOST_COLORS[3], direction: DIRECTION.UP, scared: false }
  ])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pacmanHighScore')
    return saved ? parseInt(saved) : 0
  })
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [powerMode, setPowerMode] = useState(false)
  const [powerTimer, setPowerTimer] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(true)
  
  const gameLoopRef = useRef(null)
  const ghostLoopRef = useRef(null)
  const canChangeDirection = useRef(true)

  const initMap = useCallback(() => {
    return INITIAL_MAP.map(row => [...row])
  }, [])

  const resetGame = () => {
    setMap(initMap())
    setPacman({ x: 9, y: 15, direction: DIRECTION.RIGHT, nextDirection: DIRECTION.RIGHT })
    setGhosts([
      { x: 9, y: 8, color: GHOST_COLORS[0], direction: DIRECTION.UP, scared: false },
      { x: 8, y: 10, color: GHOST_COLORS[1], direction: DIRECTION.UP, scared: false },
      { x: 10, y: 10, color: GHOST_COLORS[2], direction: DIRECTION.UP, scared: false },
      { x: 9, y: 10, color: GHOST_COLORS[3], direction: DIRECTION.UP, scared: false }
    ])
    setScore(0)
    setLives(3)
    setLevel(1)
    setPowerMode(false)
    setPowerTimer(0)
  }

  const startGame = () => {
    resetGame()
    setGameState('playing')
  }

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') {
      if (e.code === 'Space' || e.code === 'Enter') {
        startGame()
      }
      return
    }
    
    let newDir = null
    if (e.key === 'ArrowUp' || e.key === 'w') newDir = DIRECTION.UP
    if (e.key === 'ArrowDown' || e.key === 's') newDir = DIRECTION.DOWN
    if (e.key === 'ArrowLeft' || e.key === 'a') newDir = DIRECTION.LEFT
    if (e.key === 'ArrowRight' || e.key === 'd') newDir = DIRECTION.RIGHT
    
    if (newDir) {
      e.preventDefault()
      setPacman(prev => ({ ...prev, nextDirection: newDir }))
    }
  }, [gameState])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 吃豆人移动
  useEffect(() => {
    if (gameState !== 'playing') return

    const movePacman = () => {
      setPacman(prev => {
        // 尝试改变方向
        if (prev.nextDirection !== prev.direction) {
          const nextX = prev.x + prev.nextDirection.x
          const nextY = prev.y + prev.nextDirection.y
          if (nextY >= 0 && nextY < ROWS && nextX >= 0 && nextX < COLS) {
            const nextCell = map[nextY]?.[nextX]
            if (nextCell !== 1) {
              return { ...prev, direction: prev.nextDirection }
            }
          }
        }

        // 按当前方向移动
        const newX = prev.x + prev.direction.x
        const newY = prev.y + prev.direction.y
        
        // 隧道效果
        if (newX < 0) return { ...prev, x: COLS - 1 }
        if (newX >= COLS) return { ...prev, x: 0 }
        
        // 检查碰撞
        if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
          const nextCell = map[newY]?.[newX]
          if (nextCell !== 1) {
            let newPacman = { ...prev, x: newX, y: newY }
            
            // 吃豆子
            if (nextCell === 2) {
              setScore(s => s + 10)
              setMap(m => {
                const newMap = [...m]
                newMap[newY] = [...newMap[newY]]
                newMap[newY][newX] = 0
                return newMap
              })
            }
            // 吃能量豆
            else if (nextCell === 3) {
              setScore(s => s + 50)
              setMap(m => {
                const newMap = [...m]
                newMap[newY] = [...newMap[newY]]
                newMap[newY][newX] = 0
                return newMap
              })
              setPowerMode(true)
              setPowerTimer(50)
              setGhosts(gs => gs.map(g => ({ ...g, scared: true })))
            }
            
            return newPacman
          }
        }
        return prev
      })
    }

    gameLoopRef.current = setInterval(movePacman, 150)
    return () => clearInterval(gameLoopRef.current)
  }, [gameState, map])

  // 幽灵移动
  useEffect(() => {
    if (gameState !== 'playing') return

    const moveGhosts = () => {
      setGhosts(prevGhosts => prevGhosts.map(ghost => {
        const directions = [DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT]
        const validMoves = directions.filter(dir => {
          const newX = ghost.x + dir.x
          const newY = ghost.y + dir.y
          if (newY < 0 || newY >= ROWS || newX < 0 || newX >= COLS) return false
          if (map[newY]?.[newX] === 1) return false
          // 不允许掉头
          if (dir.x === -ghost.direction.x && dir.y === -ghost.direction.y) return false
          return true
        })

        let newDirection = ghost.direction
        if (validMoves.length > 0) {
          // 简单 AI：随机选择有效方向
          if (ghost.scared) {
            // 恐惧模式：远离吃豆人
            const safeMoves = validMoves.filter(dir => {
              const dist = Math.abs((ghost.x + dir.x) - pacman.x) + Math.abs((ghost.y + dir.y) - pacman.y)
              return dist > 2
            })
            newDirection = safeMoves.length > 0 
              ? safeMoves[Math.floor(Math.random() * safeMoves.length)]
              : validMoves[Math.floor(Math.random() * validMoves.length)]
          } else {
            // 正常模式：有一定概率追踪吃豆人
            if (Math.random() < 0.4) {
              const trackingMoves = validMoves.filter(dir => {
                const oldDist = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y)
                const newDist = Math.abs((ghost.x + dir.x) - pacman.x) + Math.abs((ghost.y + dir.y) - pacman.y)
                return newDist < oldDist
              })
              newDirection = trackingMoves.length > 0
                ? trackingMoves[Math.floor(Math.random() * trackingMoves.length)]
                : validMoves[Math.floor(Math.random() * validMoves.length)]
            } else {
              newDirection = validMoves[Math.floor(Math.random() * validMoves.length)]
            }
          }
        }

        return {
          ...ghost,
          x: ghost.x + newDirection.x,
          y: ghost.y + newDirection.y,
          direction: newDirection
        }
      }))
    }

    ghostLoopRef.current = setInterval(moveGhosts, 200)
    return () => clearInterval(ghostLoopRef.current)
  }, [gameState, map, pacman.x, pacman.y])

  // 能量模式计时器
  useEffect(() => {
    if (!powerMode || gameState !== 'playing') return

    const timer = setInterval(() => {
      setPowerTimer(prev => {
        if (prev <= 1) {
          setPowerMode(false)
          setGhosts(gs => gs.map(g => ({ ...g, scared: false })))
          return 0
        }
        return prev - 1
      })
    }, 100)

    return () => clearInterval(timer)
  }, [powerMode, gameState])

  // 碰撞检测
  useEffect(() => {
    if (gameState !== 'playing') return

    const collision = ghosts.find(ghost => 
      Math.abs(ghost.x - pacman.x) < 1 && Math.abs(ghost.y - pacman.y) < 1
    )

    if (collision) {
      if (powerMode) {
        // 吃幽灵
        setScore(s => s + 200)
        setGhosts(gs => gs.map(g => 
          g === collision ? { ...g, x: 9, y: 10, scared: false } : g
        ))
      } else {
        // 被幽灵抓到
        setLives(prev => {
          if (prev <= 1) {
            setGameState('gameover')
            if (score > highScore) {
              setHighScore(score)
              localStorage.setItem('pacmanHighScore', String(score))
            }
            return 0
          }
          // 重置位置
          setPacman({ x: 9, y: 15, direction: DIRECTION.RIGHT, nextDirection: DIRECTION.RIGHT })
          setGhosts([
            { x: 9, y: 8, color: GHOST_COLORS[0], direction: DIRECTION.UP, scared: false },
            { x: 8, y: 10, color: GHOST_COLORS[1], direction: DIRECTION.UP, scared: false },
            { x: 10, y: 10, color: GHOST_COLORS[2], direction: DIRECTION.UP, scared: false },
            { x: 9, y: 10, color: GHOST_COLORS[3], direction: DIRECTION.UP, scared: false }
          ])
          return prev - 1
        })
      }
    }
  }, [pacman.x, pacman.y, ghosts, powerMode, gameState, score, highScore])

  // 检查胜利
  useEffect(() => {
    if (gameState !== 'playing') return

    const remainingDots = map.flat().filter(cell => cell === 2 || cell === 3).length
    if (remainingDots === 0) {
      setLevel(l => l + 1)
      setMap(initMap())
      setPacman({ x: 9, y: 15, direction: DIRECTION.RIGHT, nextDirection: DIRECTION.RIGHT })
      setGhosts([
        { x: 9, y: 8, color: GHOST_COLORS[0], direction: DIRECTION.UP, scared: false },
        { x: 8, y: 10, color: GHOST_COLORS[1], direction: DIRECTION.UP, scared: false },
        { x: 10, y: 10, color: GHOST_COLORS[2], direction: DIRECTION.UP, scared: false },
        { x: 9, y: 10, color: GHOST_COLORS[3], direction: DIRECTION.UP, scared: false }
      ])
    }
  }, [map, gameState, initMap])

  // 嘴巴动画
  useEffect(() => {
    if (gameState !== 'playing') return
    const interval = setInterval(() => setMouthOpen(prev => !prev), 100)
    return () => clearInterval(interval)
  }, [gameState])

  return (
    <div className="pacman-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="pacman-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>吃豆人</h1>
            <p className="subtitle">PACMAN · TAPE FUTURISM</p>
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
              <span className="score-value">{String(score).padStart(6, '0')}</span>
            </div>
            <div className="score-box">
              <span className="score-label">BEST</span>
              <span className="score-value highlight">{String(highScore).padStart(6, '0')}</span>
            </div>
            <div className="info-box">
              <span className="info-label">LEVEL</span>
              <span className="info-value">{level}</span>
            </div>
            <div className="info-box">
              <span className="info-label">LIVES</span>
              <span className="info-value">{lives}</span>
            </div>
            <div className="info-box power-indicator">
              <span className="info-label">POWER</span>
              <div className="power-bar">
                <div className="power-fill" style={{ width: `${(powerTimer / 50) * 100}%` }}></div>
              </div>
            </div>
            
            {/* 操作说明 */}
            <div className="controls-mini">
              <div className="controls-mini-header">
                <span>CONTROLS</span>
              </div>
              <div className="controls-mini-grid">
                <div className="control-mini">
                  <span className="mini-key">↑</span>
                  <span className="mini-label">上</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">↓</span>
                  <span className="mini-label">下</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">←</span>
                  <span className="mini-label">左</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">→</span>
                  <span className="mini-label">右</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area">
            <div className="game-canvas pacman-canvas">
              {/* 地图渲染 */}
              {map.length > 0 && map.map((row, y) => (
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`pacman-cell ${cell === 1 ? 'wall' : cell === 2 ? 'dot' : cell === 3 ? 'power' : ''}`}
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE
                    }}
                  >
                    {cell === 2 && <div className="dot"></div>}
                    {cell === 3 && <div className="power-dot"></div>}
                  </div>
                ))
              ))}

              {/* 吃豆人 */}
              {gameState !== 'start' && (
                <div
                  className="pacman"
                  style={{
                    left: pacman.x * CELL_SIZE,
                    top: pacman.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    transform: `rotate(${
                      pacman.direction === DIRECTION.UP ? -90 :
                      pacman.direction === DIRECTION.DOWN ? 90 :
                      pacman.direction === DIRECTION.LEFT ? 180 : 0
                    }deg)`
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="#fbbf24">
                    {mouthOpen ? (
                      <path d="M10 0A10 10 0 1 1 10 20A10 10 0 1 1 10 0L10 10Z" />
                    ) : (
                      <circle cx="10" cy="10" r="10" />
                    )}
                  </svg>
                </div>
              )}

              {/* 幽灵 */}
              {gameState !== 'start' && ghosts.map((ghost, i) => (
                <div
                  key={i}
                  className={`ghost ${ghost.scared ? 'scared' : ''}`}
                  style={{
                    left: ghost.x * CELL_SIZE,
                    top: ghost.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE
                  }}
                >
                  <svg viewBox="0 0 20 20" fill={ghost.scared ? '#3b82f6' : ghost.color}>
                    <path d="M10 0C4.48 0 0 4.48 0 10V20L3.33 16.67L6.67 20L10 16.67L13.33 20L16.67 16.67L20 20V10C20 4.48 15.52 0 10 0Z"/>
                    <circle cx="6" cy="8" r="2.5" fill="#fff"/>
                    <circle cx="14" cy="8" r="2.5" fill="#fff"/>
                    <circle cx="7" cy="8" r="1" fill="#000"/>
                    <circle cx="15" cy="8" r="1" fill="#000"/>
                  </svg>
                </div>
              ))}

              {/* 开始界面 */}
              {gameState === 'start' && (
                <div className="overlay">
                  <div className="overlay-content">
                    <svg width="60" height="60" viewBox="0 0 20 20" fill="#fbbf24">
                      <path d="M10 0A10 10 0 1 1 10 20A10 10 0 1 1 10 0L10 10Z" />
                    </svg>
                    <h2>吃豆人</h2>
                    <p className="subtitle">经典街机游戏</p>
                    <button className="start-btn" onClick={startGame}>开始游戏</button>
                    <p className="controls-hint">
                      <span className="key-badge">方向键</span> 移动 · 
                      <span className="key-badge">能量豆</span> 吃幽灵
                    </p>
                  </div>
                </div>
              )}

              {/* 游戏结束界面 */}
              {gameState === 'gameover' && (
                <div className="overlay">
                  <div className="overlay-content">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
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
                        <span className="label">关卡</span>
                        <span className="value">{level}</span>
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
                    <button className="start-btn" onClick={startGame}>再玩一次</button>
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
          <span>PACMAN © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>CLASSIC ARCADE</span>
        </div>
      </div>
    </div>
  )
}
