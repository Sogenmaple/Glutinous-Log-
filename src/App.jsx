import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import GameTimeline from './components/GameTimeline'
import GameShowcase from './components/GameShowcase'
import PostList from './components/PostList'
import PostDetail from './pages/PostDetail'
import About from './components/About'
import Footer from './components/Footer'
import ScanLines from './components/ScanLines'
import Intro from './components/Intro'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Home from './pages/Home'
import GamesPage from './pages/GamesPage'
import BlogPage from './pages/BlogPage'
import AboutPage from './pages/AboutPage'
import SpecialConstructs from './pages/SpecialConstructs'
import PomodoroTodo from './pages/PomodoroTodo'
import Minesweeper from './pages/Minesweeper'
import Calculator from './pages/Calculator'
import Tetris from './pages/Tetris'
import FlyBird from './pages/FlyBird'
import Dinosaur from './pages/Dinosaur'
import Login from './pages/Login'
import Register from './pages/Register'
import CursorEffect from './components/CursorEffect'
import './App.css'
import './styles/intro.css'
import './styles/cursor.css'
import './styles/home.css'
import './styles/special.css'
import './styles/auth.css'
import './styles/header.css'
import './styles/pomodoro.css'

function AppContent() {
  const [showIntro, setShowIntro] = useState(true)
  const location = useLocation()
  
  // 后台页面跳过 Intro 动画
  const isAdminRoute = location.pathname.startsWith('/admin')

  // 全局自定义光标 - 点实时跟随，圈延迟跟随
  useEffect(() => {
    // 创建外圈容器（延迟跟随）
    const ring = document.createElement('div')
    ring.className = 'custom-cursor-ring'
    ring.style.position = 'fixed'
    ring.style.zIndex = '99998'
    ring.style.pointerEvents = 'none'
    document.body.appendChild(ring)

    // 创建中心点（实时跟随）
    const dot = document.createElement('div')
    dot.className = 'custom-cursor-dot'
    dot.style.position = 'fixed'
    dot.style.zIndex = '99999'
    dot.style.pointerEvents = 'none'
    document.body.appendChild(dot)

    // 圈的延迟跟随
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let animationFrameId = null

    const updateRing = () => {
      const dx = mouseX - ringX
      const dy = mouseY - ringY
      ringX += dx * 0.15
      ringY += dy * 0.15
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      animationFrameId = requestAnimationFrame(updateRing)
    }

    // 点实时跟随鼠标
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateRing)
      }
    }

    // 点击效果
    const handleClick = (e) => {
      ring.classList.add('click')
      dot.classList.add('click')
      setTimeout(() => {
        ring.classList.remove('click')
        dot.classList.remove('click')
      }, 100)

      // 点击粒子 - 单个琥珀色
      const particle = document.createElement('div')
      particle.className = 'click-particle'
      particle.style.left = (e.clientX - 3) + 'px'
      particle.style.top = (e.clientY - 3) + 'px'
      document.body.appendChild(particle)
      setTimeout(() => particle.remove(), 500)
    }

    // 悬停检测
    const handleMouseOver = (e) => {
      const target = e.target
      if (target.matches('button, .tab-btn, .todo-item, .todo-drag-item, .timeline-block, .bar-item, input, select, a')) {
        ring.classList.add('hover')
        dot.classList.add('hover')
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target
      if (target.matches('button, .tab-btn, .todo-item, .todo-drag-item, .timeline-block, .bar-item, input, select, a')) {
        ring.classList.remove('hover')
        dot.classList.remove('hover')
      }
    }

    // 拖拽检测
    const handleDragStart = () => {
      ring.classList.add('drag')
      dot.classList.add('drag')
    }
    const handleDragEnd = () => {
      ring.classList.remove('drag')
      dot.classList.remove('drag')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('dragend', handleDragEnd)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      document.body.removeChild(ring)
      document.body.removeChild(dot)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('dragend', handleDragEnd)
    }
  }, [])

  return (
    <div className="app">
      <ScanLines />
      <CursorEffect />
      {showIntro && !isAdminRoute ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <Routes>
          {/* 主页 - 汤圆的小窝 */}
          <Route path="/" element={<Home />} />
          
          {/* 游戏页面 */}
          <Route path="/games" element={<GamesPage />} />
          
          {/* 博客页面 */}
          <Route path="/blog" element={<BlogPage />} />
          
          {/* 关于页面 */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* 认证页面 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 特殊构造页面 */}
          <Route path="/special" element={<SpecialConstructs />} />
          
          {/* 番茄钟待办 */}
          <Route path="/special/pomodoro" element={<PomodoroTodo />} />
          
          {/* 扫雷游戏 */}
          <Route path="/special/minesweeper" element={<Minesweeper />} />
          
          {/* 计算器 */}
          <Route path="/special/calculator" element={<Calculator />} />
          
          {/* 俄罗斯方块 */}
          <Route path="/special/tetris" element={<Tetris />} />
          
          {/* 飞扬的小鸟 */}
          <Route path="/special/flybird" element={<FlyBird />} />
          
          {/* 恐龙快跑 */}
          <Route path="/special/dinosaur" element={<Dinosaur />} />
          
          {/* 文章详情 */}
          <Route path="/post/:id" element={
            <>
              <Header />
              <PostDetail />
              <Footer />
            </>
          } />

          {/* 后台路由 - 独立布局 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      )}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
