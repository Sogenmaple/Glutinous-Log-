import { useState, useEffect } from 'react'

const bootLines = [
  { text: 'TANGYUAN SYSTEM v3.14', delay: 0 },
  { text: '════════════════════════════════════', delay: 200 },
  { text: 'INITIALIZING MEMORY.......... 640K OK', delay: 500 },
  { text: 'LOADING GAME DATABASE......... OK', delay: 900 },
  { text: 'CHECKING DISPLAY ADAPTER...... CRT OK', delay: 1300 },
  { text: 'MOUNTING CASSETTE DRIVE....... OK', delay: 1700 },
  { text: 'AUDIO SUBSYSTEM............... OK', delay: 2000 },
  { text: '════════════════════════════════════', delay: 2300 },
  { text: 'ALL SYSTEMS NOMINAL', delay: 2500 },
  { text: '', delay: 2700 },
  { text: '> PRESS ANY KEY TO CONTINUE_', delay: 2900 },
]

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timers = bootLines.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text])
        if (i === bootLines.length - 1) setReady(true)
      }, line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (!ready) return
    const handler = () => onComplete()
    window.addEventListener('keydown', handler)
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('click', handler)
    }
  }, [ready, onComplete])

  return (
    <div className="boot-sequence">
      <div className="boot-terminal">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${i === visibleLines.length - 1 && ready ? 'blink' : ''}`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
