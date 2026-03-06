import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/Dinosaur.css'

const GRAVITY = 0.6
const JUMP_STRENGTH = -10
const OBSTACLE_SPEED = 6
const GROUND_Y = 420

export default function Dinosaur() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [dinoY, setDinoY] = useState(GROUND_Y)
  const [dinoVelocity, setDinoVelocity] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isDucking, setIsDucking] = useState(false)

  // 加载最佳记录
  useEffect(() => {
    const saved = localStorage.getItem('dinosaur_highscore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // 保存最佳记录
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('dinosaur_highscore', String(score))
    }
  }, [score, highScore])

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
    setDinoY(GROUND_Y)
    setDinoVelocity(0)
    setObstacles([{ x: 800, type: 'cactus', width: 30 }])
    setScore(0)
    setIsDucking(false)
  }, [])

  // 跳跃
  const jump = useCallback(() => {
    if (!gameStarted) {
      startGame()
    } else if (!gameOver && dinoY >= GROUND_Y) {
      setDinoVelocity(JUMP_STRENGTH)
    }
  }, [gameStarted, gameOver, dinoY, startGame])

  // 蹲下
  const duck = useCallback((ducking) => {
    if (gameStarted && !gameOver) {
      setIsDucking(ducking)
    }
  }, [gameStarted, gameOver])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        duck(true)
      }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowDown') {
        duck(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [jump, duck])

  // 游戏循环
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      // 更新恐龙位置
      setDinoY(y => {
        const newY = y + dinoVelocity
        return newY >= GROUND_Y ? GROUND_Y : newY
      })
      setDinoVelocity(v => (dinoY >= GROUND_Y ? 0 : v + GRAVITY))

      // 更新障碍物
      setObstacles(current => {
        let newObstacles = current.map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
        
        // 移除屏幕外的障碍物
        newObstacles = newObstacles.filter(obs => obs.x > -50)
        
        // 添加新障碍物
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < 500) {
          const types = ['cactus', 'cactus', 'cactus', 'bird']
          const type = types[Math.floor(Math.random() * types.length)]
          newObstacles.push({ 
            x: 800, 
            type, 
            width: type === 'bird' ? 40 : 30,
            y: type === 'bird' ? GROUND_Y - 50 : GROUND_Y 
          })
        }
        
        return newObstacles
      })

      // 增加分数
      setScore(s => s + 1)
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, dinoVelocity, dinoY])

  // 碰撞检测
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const dinoLeft = 50
    const dinoRight = isDucking ? 110 : 80
    const dinoTop = dinoY - (isDucking ? 30 : 60)
    const dinoBottom = dinoY

    for (const obs of obstacles) {
      const obsLeft = obs.x
      const obsRight = obs.x + obs.width
      const obsTop = obs.type === 'bird' ? obs.y - 30 : obs.y - 40
      const obsBottom = obs.y

      if (dinoRight > obsLeft + 10 && dinoLeft < obsRight - 10 &&
          dinoBottom > obsTop + 10 && dinoTop < obsBottom - 10) {
        setGameOver(true)
        return
      }
    }
  }, [dinoY, obstacles, gameStarted, gameOver, isDucking])

  return (
    <div className="dinosaur-page">
      <Header />
      <div className="dinosaur-container">
        <div className="dinosaur-header">
          <h1 className="dinosaur-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">恐龙快跑</span>
          </h1>
          <p className="dinosaur-subtitle">DINO RUN - 无尽跑酷挑战</p>
        </div>

        <div className="dinosaur-game-area">
          <div className="game-canvas">
            {/* 恐龙 */}
            <div 
              className={`dino ${isDucking ? 'ducking' : ''}`}
              style={{ top: dinoY - (isDucking ? 30 : 60) }}
            >
              <div className="dino-body"></div>
              <div className="dino-head"></div>
              <div className="dino-eye"></div>
              <div className="dino-mouth"></div>
              <div className="dino-legs">
                <div className="leg left"></div>
                <div className="leg right"></div>
              </div>
              <div className="dino-tail"></div>
            </div>

            {/* 障碍物 */}
            {obstacles.map((obs, index) => (
              <div 
                key={index}
                className={`obstacle ${obs.type}`}
                style={{ left: obs.x, top: obs.type === 'bird' ? obs.y - 30 : obs.y - 40 }}
              >
                {obs.type === 'bird' ? (
                  <div className="bird-obstacle">
                    <div className="bird-body"></div>
                    <div className="bird-wing"></div>
                    <div className="bird-beak"></div>
                  </div>
                ) : (
                  <div className="cactus-obstacle">
                    <div className="cactus-main"></div>
                    <div className="cactus-arm left"></div>
                    <div className="cactus-arm right"></div>
                  </div>
                )}
              </div>
            ))}

            {/* 地面 */}
            <div className="ground-line"></div>

            {/* 分数 */}
            <div className="score-display">HI {String(highScore).padStart(5, '0')}  {String(score).padStart(5, '0')}</div>

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
                  <p className="hint">空格/↑跳跃 | ↓蹲下</p>
                </div>
              </div>
            )}
          </div>

          <div className="dinosaur-sidebar">
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

        <div className="dinosaur-instructions">
          <h3>操作说明</h3>
          <div className="controls-grid">
            <div className="control-item"><span className="key">空格</span> 跳跃</div>
            <div className="control-item"><span className="key">↑</span> 跳跃</div>
            <div className="control-item"><span className="key">↓</span> 蹲下</div>
            <div className="control-item"><span className="key">点击</span> 跳跃</div>
          </div>
        </div>
      </div>
    </div>
  )
}
