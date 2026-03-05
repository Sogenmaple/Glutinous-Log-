import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GameTimeline from './components/GameTimeline'
import GameShowcase from './components/GameShowcase'
import PostList from './components/PostList'
import About from './components/About'
import Footer from './components/Footer'
import ScanLines from './components/ScanLines'
import Intro from './components/Intro'
import './App.css'
import './styles/intro.css'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="app">
      <ScanLines />
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
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
      )}
    </div>
  )
}

export default App
