import { useState, useEffect, useRef } from 'react'
import { games } from '../data/games'

/**
 * 3D 旋转轮播 - 鼠标滚动拨动效果
 * 卡片围绕 Y 轴旋转排列，支持鼠标拖拽和滚轮控制
 */
export default function GameCarousel3D() {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startRotation, setStartRotation] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const containerRef = useRef(null)
  const autoRotateRef = useRef(null)

  // 按时间排序
  const sortedGames = [...games].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB - dateA // 从新到旧
  })

  const CARD_ANGLE = 360 / sortedGames.length
  const RADIUS = 350 // 旋转半径

  // 自动旋转
  useEffect(() => {
    if (autoRotate && !isDragging) {
      autoRotateRef.current = setInterval(() => {
        setRotation((prev) => prev + 0.2)
      }, 16)
    } else {
      clearInterval(autoRotateRef.current)
    }

    return () => clearInterval(autoRotateRef.current)
  }, [autoRotate, isDragging])

  // 鼠标拖拽
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartRotation(rotation)
    setAutoRotate(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    const newRotation = startRotation + deltaX * 0.5
    setRotation(newRotation)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // 5 秒后恢复自动旋转
    setTimeout(() => {
      if (!isDragging) setAutoRotate(true)
    }, 5000)
  }

  // 滚轮控制
  const handleWheel = (e) => {
    setAutoRotate(false)
    setRotation((prev) => prev + e.deltaY * 0.1)
    
    // 5 秒后恢复自动旋转
    setTimeout(() => {
      setAutoRotate(true)
    }, 5000)
  }

  // 触摸支持
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartRotation(rotation)
    setAutoRotate(false)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    const newRotation = startRotation + deltaX * 0.5
    setRotation(newRotation)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTimeout(() => {
      setAutoRotate(true)
    }, 5000)
  }

  return (
    <section className="carousel-3d-section">
      <div className="section-header">
        <div className="section-line"></div>
        <h2 className="section-title">
          <span className="section-icon">◆</span>
          游戏作品
          <span className="section-icon">◆</span>
        </h2>
        <div className="section-line"></div>
      </div>
      <div className="section-subtitle">
        GAME SHOWCASE // 3D CAROUSEL
      </div>

      <div 
        className="carousel-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-viewport">
          <div 
            className="carousel-stage"
            style={{
              transform: `translateZ(-${RADIUS}px) rotateY(${rotation}deg)`
            }}
          >
            {sortedGames.map((game, index) => {
              const angle = CARD_ANGLE * index
              const isFront = Math.abs((angle - rotation % 360 + 540) % 360 - 180) < 90

              return (
                <div
                  key={game.id}
                  className={`carousel-card ${isFront ? 'front' : 'back'}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`
                  }}
                >
                  <div className="card-content">
                    <div className="card-header">
                      <span className="card-date">{new Date(game.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })}</span>
                      <span className="card-jam">{game.jam}</span>
                    </div>

                    <h3 className="card-title">{game.title}</h3>
                    
                    {game.status === 'development' && (
                      <span className="card-status">🚧 开发中</span>
                    )}

                    <p className="card-description">{game.description}</p>

                    <div className="card-tags">
                      {game.tags.map((tag, i) => (
                        <span key={i} className="card-tag">{tag}</span>
                      ))}
                    </div>

                    {Object.keys(game.links).length > 0 && (
                      <div className="card-links">
                        {Object.entries(game.links).map(([type, url]) => (
                          <a
                            key={type}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-link"
                          >
                            <span className="link-text">{type.toUpperCase()}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3D 卡片背面 */}
                  <div className="card-back">
                    <div className="back-content">
                      <h4>详细信息</h4>
                      <p>{game.description}</p>
                      <div className="back-stats">
                        <div className="back-stat">
                          <span className="stat-label">类型</span>
                          <span className="stat-value">{game.tags[0]}</span>
                        </div>
                        <div className="back-stat">
                          <span className="stat-label">状态</span>
                          <span className="stat-value">{game.status === 'development' ? '开发中' : '已完成'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 控制提示 */}
        <div className="carousel-controls">
          <div className="control-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3"/>
            </svg>
            <span>拖拽 / 滚动 / 触摸</span>
          </div>
          <button 
            className={`auto-rotate-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? '⏸ 暂停' : '▶ 自动'}
          </button>
        </div>

        {/* 中心装饰 */}
        <div className="carousel-center">
          <div className="center-glow"></div>
          <div className="center-ring"></div>
        </div>
      </div>
    </section>
  )
}
