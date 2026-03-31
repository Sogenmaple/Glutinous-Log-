import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import '../styles/FlyBird.css'

const GRAVITY = 0.6
const JUMP_STRENGTH = -9
const PIPE_SPEED = 3
const PIPE_GAP = 170
const BIRD_SIZE = 28
const BIRD_X = 100

export default function FlyBird() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [birdY, setBirdY] = useState(250)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [birdRotation, setBirdRotation] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flybird_highscore')
    return saved ? parseInt(saved) : 0
  })
  const [isPaused, setIsPaused] = useState(false)
  
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)
  const birdYRef = useRef(250)
  const birdVelocityRef = useRef(0)

  // 保存最高分
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('flybird_highscore', String(score))
    }
  }, [score, highScore])

  const resetGame = useCallback(() => {
    setGameStarted(false)
    setGameOver(false)
    setIsPaused(false)
    setBirdY(250)
    birdYRef.current = 250
    setBirdVelocity(0)
    birdVelocityRef.current = 0
    setBirdRotation(0)
    setPipes([{ x: 600, topHeight: Math.random() * 200 + 100, passed: false }])
    setScore(0)
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setBirdY(250)
    birdYRef.current = 250
    setBirdVelocity(0)
    birdVelocityRef.current = 0
    setBirdRotation(0)
    setPipes([{ x: 600, topHeight: Math.random() * 200 + 100, passed: false }])
    setScore(0)
    lastTimeRef.current = performance.now()
  }, [])

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame()
      return
    }
    if (!gameStarted) {
      startGame()
      return
    }
    if (isPaused) return
    
    birdVelocityRef.current = JUMP_STRENGTH
  }, [gameStarted, gameOver, isPaused, startGame, resetGame])

  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [jump, togglePause])

  // 游戏主循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const update = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp
        
        // 更新鸟的位置
        birdYRef.current += birdVelocityRef.current
        birdVelocityRef.current += GRAVITY
        setBirdY(birdYRef.current)
        
        // 更新旋转
        setBirdRotation(Math.min(Math.max(birdVelocityRef.current * 3, -30), 90))

        // 更新管道
        setPipes(prev => {
          let newPipes = prev.map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED
          }))
          
          // 移除超出屏幕的管道
          newPipes = newPipes.filter(pipe => pipe.x > -60)
          
          // 添加新管道
          const lastPipe = newPipes[newPipes.length - 1]
          if (lastPipe.x < 300) {
            newPipes.push({
              x: 660,
              topHeight: Math.random() * 200 + 100,
              passed: false
            })
          }
          
          return newPipes
        })

        // 更新分数
        setPipes(prev => {
          prev.forEach(pipe => {
            if (!pipe.passed && pipe.x + 50 < BIRD_X) {
              setScore(s => s + 1)
              pipe.passed = true
            }
          })
          return prev
        })
      }
      
      gameLoopRef.current = requestAnimationFrame(update)
    }

    gameLoopRef.current = requestAnimationFrame(update)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const birdTop = birdYRef.current
    const birdBottom = birdYRef.current + BIRD_SIZE
    const birdLeft = BIRD_X + 5
    const birdRight = BIRD_X + BIRD_SIZE - 5

    // 地面和天花板碰撞
    if (birdBottom >= 470 || birdTop <= 0) {
      setGameOver(true)
      return
    }

    // 管道碰撞
    for (const pipe of pipes) {
      const pipeLeft = pipe.x
      const pipeRight = pipe.x + 50
      
      if (birdRight > pipeLeft + 5 && birdLeft < pipeRight - 5) {
        const topPipeBottom = pipe.topHeight
        const bottomPipeTop = pipe.topHeight + PIPE_GAP
        
        if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
          setGameOver(true)
          return
        }
      }
    }
  }, [birdY, pipes, gameStarted, gameOver, isPaused])

  return (
    <div className="flybird-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="flybird-newspaper">
        {/* 报头 */}
        <div className="newspaper-header">
          <div className="header-date">
            <span className="date">{new Date().toLocaleDateString('zh-CN')}</span>
            <span className="issue">VOL.2024.NO.12</span>
          </div>
          <div className="header-title">
            <h1>飞扬的小鸟</h1>
            <p className="subtitle">FLAPPY BIRD · TAPE FUTURISM</p>
          </div>
          <div className="header-status">
            <span className={`status-badge ${gameOver ? 'danger' : gameStarted ? 'active' : 'ready'}`}>
              {gameOver ? 'GAME OVER' : gameStarted ? 'FLYING' : 'READY'}
            </span>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="newspaper-content">
          {/* 左侧边栏 */}
          <aside className="news-sidebar-left">
            <div className="score-box">
              <span className="score-label">SCORE</span>
              <span className="score-value">{String(score).padStart(3, '0')}</span>
            </div>
            <div className="score-box">
              <span className="score-label">BEST</span>
              <span className="score-value highlight">{String(highScore).padStart(3, '0')}</span>
            </div>
            
            {/* 操作说明 */}
            <div className="controls-mini">
              <div className="controls-mini-header">
                <span>CONTROLS</span>
              </div>
              <div className="controls-mini-grid">
                <div className="control-mini">
                  <span className="mini-key">␣</span>
                  <span className="mini-label">跳</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">↑</span>
                  <span className="mini-label">跳</span>
                </div>
                <div className="control-mini">
                  <span className="mini-key">P</span>
                  <span className="mini-label">停</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 中央游戏区 */}
          <main className="news-game-area">
            <div className="game-canvas" onClick={jump}>
              {/* 背景网格 */}
              <div className="bg-grid"></div>
              
              {/* 鸟 */}
              {gameStarted && (
                <div
                  className="bird"
                  style={{
                    top: birdY,
                    transform: `rotate(${birdRotation}deg)`
                  }}
                >
                  <svg viewBox="0 0 30 30" fill="none">
                    {/* 身体 - 琥珀色渐变 */}
                    <ellipse cx="15" cy="15" rx="14" ry="11" fill="url(#birdBody)" stroke="#000000" strokeWidth="2"/>
                    {/* 眼睛 */}
                    <circle cx="22" cy="11" r="4" fill="#fff"/>
                    <circle cx="23" cy="11" r="2" fill="#0a0a0a"/>
                    {/* 嘴巴 */}
                    <path d="M26 14l4 2" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    {/* 翅膀 */}
                    <path d="M8 18l-6-4" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M8 12l-6 4" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
                    {/* 渐变定义 */}
                    <defs>
                      <linearGradient id="birdBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#000000"/>
                        <stop offset="100%" stopColor="#000000"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              {/* 管道 */}
              {gameStarted && pipes.map((pipe, index) => (
                <div key={index}>
                  {/* 上管道 */}
                  <div
                    className="pipe-top"
                    style={{
                      left: pipe.x,
                      height: pipe.topHeight
                    }}
                  >
                    <div className="pipe-body"></div>
                    <div className="pipe-cap"></div>
                  </div>
                  
                  {/* 下管道 */}
                  <div
                    className="pipe-bottom"
                    style={{
                      left: pipe.x,
                      height: 500 - pipe.topHeight - PIPE_GAP
                    }}
                  >
                    <div className="pipe-cap"></div>
                    <div className="pipe-body"></div>
                  </div>
                </div>
              ))}

              {/* 地面 */}
              <div className="ground"></div>

              {/* 开始界面 */}
              {(!gameStarted || gameOver) && (
                <div className="overlay">
                  <div className="overlay-content">
                    {gameOver ? (
                      <>
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
                        </div>
                        {score >= highScore && score > 0 && (
                          <div className="new-record">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
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
                      </>
                    ) : (
                      <>
                        <svg width="60" height="60" viewBox="0 0 30 30" fill="none">
                          <ellipse cx="15" cy="15" rx="14" ry="11" fill="url(#birdBody2)" stroke="#000000" strokeWidth="2"/>
                          <circle cx="22" cy="11" r="4" fill="#fff"/>
                          <circle cx="23" cy="11" r="2" fill="#0a0a0a"/>
                          <path d="M26 14l4 2" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M8 18l-6-4" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M8 12l-6 4" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
                          <defs>
                            <linearGradient id="birdBody2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#000000"/>
                              <stop offset="100%" stopColor="#000000"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <h2>飞扬的小鸟</h2>
                        <p className="subtitle">经典休闲游戏</p>
                      </>
                    )}
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                      {gameOver ? '再玩一次' : '开始游戏'}
                    </button>
                    <p className="controls-hint">
                      <span className="key-badge">空格</span> 跳跃 · 
                      <span className="key-badge">P</span> 暂停
                    </p>
                  </div>
                </div>
              )}

              {/* 暂停界面 */}
              {isPaused && !gameOver && (
                <div className="overlay pause">
                  <div className="overlay-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    <h2>游戏暂停</h2>
                    <p className="hint">按 P 或 ESC 继续</p>
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
          <span>FLAPPY BIRD © 2024</span>
          <span>◆</span>
          <span>TAPE FUTURISM</span>
          <span>◆</span>
          <span>CLASSIC CASUAL</span>
        </div>
      </div>
    </div>
  )
}
