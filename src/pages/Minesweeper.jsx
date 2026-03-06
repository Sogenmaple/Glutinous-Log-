import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/Minesweeper.css'

export default function Minesweeper() {
  const [grid, setGrid] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flags, setFlags] = useState(0)
  const [timer, setTimer] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [difficulty, setDifficulty] = useState('medium')
  const [bestTime, setBestTime] = useState({ easy: null, medium: null, hard: null })
  
  // 难度配置
  const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10, label: '简单' },
    medium: { rows: 16, cols: 16, mines: 40, label: '中等' },
    hard: { rows: 16, cols: 30, mines: 99, label: '困难' }
  }
  
  const { rows: ROWS, cols: COLS, mines: MINES } = difficulties[difficulty]

  // 加载最佳记录
  useEffect(() => {
    const saved = localStorage.getItem('minesweeper_best_times')
    if (saved) {
      try {
        setBestTime(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load best times')
      }
    }
  }, [])

  // 计时器
  useEffect(() => {
    if (gameOver || gameWon) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [gameOver, gameWon])

  // 保存最佳记录
  useEffect(() => {
    if (gameWon && timer > 0) {
      const newBest = { ...bestTime }
      if (!newBest[difficulty] || timer < newBest[difficulty]) {
        newBest[difficulty] = timer
        setBestTime(newBest)
        localStorage.setItem('minesweeper_best_times', JSON.stringify(newBest))
      }
    }
  }, [gameWon])

  // 切换难度时重置游戏
  useEffect(() => {
    resetGame()
  }, [difficulty])

  // 初始化游戏
  const initGame = (excludeIndex = -1) => {
    const newGrid = Array(ROWS * COLS).fill(null).map((_, i) => ({
      index: i,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))

    // 放置地雷（排除第一次点击的位置）
    let minesPlaced = 0
    while (minesPlaced < MINES) {
      const index = Math.floor(Math.random() * ROWS * COLS)
      if (index !== excludeIndex && !newGrid[index].isMine) {
        newGrid[index].isMine = true
        minesPlaced++
      }
    }

    // 计算相邻地雷数
    for (let i = 0; i < ROWS * COLS; i++) {
      if (!newGrid[i].isMine) {
        const neighbors = getNeighbors(i)
        newGrid[i].neighborMines = neighbors.filter(n => newGrid[n].isMine).length
      }
    }

    setGrid(newGrid)
    setGameOver(false)
    setGameWon(false)
    setFlags(0)
    setTimer(0)
    setFirstClick(false)
  }

  // 获取相邻格子
  const getNeighbors = (index) => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    const neighbors = []

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          neighbors.push(nr * COLS + nc)
        }
      }
    }

    return neighbors
  }

  // 点击格子
  const handleClick = (index) => {
    if (gameOver || gameWon || grid[index]?.isFlagged || grid[index]?.isRevealed) return

    // 第一次点击时初始化
    if (firstClick) {
      initGame(index)
      return
    }

    const newGrid = [...grid]
    const cell = newGrid[index]

    if (cell.isMine) {
      // 踩雷了
      cell.isRevealed = true
      setGrid(newGrid)
      setGameOver(true)
      // 显示所有地雷
      newGrid.forEach(c => {
        if (c.isMine) c.isRevealed = true
      })
      setGrid([...newGrid])
    } else {
      // 揭示格子
      revealCell(newGrid, index)
      setGrid([...newGrid])
      checkWin(newGrid)
    }
  }

  // 揭示格子（递归）
  const revealCell = (grid, index) => {
    const cell = grid[index]
    if (cell.isRevealed || cell.isFlagged) return

    cell.isRevealed = true

    if (cell.neighborMines === 0) {
      const neighbors = getNeighbors(index)
      neighbors.forEach(n => revealCell(grid, n))
    }
  }

  // 右键插旗
  const handleRightClick = (e, index) => {
    e.preventDefault()
    if (gameOver || gameWon || grid[index]?.isRevealed) return

    const newGrid = [...grid]
    const cell = newGrid[index]
    
    if (cell.isFlagged) {
      cell.isFlagged = false
      setFlags(f => f - 1)
    } else {
      cell.isFlagged = true
      setFlags(f => f + 1)
    }
    
    setGrid(newGrid)
  }

  // 检查胜利
  const checkWin = (grid) => {
    const unrevealedSafe = grid.filter(c => !c.isMine && !c.isRevealed).length
    if (unrevealedSafe === 0) {
      setGameWon(true)
      // 胜利彩带效果
      createConfetti()
    }
  }

  // 创建彩带效果
  const createConfetti = () => {
    const colors = ['#ff9500', '#06b6d4', '#39ff14', '#bd00ff']
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 2 + 's'
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 5000)
    }
  }

  // 重置游戏
  const resetGame = () => {
    setFirstClick(true)
    initGame()
  }

  // 双击自动揭示
  const handleDoubleClick = (index) => {
    if (gameOver || gameWon) return
    const cell = grid[index]
    if (!cell.isRevealed || cell.neighborMines === 0) return

    // 检查周围旗帜数量
    const neighbors = getNeighbors(index)
    const flaggedCount = neighbors.filter(n => grid[n].isFlagged).length
    
    if (flaggedCount === cell.neighborMines) {
      // 自动揭示周围未标记的格子
      const newGrid = [...grid]
      let hitMine = false
      
      neighbors.forEach(n => {
        const neighbor = newGrid[n]
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
          if (neighbor.isMine) {
            hitMine = true
            neighbor.isRevealed = true
          } else {
            revealCell(newGrid, n)
          }
        }
      })
      
      setGrid(newGrid)
      
      if (hitMine) {
        setGameOver(true)
        newGrid.forEach(c => {
          if (c.isMine) c.isRevealed = true
        })
        setGrid([...newGrid])
      } else {
        checkWin(newGrid)
      }
    }
  }

  // 获取数字颜色
  const getNumberColor = (num) => {
    const colors = {
      1: '#06b6d4', // cyan
      2: '#39ff14', // green
      3: '#ff2d2d', // red
      4: '#bd00ff', // purple
      5: '#ff9500', // amber
      6: '#00e5ff', // cyan-bright
      7: '#ffffff', // white
      8: '#71717a'  // gray
    }
    return colors[num] || '#d4d4d8'
  }

  return (
    <div className="minesweeper-page">
      <Header />
      
      <div className="minesweeper-container">
        {/* 标题 */}
        <div className="minesweeper-header">
          <h1 className="minesweeper-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">扫雷</span>
          </h1>
          <p className="minesweeper-subtitle">MINESWEEPER - 经典益智游戏</p>
        </div>

        {/* 难度选择 */}
        <div className="difficulty-selector">
          {Object.entries(difficulties).map(([key, config]) => (
            <button
              key={key}
              className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => setDifficulty(key)}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* 游戏信息栏 */}
        <div className="minesweeper-info">
          <div className="info-panel">
            <span className="info-label">💣 剩余地雷</span>
            <span className="info-value">{MINES - flags}</span>
          </div>
          <div className="info-panel">
            <span className="info-label">⏱️ 时间</span>
            <span className="info-value">{timer}s</span>
          </div>
          <div className="info-panel">
            <span className="info-label">🏆 最佳</span>
            <span className="info-value best-time">
              {bestTime[difficulty] ? `${bestTime[difficulty]}s` : '--'}
            </span>
          </div>
          <button className="reset-btn" onClick={resetGame}>
            🔄 重置
          </button>
        </div>

        {/* 游戏状态 */}
        {(gameOver || gameWon) && (
          <div className={`game-status ${gameWon ? 'won' : 'lost'}`}>
            {gameWon ? '🎉 恭喜获胜！' : '💥 游戏结束！'}
          </div>
        )}

        {/* 游戏网格 */}
        <div className="minesweeper-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {grid.map((cell, index) => (
            <div
              key={index}
              className={`mine-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isFlagged ? 'flagged' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
              onClick={() => handleClick(index)}
              onContextMenu={(e) => handleRightClick(e, index)}
              onDoubleClick={() => handleDoubleClick(index)}
            >
              {cell.isFlagged && !cell.isRevealed && (
                <span className="cell-flag">🚩</span>
              )}
              {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                <span 
                  className="cell-number"
                  style={{ color: getNumberColor(cell.neighborMines) }}
                >
                  {cell.neighborMines}
                </span>
              )}
              {cell.isRevealed && cell.isMine && (
                <span className="cell-mine">💣</span>
              )}
            </div>
          ))}
        </div>

        {/* 游戏说明 */}
        <div className="minesweeper-instructions">
          <h3>游戏说明</h3>
          <ul>
            <li>左键点击揭示格子</li>
            <li>右键点击插旗标记地雷</li>
            <li>数字表示周围 8 格的地雷数量</li>
            <li>找出所有非地雷格子即可获胜</li>
          </ul>
          
          <div className="pro-tips">
            <h4>高级技巧</h4>
            <ul>
              <li>双击已揭示的数字可快速揭示周围格子（当周围旗帜数等于数字时）</li>
              <li>从角落开始扫雷通常更安全</li>
              <li>记住常见模式：1-1 模式、1-2 模式等</li>
              <li>不要犹豫，逻辑推理可以解决所有局面</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
