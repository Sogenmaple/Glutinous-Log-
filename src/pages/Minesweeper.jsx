import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import '../styles/Minesweeper.css'

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10, label: '简单' },
  medium: { rows: 16, cols: 16, mines: 40, label: '中等' },
  hard: { rows: 30, cols: 16, mines: 99, label: '困难' }
}

export default function Minesweeper() {
  const [grid, setGrid] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flags, setFlags] = useState(0)
  const [timer, setTimer] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [difficulty, setDifficulty] = useState('medium')
  const [bestTime, setBestTime] = useState({ easy: null, medium: null, hard: null })
  
  const { rows: ROWS, cols: COLS, mines: MINES } = DIFFICULTIES[difficulty]

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
    if (gameOver || gameWon || firstClick) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [gameOver, gameWon, firstClick])

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
  }, [gameWon, timer, bestTime, difficulty])

  // 获取相邻格子
  const getNeighbors = useCallback((index, cols, rows) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const neighbors = []

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          neighbors.push(nr * cols + nc)
        }
      }
    }
    return neighbors
  }, [])

  // 初始化游戏
  const initGame = useCallback((excludeIndex = -1) => {
    const totalCells = ROWS * COLS
    const newGrid = Array(totalCells).fill(null).map((_, i) => ({
      index: i,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))

    // 放置地雷（排除第一次点击的位置）
    let minesPlaced = 0
    while (minesPlaced < MINES) {
      const index = Math.floor(Math.random() * totalCells)
      if (index !== excludeIndex && !newGrid[index].isMine) {
        newGrid[index].isMine = true
        minesPlaced++
      }
    }

    // 计算相邻地雷数
    for (let i = 0; i < totalCells; i++) {
      if (!newGrid[i].isMine) {
        const neighbors = getNeighbors(i, COLS, ROWS)
        newGrid[i].neighborMines = neighbors.filter(n => newGrid[n].isMine).length
      }
    }

    setGrid(newGrid)
    setGameOver(false)
    setGameWon(false)
    setFlags(0)
    setTimer(0)
    setFirstClick(false)
  }, [ROWS, COLS, MINES, getNeighbors])

  // 揭示格子（递归）
  const revealCell = useCallback((gridState, index, cols, rows) => {
    const cell = gridState[index]
    if (cell.isRevealed || cell.isFlagged) return

    cell.isRevealed = true

    if (cell.neighborMines === 0) {
      const neighbors = getNeighbors(index, cols, rows)
      neighbors.forEach(n => revealCell(gridState, n, cols, rows))
    }
  }, [getNeighbors])

  // 检查胜利
  const checkWin = useCallback((gridState) => {
    const unrevealedSafe = gridState.filter(c => !c.isMine && !c.isRevealed).length
    if (unrevealedSafe === 0) {
      setGameWon(true)
    }
  }, [])

  // 点击格子
  const handleClick = useCallback((index) => {
    if (gameOver || gameWon || !grid[index] || grid[index]?.isFlagged || grid[index]?.isRevealed) return

    // 第一次点击时初始化
    if (firstClick) {
      initGame(index)
      return
    }

    const newGrid = [...grid]
    const cell = newGrid[index]

    if (cell.isMine) {
      cell.isRevealed = true
      setGrid(newGrid)
      setGameOver(true)
      
      // 显示所有地雷
      const finalGrid = newGrid.map(c => ({
        ...c,
        isRevealed: c.isMine ? true : c.isRevealed
      }))
      setGrid(finalGrid)
    } else {
      revealCell(newGrid, index, COLS, ROWS)
      setGrid([...newGrid])
      checkWin(newGrid)
    }
  }, [gameOver, gameWon, grid, firstClick, initGame, COLS, ROWS, revealCell, checkWin])

  // 右键插旗
  const handleRightClick = useCallback((e, index) => {
    e.preventDefault()
    if (gameOver || gameWon || !grid[index] || grid[index]?.isRevealed) return

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
  }, [gameOver, gameWon, grid])

  // 双击自动揭示
  const handleDoubleClick = useCallback((index) => {
    if (gameOver || gameWon || !grid[index]) return
    const cell = grid[index]
    if (!cell.isRevealed || cell.neighborMines === 0) return

    const neighbors = getNeighbors(index, COLS, ROWS)
    const flaggedCount = neighbors.filter(n => grid[n]?.isFlagged).length
    
    if (flaggedCount === cell.neighborMines) {
      const newGrid = [...grid]
      let hitMine = false
      
      neighbors.forEach(n => {
        const neighbor = newGrid[n]
        if (neighbor && !neighbor.isRevealed && !neighbor.isFlagged) {
          if (neighbor.isMine) {
            hitMine = true
            neighbor.isRevealed = true
          } else {
            revealCell(newGrid, n, COLS, ROWS)
          }
        }
      })
      
      setGrid(newGrid)
      
      if (hitMine) {
        setGameOver(true)
        const finalGrid = newGrid.map(c => ({
          ...c,
          isRevealed: c.isMine ? true : c.isRevealed
        }))
        setGrid(finalGrid)
      } else {
        checkWin(newGrid)
      }
    }
  }, [gameOver, gameWon, grid, COLS, ROWS, getNeighbors, revealCell, checkWin])

  // 重置游戏
  const resetGame = () => {
    setFirstClick(true)
    initGame(-1)
  }

  // 切换难度
  const handleDifficultyChange = (key) => {
    setDifficulty(key)
    setFirstClick(true)
    initGame(-1)
  }

  // 获取数字颜色
  const getNumberColor = (num) => {
    const colors = {
      1: '#06b6d4',
      2: '#39ff14',
      3: '#ff2d2d',
      4: '#bd00ff',
      5: '#ff9500',
      6: '#00e5ff',
      7: '#ffffff',
      8: '#71717a'
    }
    return colors[num] || '#d4d4d8'
  }

  return (
    <div className="minesweeper-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="minesweeper-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>扫雷</h1>
            <p className="subtitle">MINESWEEPER · TAPE FUTURISM</p>
          </div>
          <div className="header-status">
            <span className={`status-badge ${firstClick ? 'ready' : gameOver ? 'danger' : gameWon ? 'success' : 'active'}`}>
              {firstClick ? 'READY' : gameOver ? 'GAME OVER' : gameWon ? 'WON!' : 'PLAYING'}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="newspaper-content">
          {/* 左侧边栏 */}
          <aside className="news-sidebar-left">
            {/* 难度选择 */}
            <div className="difficulty-box">
              <span className="box-label">DIFFICULTY</span>
              <div className="difficulty-btns">
                {Object.entries(DIFFICULTIES).map(([key, config]) => (
                  <button
                    key={key}
                    className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange(key)}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 游戏信息 */}
            <div className="info-boxes">
              <div className="info-box">
                <span className="info-label">MINES</span>
                <span className="info-value highlight">{MINES - flags}</span>
              </div>
              <div className="info-box">
                <span className="info-label">TIME</span>
                <span className="info-value">{timer}s</span>
              </div>
              <div className="info-box">
                <span className="info-label">FLAGS</span>
                <span className="info-value">{flags}</span>
              </div>
              <div className="info-box">
                <span className="info-label">BEST</span>
                <span className="info-value best">
                  {bestTime[difficulty] ? `${bestTime[difficulty]}s` : '--'}
                </span>
              </div>
            </div>

            {/* 重置按钮 */}
            <button className="reset-btn-newspaper" onClick={resetGame}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              重置游戏
            </button>

            {/* 操作说明 */}
            <div className="controls-mini">
              <div className="controls-mini-header">CONTROLS</div>
              <div className="control-item">
                <span className="control-icon">🖱️</span>
                <span className="control-text">左键点击</span>
              </div>
              <div className="control-item">
                <span className="control-icon">🚩</span>
                <span className="control-text">右键插旗</span>
              </div>
              <div className="control-item">
                <span className="control-icon">⚡</span>
                <span className="control-text">双击速开</span>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area-minesweeper">
            <div className="game-canvas-minesweeper">
              {/* 背景网格 */}
              <div className="bg-grid-minesweeper"></div>
              
              {/* 游戏网格 */}
              <div 
                className="minesweeper-grid" 
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
              >
                {grid.map((cell, index) => (
                  <div
                    key={index}
                    className={`mine-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isFlagged ? 'flagged' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
                    onClick={() => handleClick(index)}
                    onContextMenu={(e) => handleRightClick(e, index)}
                    onDoubleClick={() => handleDoubleClick(index)}
                  >
                    {cell.isFlagged && !cell.isRevealed && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                        <line x1="4" y1="22" x2="4" y2="15"/>
                      </svg>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                        <circle cx="12" cy="12" r="6"/>
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* 游戏结束覆盖层 */}
              {(gameOver || gameWon) && (
                <div className="overlay">
                  <div className="overlay-content">
                    {gameWon ? (
                      <>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                          <circle cx="12" cy="8" r="7"/>
                          <polyline points="8.21 13.89 7 12 5 12"/>
                          <polyline points="15.79 13.89 17 12 19 12"/>
                          <path d="M12 22v-3"/>
                          <path d="M12 16l-3 3"/>
                          <path d="M12 16l3 3"/>
                        </svg>
                        <h2 className="result-title win">恭喜获胜!</h2>
                        <div className="score-board">
                          <div className="score-item">
                            <span className="label">时间</span>
                            <span className="value">{timer}秒</span>
                          </div>
                          <div className="score-item">
                            <span className="label">难度</span>
                            <span className="value">{DIFFICULTIES[difficulty].label}</span>
                          </div>
                        </div>
                        {bestTime[difficulty] === timer && (
                          <div className="new-record">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <span>新纪录!</span>
                          </div>
                        )}
                        <button className="start-btn" onClick={resetGame}>再玩一次</button>
                      </>
                    ) : (
                      <>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        <h2 className="result-title lose">游戏结束</h2>
                        <div className="score-board">
                          <div className="score-item">
                            <span className="label">坚持时间</span>
                            <span className="value">{timer}秒</span>
                          </div>
                          <div className="score-item">
                            <span className="label">难度</span>
                            <span className="value">{DIFFICULTIES[difficulty].label}</span>
                          </div>
                        </div>
                        <button className="start-btn" onClick={resetGame}>再来一局</button>
                      </>
                    )}
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
          <span>MINESWEEPER © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>CLASSIC PUZZLE</span>
        </div>
      </div>
    </div>
  )
}
