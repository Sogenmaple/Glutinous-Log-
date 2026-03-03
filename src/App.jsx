import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GameTimeline from './components/GameTimeline'
import GameShowcase from './components/GameShowcase'
import About from './components/About'
import Footer from './components/Footer'
import ScanLines from './components/ScanLines'
import BootSequence from './components/BootSequence'
import './App.css'

function App() {
  const [booted, setBooted] = useState(false)

  return (
    <div className="app">
      <ScanLines />
      {!booted ? (
        <BootSequence onComplete={() => setBooted(true)} />
      ) : (
        <>
          <Header />
          <main>
            <Hero />
            <GameTimeline />
            <GameShowcase />
            <About />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
