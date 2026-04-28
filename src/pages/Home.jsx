import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import '../styles/Home.css'

/**
 * 汤圆的小窝 - 桌面卡片风格首页
 * 所有页面以可拖动的卡片形式散落在桌面上
 * 黑白漫画风格 + 随机布局 + 拖拽交互
 */

// 页面卡片数据
const PAGE_CARDS = [
  { id: 'games', title: '作品集', subtitle: 'PORTFOLIO', desc: '13 个 GameJam 作品', path: '/games', icon: '🎮', size: 'large' },
  { id: 'blog', title: '博客', subtitle: 'BLOG', desc: '游戏·生活·技术', path: '/blog', icon: '📝', size: 'medium' },
  { id: 'about', title: '关于', subtitle: 'ABOUT', desc: '了解汤圆', path: '/about', icon: '👤', size: 'small' },
  { id: 'pomodoro', title: '番茄钟', subtitle: 'POMODORO', desc: '专注计时', path: '/special/pomodoro', icon: '🍅', size: 'medium' },
  { id: 'minigames', title: '小游戏', subtitle: 'MINIGAMES', desc: '贪吃蛇·扫雷·吃豆人', path: '/special/minigames', icon: '🕹️', size: 'medium' },
  { id: 'special', title: '特殊构造', subtitle: 'SPECIAL', desc: '奇奇怪怪的东西', path: '/special', icon: '⚡', size: 'small' },
  { id: 'profile', title: '个人中心', subtitle: 'PROFILE', desc: '管理你的资料', path: '/profile', icon: '👤', size: 'small' },
  { id: 'login', title: '登录', subtitle: 'LOGIN', desc: '欢迎回来', path: '/login', icon: '🔑', size: 'small' },
]

// 随机旋转角度范围
const ROTATION_RANGE = [-8, -6, -4, -2, 0, 2, 4, 6, 8]

export default function Home() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [dragging, setDragging] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zIndexCounter, setZIndexCounter] = useState(10)
  const containerRef = useRef(null)

  // 初始化卡片位置
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    const initialCards = PAGE_CARDS.map((card, index) => {
      // 根据卡片大小确定尺寸
      let width, height
      switch (card.size) {
        case 'large':
          width = 320
          height = 240
          break
        case 'medium':
          width = 260
          height = 200
          break
        default:
          width = 200
          height = 160
      }

      // 随机位置（确保在容器内）
      const x = Math.random() * Math.max(0, containerWidth - width - 40) + 20
      const y = Math.random() * Math.max(0, containerHeight - height - 40) + 20
      const rotation = ROTATION_RANGE[Math.floor(Math.random() * ROTATION_RANGE.length)]

      return {
        ...card,
        x,
        y,
        width,
        height,
        rotation,
        zIndex: index + 1,
        isFlipped: false,
      }
    })

    setCards(initialCards)
  }, [])

  // 鼠标按下 - 开始拖拽
  const handleMouseDown = useCallback((e, cardId) => {
    e.preventDefault()
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    // 提升到最上层
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, zIndex: zIndexCounter + 1 } : c
    ))
    setZIndexCounter(prev => prev + 1)

    setDragging(cardId)
    setDragOffset({
      x: e.clientX - card.x,
      y: e.clientY - card.y,
    })
  }, [cards, zIndexCounter])

  // 鼠标移动 - 拖拽中
  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e) => {
      setCards(prev => prev.map(card => {
        if (card.id !== dragging) return card
        return {
          ...card,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        }
      }))
    }

    const handleMouseUp = (e) => {
      // 检查是否是拖拽（移动距离 < 5px 算点击）
      const card = cards.find(c => c.id === dragging)
      if (card) {
        const dx = e.clientX - dragOffset.x - card.x
        const dy = e.clientY - dragOffset.y - card.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 5) {
          // 点击 - 翻转卡片
          setCards(prev => prev.map(c =>
            c.id === dragging ? { ...c, isFlipped: !c.isFlipped } : c
          ))
        }
      }
      
      setDragging(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, dragOffset, cards])

  // 点击卡片跳转
  const handleCardClick = (card) => {
    navigate(card.path)
  }

  // 双击卡片翻转
  const handleDoubleClick = (e, cardId) => {
    e.preventDefault()
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isFlipped: !card.isFlipped } : card
    ))
  }

  return (
    <div className="desktop-page">
      <div className="manga-halftone"></div>
      <Header />
      
      <div className="desktop-container" ref={containerRef}>
        {/* 桌面标题 */}
        <div className="desktop-title">
          <h1>湯圓的桌面</h1>
          <span>拖拽卡片 · 点击翻转 · 双击跳转</span>
        </div>

        {/* 卡片列表 */}
        {cards.map(card => (
          <div
            key={card.id}
            className={`desktop-card ${card.isFlipped ? 'flipped' : ''} ${dragging === card.id ? 'dragging' : ''}`}
            style={{
              left: card.x,
              top: card.y,
              width: card.width,
              height: card.height,
              transform: `rotate(${card.rotation}deg)`,
              zIndex: card.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
            onClick={() => handleCardClick(card)}
            onDoubleClick={(e) => handleDoubleClick(e, card.id)}
          >
            {/* 卡片正面 */}
            <div className="card-front">
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <span className="card-subtitle">{card.subtitle}</span>
              <div className="card-divider"></div>
              <p className="card-desc">{card.desc}</p>
              <div className="card-corner tl"></div>
              <div className="card-corner tr"></div>
              <div className="card-corner bl"></div>
              <div className="card-corner br"></div>
            </div>

            {/* 卡片背面 */}
            <div className="card-back">
              <div className="card-back-content">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="card-back-hint">点击跳转 →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
