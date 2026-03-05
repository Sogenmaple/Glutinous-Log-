import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import './App.css'
import './styles/intro.css'

function AppContent() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="app">
      <ScanLines />
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <Routes>
          {/* 前台路由 */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Hero />
                <GameTimeline />
                <GameShowcase />
                <PostList />
                <About />
              </main>
              <Footer />
            </>
          } />
          <Route path="/post/:id" element={
            <>
              <Header />
              <PostDetail />
              <Footer />
            </>
          } />

          {/* 后台路由 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
