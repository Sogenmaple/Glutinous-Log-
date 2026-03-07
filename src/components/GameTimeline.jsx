import { games } from '../data/games'

export default function GameTimeline() {
  // 按时间正序排序（从旧到新，精确到年月日）
  const sortedGames = [...games].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })

  const renderVectorIcon = (type) => {
    switch (type) {
      case 'dimension':
        return (
          <svg className="vector-icon icon-dimension" viewBox="0 0 44 44">
            <rect x="8" y="8" width="28" height="28" fill="none" stroke="var(--cyan)" strokeWidth="2.5" transform="rotate(45 22 22)" />
            <rect x="12" y="12" width="20" height="20" fill="none" stroke="var(--cyan)" strokeWidth="2.5" transform="rotate(-45 22 22)" />
          </svg>
        )
      case 'antimatter':
        return (
          <svg className="vector-icon icon-antimatter" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="16" fill="none" stroke="var(--purple)" strokeWidth="3" />
            <circle cx="22" cy="22" r="7" fill="var(--purple)" opacity="0.8" />
          </svg>
        )
      case 'soundwave':
        return (
          <svg className="vector-icon icon-soundwave" viewBox="0 0 44 44">
            <rect x="12" y="6" width="6" height="32" fill="var(--cyan)" rx="2" />
            <rect x="26" y="11" width="6" height="22" fill="var(--cyan)" rx="2" />
          </svg>
        )
      case 'blocks':
        return (
          <svg className="vector-icon icon-blocks" viewBox="0 0 44 44">
            <rect x="8" y="8" width="18" height="18" fill="none" stroke="var(--amber)" strokeWidth="2.5" rx="2" />
            <rect x="18" y="18" width="18" height="18" fill="none" stroke="var(--amber)" strokeWidth="2.5" rx="2" />
          </svg>
        )
      case 'bubble':
        return (
          <svg className="vector-icon icon-bubble" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="14" fill="none" stroke="var(--cyan)" strokeWidth="3" />
            <circle cx="16" cy="16" r="4" fill="var(--cyan)" opacity="0.5" />
          </svg>
        )
      case 'fist':
        return (
          <svg className="vector-icon icon-fist" viewBox="0 0 44 44">
            <rect x="10" y="12" width="24" height="26" fill="var(--amber)" rx="6" />
            <rect x="6" y="18" width="32" height="6" fill="var(--amber-dim)" rx="2" />
          </svg>
        )
      case 'code':
        return (
          <svg className="vector-icon icon-code" viewBox="0 0 44 44">
            <path d="M14 14 L8 22 L14 30" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 14 L36 22 L30 30" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="24" y1="10" x2="20" y2="34" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )
      case 'go':
        return (
          <svg className="vector-icon icon-go" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--cyan)" strokeWidth="2" />
            <circle cx="22" cy="14" r="4" fill="var(--cyan)" />
            <circle cx="16" cy="26" r="4" fill="none" stroke="var(--cyan)" strokeWidth="2" />
            <circle cx="28" cy="26" r="4" fill="none" stroke="var(--cyan)" strokeWidth="2" />
          </svg>
        )
      case 'chess':
        return (
          <svg className="vector-icon icon-chess" viewBox="0 0 44 44">
            <rect x="10" y="10" width="24" height="24" fill="none" stroke="var(--purple)" strokeWidth="2" />
            <line x1="10" y1="18" x2="34" y2="18" stroke="var(--purple)" strokeWidth="1.5" />
            <line x1="10" y1="26" x2="34" y2="26" stroke="var(--purple)" strokeWidth="1.5" />
            <line x1="18" y1="10" x2="18" y2="34" stroke="var(--purple)" strokeWidth="1.5" />
            <line x1="26" y1="10" x2="26" y2="34" stroke="var(--purple)" strokeWidth="1.5" />
          </svg>
        )
      default:
        return (
          <svg className="vector-icon" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="12" fill="none" stroke="var(--amber)" strokeWidth="2" />
          </svg>
        )
    }
  }

  const renderLinkIcon = (type) => {
    switch (type) {
      case 'gmhub':
        return (
          <svg className="link-icon-svg" viewBox="0 0 24 24">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        )
      case 'bilibili':
        return (
          <svg className="link-icon-svg" viewBox="0 0 24 24">
            <path d="M19.07 16.03c.67.92 1.41 1.81 2.43 2.43.57.35 1.17.61 1.68 1.03.77.63.83 1.78.09 2.42-.71.61-1.74.51-2.53.07-.82-.46-1.51-1.12-2.12-1.82-3.31 1.62-7.24 1.62-10.55 0-.61.7-1.3 1.36-2.12 1.82-.79.44-1.82.54-2.53-.07-.74-.64-.68-1.79.09-2.42.51-.42 1.11-.68 1.68-1.03 1.02-.62 1.76-1.51 2.43-2.43H3V11h18v5.03h-1.93zM7.5 13c-.83 0-1.5-.67-1.5-1.5S6.67 10 7.5 10s1.5.67 1.5 1.5S8.33 13 7.5 13zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 10 16.5 10s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        )
      case 'taptap':
        return (
          <svg className="link-icon-svg" viewBox="0 0 24 24">
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
        )
      default:
        return (
          <svg className="link-icon-svg" viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        )
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
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
        {sortedGames.map((game, index) => {
          const isLeft = index % 2 === 0
          return (
            <div
              key={game.id}
              className="timeline-item"
            >
              <div className="timeline-dot">
                {renderVectorIcon(game.iconType)}
              </div>

              <div className="timeline-details">
                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
                
                <span className="timeline-date">{formatDate(game.date)}</span>
                
                <h3 className="timeline-title">
                  {game.title}
                  {game.status === 'development' && (
                    <span className="timeline-status">开发中</span>
                  )}
                </h3>

                <p className="timeline-desc">{game.description}</p>

                {game.tags.length > 0 && (
                  <div className="timeline-tags">
                    {game.tags.map(tag => (
                      <span key={tag} className="timeline-tag">{tag}</span>
                    ))}
                  </div>
                )}

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
                        {renderLinkIcon(type)}
                        <span className="link-label">{type.toUpperCase()}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
