import { useState } from 'react'
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
