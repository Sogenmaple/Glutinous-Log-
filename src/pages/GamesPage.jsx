import GameTimeline from '../components/GameTimeline'
import GameShowcase from '../components/GameShowcase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { GameIcon } from '../components/icons/SiteIcons'

export default function GamesPage() {
  return (
    <>
      <Header />
      <main className="games-page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <GameIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">游戏宇宙</span>
          </h1>
          <p className="page-subtitle">GAMES UNIVERSE - 穿越时空的互动体验</p>
        </div>
        <GameTimeline />
        <GameShowcase />
      </main>
      <Footer />
    </>
  )
}
