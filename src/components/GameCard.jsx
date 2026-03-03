export default function GameCard({ game, index }) {
  const statusMap = {
    released: '已发布',
    dev: '开发中',
    prototype: '原型',
  }

  return (
    <div className="game-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="card-screen">
        <div className="card-screen-content">
          <div className="card-icon">{game.icon}</div>
        </div>
        <div className="card-scanline"></div>
      </div>
      <div className="card-info">
        <div className="card-header">
          <span className="card-index">#{String(index + 1).padStart(2, '0')}</span>
          <span className="card-year">{game.year}</span>
        </div>
        <h3 className="card-title">{game.title}</h3>
        <p className="card-desc">{game.description}</p>
        <div className="card-tags">
          {game.tags.map(tag => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
        <div className="card-footer">
          <span className="card-engine">⬡ {game.engine}</span>
          <span className={`card-status card-status--${game.status}`}>
            {statusMap[game.status]}
          </span>
        </div>
      </div>
    </div>
  )
}
