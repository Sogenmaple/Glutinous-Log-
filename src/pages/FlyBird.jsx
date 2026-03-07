import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/FlyBird.css'

const GRAVITY = 0.5
const JUMP_STRENGTH = -8
const PIPE_SPEED = 3
const PIPE_GAP = 150
const BIRD_SIZE = 30
const BIRD_X = 100

export default function FlyBird() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [birdY, setBirdY] = useState(250)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [birdRotation, setBirdRotation] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [particleEffects, setParticleEffects] = useState([])
  const gameLoopRef = useRef(null)
  const lastTimeRef = useRef(0)

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

  // 创建粒子效果
  const createParticles = useCallback((x, y, color = '#fbbf24') => {
    const particles = []
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color
      })
    }
    setParticleEffects(prev => [...prev, ...particles])
  }, [])

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setIsPaused(false)
    setBirdY(250)
    setBirdVelocity(0)
    setBirdRotation(0)
    setPipes([{ x: 600, topHeight: Math.random() * 200 + 100, passed: false }])
    setScore(0)
    setParticleEffects([])
    createParticles(BIRD_X + 15, 265, '#fbbf24')
  }, [createParticles])

  // 跳跃
  const jump = useCallback(() => {
    if (gameOver) return
    if (!gameStarted) {
      startGame()
    } else if (!isPaused) {
      setBirdVelocity(JUMP_STRENGTH)
      createParticles(BIRD_X + 15, birdY + 15, 'rgba(255,149,0,0.5)')
    }
  }, [gameStarted, gameOver, isPaused, birdY, startGame, createParticles])

  // 暂停/继续
  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev)
    }
  }, [gameStarted, gameOver])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        togglePause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump, togglePause])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      
      if (deltaTime >= 16) {
        lastTimeRef.current = now
        
        // 更新鸟的位置和旋转
        setBirdY(y => {
          const newY = y + birdVelocity
          if (newY <= 0 || newY >= 470) {
            setGameOver(true)
            createParticles(BIRD_X + 15, newY <= 0 ? 15 : 485, '#ef4444')
            return Math.max(0, Math.min(newY, 470))
          }
          return newY
        })
        
        setBirdVelocity(v => v + GRAVITY)
        setBirdRotation(rot => Math.min(Math.max(birdVelocity * 3, -30), 90))

        // 更新管道
        setPipes(currentPipes => {
          let newPipes = currentPipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          
          // 移除屏幕外的管道
          newPipes = newPipes.filter(pipe => pipe.x > -60)
          
          // 添加新管道（难度递增）
          const difficulty = Math.min(score * 0.1, 1)
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 400 - difficulty * 50) {
            newPipes.push({ 
              x: 600, 
              topHeight: Math.random() * (200 - difficulty * 50) + 100 + difficulty * 50,
              passed: false 
            })
          }
          
          return newPipes
        })
        
        // 更新粒子
        setParticleEffects(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.5,
              life: p.life - 0.05
            }))
            .filter(p => p.life > 0)
        )
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused, birdVelocity, score, createParticles])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return

    const birdLeft = BIRD_X + 5
    const birdRight = BIRD_X + BIRD_SIZE - 5
    const birdTop = birdY + 5
    const birdBottom = birdY + BIRD_SIZE - 5

    // 检查管道碰撞
    for (const pipe of pipes) {
      const pipeLeft = pipe.x + 5
      const pipeRight = pipe.x + 60 - 5

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
          setGameOver(true)
          createParticles(birdLeft + 15, birdTop + 15, '#ef4444')
          return
        }
      }

      // 得分
      if (pipe.x + 60 < birdLeft && !pipe.passed) {
        setScore(s => s + 1)
        pipe.passed = true
        createParticles(BIRD_X + 15, birdY + 15, '#39ff14')
      }
    }
  }, [birdY, pipes, gameStarted, gameOver, isPaused, createParticles])

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
            {/* 粒子效果 */}
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

            {/* 鸟 */}
            <div 
              className="bird"
              style={{ 
                top: birdY,
                transform: `rotate(${birdRotation}deg)`
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

            {/* 暂停提示 */}
            {isPaused && !gameOver && (
              <div className="game-overlay pause-overlay">
                <div className="overlay-content">
                  <h2>⏸️ 游戏暂停</h2>
                  <p className="hint">按 ESC 或 P 继续</p>
                </div>
              </div>
            )}

            {/* 开始/结束界面 */}
            {(!gameStarted || gameOver) && (
              <div className="game-overlay">
                <div className="overlay-content">
                  {gameOver ? (
                    <>
                      <h2>💥 游戏结束</h2>
                      <p className="final-score">得分：<strong>{score}</strong></p>
                      <p className="best-score">最佳：<strong>{highScore}</strong></p>
                      {score >= highScore && score > 0 && (
                        <p className="new-record">🏆 新纪录！</p>
                      )}
                    </>
                  ) : (
                    <>
                      <h2>🐦 Flappy Bird</h2>
                      <p className="hint">准备好开始冒险了吗？</p>
                    </>
                  )}
                  <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                    {gameOver ? '🔄 再玩一次' : '▶️ 开始游戏'}
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
            {gameStarted && !gameOver && (
              <div className="stat-box">
                <span className="stat-label">按 P 暂停</span>
              </div>
            )}
          </div>
        </div>

        <div className="flybird-instructions">
          <h3>操作说明</h3>
          <div className="controls-grid">
            <div className="control-item"><span className="key">空格</span> 跳跃</div>
            <div className="control-item"><span className="key">↑</span> 跳跃</div>
            <div className="control-item"><span className="key">P</span> 暂停/继续</div>
            <div className="control-item"><span className="key">点击</span> 跳跃</div>
          </div>
          <div className="tips-section">
            <h4>💡 游戏技巧</h4>
            <ul className="tips-list">
              <li>轻点屏幕保持节奏，不要连续点击</li>
              <li>提前预判管道位置，保持平稳飞行</li>
              <li>随着分数提高，管道间距会变小</li>
              <li>利用小鸟旋转判断下落速度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
