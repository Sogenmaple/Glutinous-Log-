import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import { BlockIcon } from '../components/icons/SiteIcons'
import '../styles/Tetris.css'

// 游戏常量
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 28

// 方块形状
const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#06b6d4' },
  O: { shape: [[1, 1], [1, 1]], color: '#fbbf24' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' }
}

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOES)
  return keys[Math.floor(Math.random() * keys.length)]
}

export default function Tetris() {
  const [board, setBoard] = useState([])
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [particleEffects, setParticleEffects] = useState([])
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 })
  const [rotatedShapes, setRotatedShapes] = useState({})
  const gameLoopRef = useRef(null)

  // 加载最佳记录
  useEffect(() => {
    const saved = localStorage.getItem('tetris_highscore')
    if (saved) {
      setHighScore(parseInt(saved))
    }
  }, [])

  // 保存最佳记录
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('tetris_highscore', String(score))
    }
  }, [score, highScore])

  // 初始化游戏板
  const createBoard = useCallback(() => 
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)), 
  [])

  // 创建粒子效果
  const createParticles = useCallback((y, color) => {
    const particles = []
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let i = 0; i < 3; i++) {
        particles.push({
          id: Date.now() + '-' + x + '-' + i,
          x: x * CELL_SIZE + CELL_SIZE / 2,
          y: y * CELL_SIZE + CELL_SIZE / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 5,
          life: 1,
          color
        })
      }
    }
    setParticleEffects(prev => [...prev, ...particles])
  }, [])

  // 开始游戏
  const startGame = useCallback(() => {
    const newBoard = createBoard()
    const first = randomTetromino()
    const second = randomTetromino()
    setBoard(newBoard)
    setCurrentPiece(first)
    setNextPiece(second)
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[first].shape[0].length / 2), y: 0 })
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
    setParticleEffects([])
    setRotatedShapes({})
  }, [createBoard])

  // 检查碰撞
  const checkCollision = useCallback((piece, pos, boardData, shape) => {
    const pieceShape = shape || TETROMINOES[piece].shape
    for (let y = 0; y < pieceShape.length; y++) {
      for (let x = 0; x < pieceShape[y].length; x++) {
        if (pieceShape[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true
          if (newY >= 0 && boardData[newY][newX]) return true
        }
      }
    }
    return false
  }, [])

  // 锁定方块
  const lockPiece = useCallback(() => {
    const newBoard = board.map(row => [...row])
    const shape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    const color = TETROMINOES[currentPiece].color

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] && position.y + y >= 0) {
          newBoard[position.y + y][position.x + x] = color
        }
      }
    }

    // 检查并消除行
    let linesCleared = 0
    const clearedLines = []
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1)
        newBoard.unshift(Array(BOARD_WIDTH).fill(0))
        linesCleared++
        clearedLines.push(y)
        y++
      }
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800]
      setScore(s => s + points[linesCleared] * level)
      setLines(l => {
        const newLines = l + linesCleared
        if (Math.floor(newLines / 10) > Math.floor(l / 10)) {
          setLevel(lvl => lvl + 1)
        }
        return newLines
      })
      
      clearedLines.forEach(y => {
        createParticles(y, color)
      })
    }

    setBoard(newBoard)

    // 生成新方块
    const newPiece = nextPiece
    const newNext = randomTetromino()
    const newPos = { 
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[newPiece].shape[0].length / 2), 
      y: 0 
    }

    if (checkCollision(newPiece, newPos, newBoard, null)) {
      setGameOver(true)
      setGameStarted(false)
    } else {
      setCurrentPiece(newPiece)
      setNextPiece(newNext)
      setPosition(newPos)
      setRotatedShapes({})
    }
  }, [board, currentPiece, nextPiece, position, level, checkCollision, createParticles, rotatedShapes])

  // 计算幽灵位置
  const calculateGhostPosition = useCallback(() => {
    if (!currentPiece || !gameStarted || gameOver || isPaused) return
    
    const shape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    let ghostY = position.y
    while (!checkCollision(currentPiece, { ...position, y: ghostY + 1 }, board, shape)) {
      ghostY++
    }
    setGhostPosition({ x: position.x, y: ghostY })
  }, [currentPiece, position, board, gameStarted, gameOver, isPaused, checkCollision, rotatedShapes])

  // 更新幽灵位置
  useEffect(() => {
    calculateGhostPosition()
  }, [position, currentPiece, calculateGhostPosition])

  // 下落
  const moveDown = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return

    const shape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    const newPos = { ...position, y: position.y + 1 }
    if (checkCollision(currentPiece, newPos, board, shape)) {
      lockPiece()
    } else {
      setPosition(newPos)
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, lockPiece, rotatedShapes])

  // 左右移动
  const move = useCallback((dir) => {
    if (!gameStarted || gameOver || isPaused) return
    const shape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    const newPos = { ...position, x: position.x + dir }
    if (!checkCollision(currentPiece, newPos, board, shape)) {
      setPosition(newPos)
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, rotatedShapes])

  // 旋转
  const rotatePiece = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return
    
    const currentShape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    const rotated = currentShape[0].map((_, i) => currentShape.map(row => row[i]).reverse())
    
    // 墙踢测试
    const kicks = [0, -1, 1, -2, 2]
    for (const kick of kicks) {
      const testPos = { ...position, x: position.x + kick }
      if (!checkCollision(currentPiece, testPos, board, rotated)) {
        setRotatedShapes(prev => ({ ...prev, [currentPiece]: rotated }))
        setPosition(testPos)
        return
      }
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, rotatedShapes])

  // 快速下落
  const hardDrop = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return
    const shape = rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape
    let newY = position.y
    while (!checkCollision(currentPiece, { ...position, y: newY + 1 }, board, shape)) {
      newY++
    }
    setPosition({ ...position, y: newY })
    setTimeout(lockPiece, 50)
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, lockPiece, rotatedShapes])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted && e.key === ' ') {
        e.preventDefault()
        startGame()
        return
      }
      if (!gameStarted) return
      
      switch (e.key) {
        case 'ArrowLeft': move(-1); break
        case 'ArrowRight': move(1); break
        case 'ArrowDown': moveDown(); break
        case 'ArrowUp': rotatePiece(); break
        case ' ': hardDrop(); break
        case 'p':
        case 'P':
        case 'Escape':
          setIsPaused(p => !p); break
        default: break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, move, moveDown, rotatePiece, hardDrop, startGame])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return
    const speed = Math.max(100, 1000 - (level - 1) * 100)
    const interval = setInterval(moveDown, speed)
    return () => clearInterval(interval)
  }, [gameStarted, gameOver, isPaused, level, moveDown])

  // 粒子动画循环
  useEffect(() => {
    if (particleEffects.length === 0) return
    
    const updateParticles = () => {
      setParticleEffects(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5,
            life: p.life - 0.03
          }))
          .filter(p => p.life > 0)
      )
      gameLoopRef.current = requestAnimationFrame(updateParticles)
    }
    
    gameLoopRef.current = requestAnimationFrame(updateParticles)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [particleEffects.length])

  // 重置旋转状态当新方块生成时
  useEffect(() => {
    if (currentPiece && !gameStarted) {
      setRotatedShapes({})
    }
  }, [currentPiece, gameStarted])

  return (
    <div className="tetris-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="tetris-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>
              <span className="title-icon">
                <BlockIcon size={40} color="#fbbf24" />
              </span>
              <span className="title-text">俄罗斯方块</span>
            </h1>
            <p className="subtitle">TETRIS · TAPE FUTURISM</p>
          </div>
          <div className="header-status">
            <span className={`status-badge ${!gameStarted ? 'ready' : gameOver ? 'danger' : isPaused ? 'paused' : 'active'}`}>
              {!gameStarted ? 'READY' : gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="newspaper-content">
          {/* 左侧边栏 */}
          <aside className="news-sidebar-left">
            {/* 游戏信息 */}
            <div className="info-boxes">
              <div className="info-box">
                <span className="info-label">SCORE</span>
                <span className="info-value highlight">{score}</span>
              </div>
              <div className="info-box">
                <span className="info-label">BEST</span>
                <span className="info-value best">{highScore}</span>
              </div>
              <div className="info-box">
                <span className="info-label">LEVEL</span>
                <span className="info-value">{level}</span>
              </div>
              <div className="info-box">
                <span className="info-label">LINES</span>
                <span className="info-value">{lines}</span>
              </div>
            </div>

            {/* 下一个方块 */}
            <div className="next-piece-box">
              <span className="box-label">NEXT</span>
              <div className="next-piece-display">
                {nextPiece && TETROMINOES[nextPiece].shape.map((row, y) => (
                  <div key={y} className="next-row">
                    {row.map((cell, x) => (
                      <div 
                        key={x} 
                        className="next-cell" 
                        style={{ 
                          backgroundColor: cell ? TETROMINOES[nextPiece].color : 'transparent',
                          width: '20px',
                          height: '20px'
                        }} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="tetris-controls">
              {!gameStarted || gameOver ? (
                <button className="start-btn-newspaper" onClick={startGame}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {gameOver ? '再玩一次' : '开始游戏'}
                </button>
              ) : (
                <button className="pause-btn-newspaper" onClick={() => setIsPaused(p => !p)}>
                  {isPaused ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      继续
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                      暂停
                    </>
                  )}
                </button>
              )}
            </div>

            {/* 操作说明 */}
            <div className="controls-mini">
              <div className="controls-mini-header">CONTROLS</div>
              <div className="control-item">
                <span className="control-text">← → 左右移动</span>
              </div>
              <div className="control-item">
                <span className="control-text">↑ 旋转</span>
              </div>
              <div className="control-item">
                <span className="control-text">↓ 加速下落</span>
              </div>
              <div className="control-item">
                <span className="control-text">空格 直接掉落</span>
              </div>
              <div className="control-item">
                <span className="control-text">P 暂停/继续</span>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area-tetris">
            <div className="game-canvas-tetris">
              {/* 背景网格 */}
              <div className="bg-grid-tetris"></div>
              
              {/* 游戏板 */}
              <div className="tetris-board-container">
                {/* 粒子效果层 */}
                <div className="particle-layer">
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
                </div>

                <div 
                  className="tetris-board" 
                  style={{ 
                    gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`
                  }}
                >
                  {/* 背景格子 */}
                  {board.map((row, y) => row.map((cell, x) => (
                    <div 
                      key={`bg-${y}-${x}`} 
                      className="tetris-cell-bg"
                      style={{ 
                        gridRowStart: y + 1,
                        gridColumnStart: x + 1
                      }} 
                    />
                  )))}
                  
                  {/* 幽灵方块 */}
                  {currentPiece && gameStarted && !gameOver && !isPaused && (
                    <>
                      {(rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape).map((row, dy) => row.map((cell, dx) => {
                        if (!cell) return null
                        const x = ghostPosition.x + dx
                        const y = ghostPosition.y + dy
                        if (y < 0) return null
                        return (
                          <div 
                            key={`ghost-${y}-${x}`} 
                            className="tetris-cell-ghost"
                            style={{ 
                              borderColor: TETROMINOES[currentPiece].color,
                              gridRowStart: y + 1,
                              gridColumnStart: x + 1
                            }} 
                          />
                        )
                      }))}
                    </>
                  )}
                  
                  {/* 已锁定方块 */}
                  {board.map((row, y) => row.map((cell, x) => {
                    if (!cell) return null
                    return (
                      <div 
                        key={`locked-${y}-${x}`} 
                        className="tetris-cell-locked"
                        style={{ 
                          backgroundColor: cell,
                          gridRowStart: y + 1,
                          gridColumnStart: x + 1
                        }} 
                      />
                    )
                  }))}
                  
                  {/* 当前方块 */}
                  {currentPiece && gameStarted && !gameOver && (
                    <>
                      {(rotatedShapes[currentPiece] || TETROMINOES[currentPiece].shape).map((row, dy) => row.map((cell, dx) => {
                        if (!cell) return null
                        const x = position.x + dx
                        const y = position.y + dy
                        if (y < 0) return null
                        return (
                          <div 
                            key={`piece-${y}-${x}`} 
                            className="tetris-cell-current" 
                            style={{ 
                              backgroundColor: TETROMINOES[currentPiece].color,
                              gridRowStart: y + 1,
                              gridColumnStart: x + 1
                            }} 
                          />
                        )
                      }))}
                    </>
                  )}
                </div>

                {/* 游戏结束/暂停遮罩 */}
                {(gameOver || (isPaused && gameStarted)) && (
                  <div className={`game-overlay ${gameOver ? 'gameover' : 'paused'}`}>
                    <div className="overlay-content">
                      {gameOver ? (
                        <>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          <h2 className="result-title lose">游戏结束</h2>
                          <div className="score-board">
                            <div className="score-item">
                              <span className="label">得分</span>
                              <span className="value">{score}</span>
                            </div>
                            <div className="score-item">
                              <span className="label">最佳</span>
                              <span className="value">{highScore}</span>
                            </div>
                            <div className="score-item">
                              <span className="label">等级</span>
                              <span className="value">{level}</span>
                            </div>
                          </div>
                          {score >= highScore && score > 0 && (
                            <div className="new-record">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                              <span>新纪录!</span>
                            </div>
                          )}
                          <button className="start-btn" onClick={startGame}>再玩一次</button>
                        </>
                      ) : (
                        <>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                          <h2 className="result-title paused">游戏暂停</h2>
                          <p className="hint">按 ESC 或 P 继续</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
          <span>TETRIS © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>CLASSIC PUZZLE</span>
        </div>
      </div>
    </div>
  )
}
