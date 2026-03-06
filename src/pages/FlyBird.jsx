import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/FlyBird.css'

const GRAVITY = 0.5
const JUMP_STRENGTH = -8
const PIPE_SPEED = 3
const PIPE_GAP = 150
const BIRD_SIZE = 30

export default function FlyBird() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [birdY, setBirdY] = useState(250)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // 加载最佳记录
  useEffect(() => {
    const saved = localStorage.getItem('flybird_highscore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // 保存最佳记录
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('flybird_highscore', String(score))
    }
  }, [score, highScore])

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setBirdY(250)
    setBirdVelocity(0)
    setPipes([{ x: 600, topHeight: Math.random() * 200 + 100 }])
    setScore(0)
  }, [])

  // 跳跃
  const jump = useCallback(() => {
    if (!gameStarted) {
      startGame()
    } else if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH)
    }
  }, [gameStarted, gameOver, startGame])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      // 更新鸟的位置
      setBirdY(y => {
        const newY = y + birdVelocity
        return Math.max(0, Math.min(newY, 470))
      })
      setBirdVelocity(v => v + GRAVITY)

      // 更新管道
      setPipes(currentPipes => {
        let newPipes = currentPipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        
        // 移除屏幕外的管道
        newPipes = newPipes.filter(pipe => pipe.x > -60)
        
        // 添加新管道
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 400) {
          newPipes.push({ x: 600, topHeight: Math.random() * 200 + 100 })
        }
        
        return newPipes
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, birdVelocity])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const birdLeft = 100
    const birdRight = 100 + BIRD_SIZE
    const birdTop = birdY
    const birdBottom = birdY + BIRD_SIZE

    // 检查地面和天花板碰撞
    if (birdY <= 0 || birdY >= 470) {
      setGameOver(true)
      return
    }

    // 检查管道碰撞
    for (const pipe of pipes) {
      const pipeLeft = pipe.x
      const pipeRight = pipe.x + 60

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
          setGameOver(true)
          return
        }
      }

      // 得分
      if (pipe.x + 60 < birdLeft && !pipe.passed) {
        setScore(s => s + 1)
        pipe.passed = true
      }
    }
  }, [birdY, pipes, gameStarted, gameOver])

  return (
    <div className="flybird-page">
      <Header />
      <div className="flybird-container">
        <div className="flybird-header">
          <h1 className="flybird-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">Flappy Bird</span>
          </h1>
          <p className="flybird-subtitle">FLAPPY BIRD - 经典飞行游戏</p>
        </div>

        <div className="flybird-game-area" onClick={jump}>
          <div className="game-canvas">
            {/* 鸟 */}
            <div 
              className="bird"
              style={{ 
                top: birdY,
                transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 90)}deg)`
              }}
            >
              <div className="bird-body"></div>
              <div className="bird-eye"></div>
              <div className="bird-wing"></div>
              <div className="bird-beak"></div>
            </div>

            {/* 管道 */}
            {pipes.map((pipe, index) => (
              <div key={index} className="pipe-group">
                <div className="pipe pipe-top" style={{ height: pipe.topHeight, left: pipe.x }}></div>
                <div className="pipe pipe-bottom" style={{ height: 500 - pipe.topHeight - PIPE_GAP, left: pipe.x, top: pipe.topHeight + PIPE_GAP }}></div>
              </div>
            ))}

            {/* 地面 */}
            <div className="ground"></div>

            {/* 分数 */}
            <div className="score-display">{score}</div>

            {/* 开始/结束界面 */}
            {(!gameStarted || gameOver) && (
              <div className="game-overlay">
                <div className="overlay-content">
                  {gameOver ? (
                    <>
                      <h2>游戏结束</h2>
                      <p className="final-score">得分：{score}</p>
                      {score >= highScore && score > 0 && (
                        <p className="new-record">🏆 新纪录！</p>
                      )}
                    </>
                  ) : (
                    <h2>点击开始</h2>
                  )}
                  <button className="start-btn" onClick={startGame}>
                    {gameOver ? '再玩一次' : '开始游戏'}
                  </button>
                  <p className="hint">按空格键或点击屏幕跳跃</p>
                </div>
              </div>
            )}
          </div>

          {/* 侧边信息 */}
          <div className="flybird-sidebar">
            <div className="stat-box">
              <span className="stat-label">当前得分</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">最佳记录</span>
              <span className="stat-value high">{highScore}</span>
            </div>
          </div>
        </div>

        <div className="flybird-instructions">
          <h3>操作说明</h3>
          <div className="controls-grid">
            <div className="control-item"><span className="key">空格</span> 跳跃</div>
            <div className="control-item"><span className="key">点击</span> 跳跃</div>
            <div className="control-item"><span className="key">↑</span> 跳跃</div>
          </div>
        </div>
      </div>
    </div>
  )
}
