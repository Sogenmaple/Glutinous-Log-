import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/Tetris.css'

// 游戏常量
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 30

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
  }, [score])

  // 初始化游戏板
  const createBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

  // 开始游戏
  const startGame = () => {
    setBoard(createBoard())
    const first = randomTetromino()
    const second = randomTetromino()
    setCurrentPiece(first)
    setNextPiece(second)
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[first].shape[0].length / 2), y: 0 })
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
  }

  // 检查碰撞
  const checkCollision = useCallback((piece, pos, boardData) => {
    const shape = TETROMINOES[piece].shape
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true
          if (newY >= 0 && boardData[newY][newX]) return true
        }
      }
    }
    return false
  }, [])

  // 旋转方块
  const rotate = useCallback((piece) => {
    const shape = TETROMINOES[piece].shape
    const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse())
    return rotated
  }, [])

  // 锁定方块
  const lockPiece = useCallback(() => {
    const newBoard = board.map(row => [...row])
    const shape = TETROMINOES[currentPiece].shape
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
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1)
        newBoard.unshift(Array(BOARD_WIDTH).fill(0))
        linesCleared++
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
    }

    setBoard(newBoard)

    // 生成新方块
    const newPiece = nextPiece
    const newNext = randomTetromino()
    const newPos = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[newPiece].shape[0].length / 2), y: 0 }

    if (checkCollision(newPiece, newPos, newBoard)) {
      setGameOver(true)
      setGameStarted(false)
    } else {
      setCurrentPiece(newPiece)
      setNextPiece(newNext)
      setPosition(newPos)
    }
  }, [board, currentPiece, nextPiece, position, level, checkCollision])

  // 下落
  const moveDown = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return

    const newPos = { ...position, y: position.y + 1 }
    if (checkCollision(currentPiece, newPos, board)) {
      lockPiece()
    } else {
      setPosition(newPos)
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, lockPiece])

  // 左右移动
  const move = useCallback((dir) => {
    if (!gameStarted || gameOver || isPaused) return
    const newPos = { ...position, x: position.x + dir }
    if (!checkCollision(currentPiece, newPos, board)) {
      setPosition(newPos)
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision])

  // 旋转
  const rotatePiece = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return
    const rotated = rotate(currentPiece)
    const testPiece = { ...TETROMINOES[currentPiece], shape: rotated }
    
    // 墙踢
    const kicks = [0, -1, 1, -2, 2]
    for (const kick of kicks) {
      const newPos = { ...position, x: position.x + kick }
      if (!checkCollision(currentPiece, newPos, board)) {
        TETROMINOES[currentPiece].shape = rotated
        setPosition(newPos)
        return
      }
    }
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, rotate, checkCollision])

  // 快速下落
  const hardDrop = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return
    let newY = position.y
    while (!checkCollision(currentPiece, { ...position, y: newY + 1 }, board)) {
      newY++
    }
    setPosition({ ...position, y: newY })
    setTimeout(lockPiece, 50)
  }, [gameStarted, gameOver, isPaused, currentPiece, position, board, checkCollision, lockPiece])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return
      switch (e.key) {
        case 'ArrowLeft': move(-1); break
        case 'ArrowRight': move(1); break
        case 'ArrowDown': moveDown(); break
        case 'ArrowUp': rotatePiece(); break
        case ' ': hardDrop(); break
        case 'p': setIsPaused(p => !p); break
        default: break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, move, moveDown, rotatePiece, hardDrop])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return
    const speed = Math.max(100, 1000 - (level - 1) * 100)
    const interval = setInterval(moveDown, speed)
    return () => clearInterval(interval)
  }, [gameStarted, gameOver, isPaused, level, moveDown])

  return (
    <div className="tetris-page">
      <Header />
      <div className="tetris-container">
        <div className="tetris-header">
          <h1 className="tetris-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">俄罗斯方块</span>
          </h1>
          <p className="tetris-subtitle">TETRIS - 经典益智游戏</p>
        </div>

        <div className="tetris-wrapper">
          <div className="tetris-board-container">
            <div className="tetris-board" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)` }}>
              {board.map((row, y) => row.map((cell, x) => (
                <div key={`${y}-${x}`} className="tetris-cell" style={{ backgroundColor: cell || 'transparent' }} />
              )))}
              {currentPiece && gameStarted && !gameOver && (
                <>
                  {TETROMINOES[currentPiece].shape.map((row, dy) => row.map((cell, dx) => {
                    if (!cell) return null
                    const x = position.x + dx
                    const y = position.y + dy
                    if (y < 0) return null
                    return (
                      <div key={`piece-${y}-${x}`} className="tetris-cell current" style={{ backgroundColor: TETROMINOES[currentPiece].color }} />
                    )
                  }))}
                </>
              )}
            </div>
          </div>

          <div className="tetris-sidebar">
            <div className="tetris-stats">
              <div className="stat-box">
                <span className="stat-label">分数</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">最佳</span>
                <span className="stat-value high">{highScore}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">等级</span>
                <span className="stat-value">{level}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">消除行</span>
                <span className="stat-value">{lines}</span>
              </div>
            </div>

            <div className="next-piece-box">
              <h3>下一个</h3>
              <div className="next-piece-display">
                {nextPiece && TETROMINOES[nextPiece].shape.map((row, y) => (
                  <div key={y} className="next-row">
                    {row.map((cell, x) => (
                      <div key={x} className="next-cell" style={{ backgroundColor: cell ? TETROMINOES[nextPiece].color : 'transparent' }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="tetris-controls">
              {!gameStarted || gameOver ? (
                <button className="start-btn" onClick={startGame}>{gameOver ? '再玩一次' : '开始游戏'}</button>
              ) : (
                <button className="pause-btn" onClick={() => setIsPaused(p => !p)}>{isPaused ? '继续' : '暂停'}</button>
              )}
            </div>

            {(gameOver || isPaused) && gameStarted && (
              <div className={`game-overlay ${gameOver ? 'gameover' : 'paused'}`}>
                {gameOver ? '游戏结束' : '游戏暂停'}
              </div>
            )}
          </div>
        </div>

        <div className="tetris-instructions">
          <h3>操作说明</h3>
          <div className="controls-grid">
            <div className="control-item"><span className="key">←→</span> 左右移动</div>
            <div className="control-item"><span className="key">↑</span> 旋转</div>
            <div className="control-item"><span className="key">↓</span> 加速下落</div>
            <div className="control-item"><span className="key">空格</span> 直接掉落</div>
            <div className="control-item"><span className="key">P</span> 暂停游戏</div>
          </div>
        </div>
      </div>
    </div>
  )
}
