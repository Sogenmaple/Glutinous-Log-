import { games } from '../data/games'

export default function GameTimeline() {
  const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date))

  const getLinkIcon = (type) => {
    const icons = {
      gmhub: '🎮',
      bilibili: '📺',
      taptap: '📱'
    }
    return icons[type] || '🔗'
  }

  const getLinkLabel = (type) => {
    const labels = {
      gmhub: 'GMHub',
      bilibili: 'Bilibili',
      taptap: 'TapTap'
    }
    return labels[type] || '链接'
  }

  return (
    <section id="timeline" className="timeline-section">
      <div className="section-header">
        <div className="section-line"></div>
        <h2 className="section-title">
          <span className="section-icon">◆</span>
          开发历程
          <span className="section-icon">◆</span>
        </h2>
        <div className="section-line"></div>
      </div>
      <div className="section-subtitle">
        DEVELOPMENT TIMELINE // JOURNEY LOG
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {sortedGames.map((game, index) => (
          <div
            key={game.id}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="timeline-dot">
              <span className="timeline-icon">{game.icon}</span>
            </div>

            <div className="timeline-card">
              <div className="timeline-header">
                <span className="timeline-date">{game.date}</span>
                <span className="timeline-jam">{game.jam}</span>
              </div>

              <h3 className="timeline-title">{game.title}</h3>

              <p className="timeline-desc">{game.description}</p>

              <div className="timeline-tags">
                {game.tags.map(tag => (
                  <span key={tag} className="timeline-tag">{tag}</span>
                ))}
              </div>

              {Object.keys(game.links).length > 0 && (
                <div className="timeline-links">
                  {Object.entries(game.links).map(([type, url]) => (
                    <a
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-link"
                    >
                      <span className="link-icon">{getLinkIcon(type)}</span>
                      <span className="link-label">{getLinkLabel(type)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
