import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Pacman.css'

const COLS = 19
const ROWS = 21
const CELL_SIZE = 20

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
  const [particles, setParticles] = useState([])
  const [powerMode, setPowerMode] = useState(false)
  const [powerTimer, setPowerTimer] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(true)
  
  const gameLoopRef = useRef(null)
  const ghostLoopRef = useRef(null)
  const canChangeDirection = useRef(true)

  const initMap = useCallback(() => {
    return INITIAL_MAP.map(row => [...row])
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
    setParticles([])
    setPowerMode(false)
    setPowerTimer(0)
    setGameState('playing')
  }

  const resetPositions = () => {
    setPacman({ x: 9, y: 15, direction: DIRECTION.RIGHT, nextDirection: DIRECTION.RIGHT })
    setGhosts([
      { x: 9, y: 8, color: GHOST_COLORS[0], direction: DIRECTION.UP, scared: false },
      { x: 8, y: 10, color: GHOST_COLORS[1], direction: DIRECTION.UP, scared: false },
      { x: 10, y: 10, color: GHOST_COLORS[2], direction: DIRECTION.UP, scared: false },
      { x: 9, y: 10, color: GHOST_COLORS[3], direction: DIRECTION.UP, scared: false }
    ])
    setPowerMode(false)
    setPowerTimer(0)
  }

  const canMove = useCallback((x, y, currentMap) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false
    return currentMap[y] && currentMap[y][x] !== 1
  }, [])

  const movePacman = useCallback(() => {
    setPacman(prev => {
      let newDirection = prev.direction
      if (canChangeDirection.current && prev.nextDirection !== DIRECTION.NONE) {
        const nextX = prev.x + prev.nextDirection.x
        const nextY = prev.y + prev.nextDirection.y
        if (canMove(nextX, nextY, map)) {
          newDirection = prev.nextDirection
        }
      }

      const newX = prev.x + newDirection.x
      const newY = prev.y + newDirection.y

      if (canMove(newX, newY, map)) {
        // 隧道效果
        let finalX = newX
        if (finalX < 0) finalX = COLS - 1
        if (finalX >= COLS) finalX = 0

        return { ...prev, x: finalX, y: newY, direction: newDirection }
      }
      return prev
    })
    canChangeDirection.current = true
  }, [map, canMove])

  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => {
      return prevGhosts.map(ghost => {
        const directions = [DIRECTION.UP, DIRECTION.DOWN, DIRECTION.LEFT, DIRECTION.RIGHT]
        const validDirections = directions.filter(dir => {
          const newX = ghost.x + dir.x
          const newY = ghost.y + dir.y
          return canMove(newX, newY, map) && !(dir.x === -ghost.direction.x && dir.y === -ghost.direction.y)
        })

        let newDirection = ghost.direction
        if (validDirections.length > 0) {
          // 简单 AI：随机选择方向
          newDirection = validDirections[Math.floor(Math.random() * validDirections.length)]
        }

        const newX = ghost.x + newDirection.x
        const newY = ghost.y + newDirection.y
        let finalX = newX
        if (finalX < 0) finalX = COLS - 1
        if (finalX >= COLS) finalX = 0

        if (canMove(finalX, newY, map)) {
          return { ...ghost, x: finalX, y: newY, direction: newDirection }
        }
        return ghost
      })
    })
  }, [map, canMove])

  // 吃豆子和碰撞检测
  useEffect(() => {
    if (gameState !== 'playing') return

    // 吃豆子
    if (map[pacman.y] && map[pacman.y][pacman.x] === 2) {
      setMap(prev => {
        const newMap = prev.map(row => [...row])
        newMap[pacman.y][pacman.x] = 0
        return newMap
      })
      setScore(prev => prev + 10)
      createParticles(pacman.x, pacman.y, '#fbbf24')
    }

    // 吃能量豆
    if (map[pacman.y] && map[pacman.y][pacman.x] === 3) {
      setMap(prev => {
        const newMap = prev.map(row => [...row])
        newMap[pacman.y][pacman.x] = 0
        return newMap
      })
      setScore(prev => prev + 50)
      setPowerMode(true)
      setPowerTimer(300)
      setGhosts(prev => prev.map(g => ({ ...g, scared: true })))
      createParticles(pacman.x, pacman.y, '#06b6d4')
    }

    // 检查是否吃完所有豆子
    const remainingDots = map.flat().filter(cell => cell === 2 || cell === 3).length
    if (remainingDots === 0) {
      setLevel(prev => prev + 1)
      resetPositions()
      setMap(initMap())
    }

    // 幽灵碰撞检测
    const hitGhost = ghosts.find(g => Math.abs(g.x - pacman.x) < 1 && Math.abs(g.y - pacman.y) < 1)
    if (hitGhost) {
      if (hitGhost.scared) {
        // 吃掉幽灵
        setScore(prev => prev + 200)
        createParticles(hitGhost.x, hitGhost.y, hitGhost.color)
        setGhosts(prev => prev.map(g => 
          g === hitGhost ? { ...g, x: 9, y: 10, scared: false } : g
        ))
      } else {
        // 被幽灵抓到
        setLives(prev => {
          const newLives = prev - 1
          if (newLives <= 0) {
            setGameState('gameover')
            if (score > highScore) {
              setHighScore(score)
              localStorage.setItem('pacmanHighScore', score.toString())
            }
          } else {
            resetPositions()
          }
          return newLives
        })
      }
    }
  }, [pacman, ghosts, map, gameState, score, highScore, initMap])

  // 游戏主循环
  useEffect(() => {
    if (gameState !== 'playing') return

    const speed = Math.max(100, 200 - level * 15)
    gameLoopRef.current = setInterval(movePacman, speed)

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameState, level, movePacman])

  // 幽灵移动循环
  useEffect(() => {
    if (gameState !== 'playing') return

    const ghostSpeed = Math.max(150, 250 - level * 20)
    ghostLoopRef.current = setInterval(moveGhosts, ghostSpeed)

    return () => {
      if (ghostLoopRef.current) clearInterval(ghostLoopRef.current)
    }
  }, [gameState, level, moveGhosts])

  // 能量模式计时器
  useEffect(() => {
    if (!powerMode || gameState !== 'playing') return

    const timer = setInterval(() => {
      setPowerTimer(prev => {
        if (prev <= 1) {
          setPowerMode(false)
          setGhosts(g => g.map(ghost => ({ ...ghost, scared: false })))
          return 0
        }
        return prev - 1
      })
    }, 100)

    return () => clearInterval(timer)
  }, [powerMode, gameState])

  // 嘴巴动画
  useEffect(() => {
    if (gameState !== 'playing') return
    const mouthInterval = setInterval(() => {
      setMouthOpen(prev => !prev)
    }, 100)
    return () => clearInterval(mouthInterval)
  }, [gameState])

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

      if (gameState !== 'playing') return

      let newDirection = null
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': newDirection = DIRECTION.UP; break
        case 'ArrowDown': case 's': case 'S': newDirection = DIRECTION.DOWN; break
        case 'ArrowLeft': case 'a': case 'A': newDirection = DIRECTION.LEFT; break
        case 'ArrowRight': case 'd': case 'D': newDirection = DIRECTION.RIGHT; break
        default: return
      }

      if (newDirection) {
        setPacman(prev => ({ ...prev, nextDirection: newDirection }))
        canChangeDirection.current = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  return (
    <>
      <Header />
      <main className="pacman-page-main">
        <div className="pacman-game-container">
          <div className="pacman-game-wrapper">
            {/* 游戏头部 */}
            <div className="game-header">
              <div className="game-title">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 12l6-4" />
                  <path d="M12 12l6 4" />
                </svg>
                <span>吃豆人</span>
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
                  <span className="stat-label">生命</span>
                  <span className="stat-value">{lives}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">关卡</span>
                  <span className="stat-value">{level}</span>
                </div>
              </div>
            </div>

            {/* 游戏画布 */}
            <div className="pacman-canvas-wrapper">
              <div className="pacman-canvas" style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}>
                {/* 地图渲染 */}
                {map.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`pacman-cell ${cell === 1 ? 'wall' : cell === 2 ? 'dot' : cell === 3 ? 'power-dot' : ''}`}
                      style={{ left: x * CELL_SIZE, top: y * CELL_SIZE }}
                    />
                  ))
                )}

                {/* 吃豆人 */}
                {gameState !== 'gameover' && (
                  <div
                    className="pacman-entity"
                    style={{
                      left: pacman.x * CELL_SIZE,
                      top: pacman.y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      transform: `rotate(${
                        pacman.direction === DIRECTION.RIGHT ? 0 :
                        pacman.direction === DIRECTION.DOWN ? 90 :
                        pacman.direction === DIRECTION.LEFT ? 180 : 270
                      }deg)`
                    }}
                  >
                    <svg viewBox="0 0 20 20" className="pacman-svg">
                      {mouthOpen ? (
                        <path d="M10 0A10 10 0 1 1 10 20A10 10 0 1 1 10 0L10 10Z" fill="#fbbf24" />
                      ) : (
                        <circle cx="10" cy="10" r="10" fill="#fbbf24" />
                      )}
                    </svg>
                  </div>
                )}

                {/* 幽灵 */}
                {ghosts.map((ghost, i) => (
                  <div
                    key={i}
                    className={`ghost-entity ${ghost.scared ? 'scared' : ''}`}
                    style={{
                      left: ghost.x * CELL_SIZE,
                      top: ghost.y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: ghost.scared ? '#3b82f6' : ghost.color
                    }}
                  >
                    <div className="ghost-eyes">
                      <div className="ghost-eye" />
                      <div className="ghost-eye" />
                    </div>
                  </div>
                ))}

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
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 12l6-4" />
                          <path d="M12 12l6 4" />
                        </svg>
                        吃豆人
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
                <li>能量豆可以反转局势，吃掉恐惧的幽灵</li>
                <li>记住幽灵的移动模式，提前规划路线</li>
                <li>利用隧道可以快速摆脱幽灵追击</li>
                <li>每关速度会提升，保持冷静应对</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
