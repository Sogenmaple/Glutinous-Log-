import GameCard from './GameCard'
import { games } from '../data/games'

export default function GameShowcase() {
  return (
    <section id="games" className="showcase">
      <div className="section-header">
        <div className="section-line"></div>
        <h2 className="section-title">
          <span className="section-icon">◆</span>
          作品展示
          <span className="section-icon">◆</span>
        </h2>
        <div className="section-line"></div>
      </div>
      <div className="section-subtitle">
        GAME ARCHIVE // TOTAL ENTRIES: {String(games.length).padStart(2, '0')}
      </div>
      <div className="games-grid">
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </section>
  )
}
