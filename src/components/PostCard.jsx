import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function PostCard({ post }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <article
      ref={ref}
      className={`post-card cassette-card ${isVisible ? 'visible' : ''}`}
    >
      {/* 卡片装饰角 */}
      <div className="card-corner corner-tl"></div>
      <div className="card-corner corner-tr"></div>
      <div className="card-corner corner-bl"></div>
      <div className="card-corner corner-br"></div>

      {/* 内容区域 */}
      <div className="post-content">
        {/* 头部信息 */}
        <div className="post-header">
          <span className="post-category">{post.category}</span>
          <span className="post-date">{post.date}</span>
        </div>

        {/* 标题 */}
        <h3 className="post-title">{post.title}</h3>

        {/* 摘要 */}
        <p className="post-excerpt">{post.excerpt}</p>

        {/* 标签 */}
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="post-footer">
          <span className="read-time">⏱ {post.readTime}</span>
          {post.team && (
            <span className="team-badge">👥 {post.team}</span>
          )}
        </div>
      </div>

      {/* 阅读更多按钮 */}
      <button className="read-more-btn">
        <span>阅读全文</span>
        <span className="arrow">→</span>
      </button>
    </article>
  )
}
