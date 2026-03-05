import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`)
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">加载中...</div>
  if (!post) return <div className="not-found">文章不存在</div>

  return (
    <article className="post-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← 返回
      </button>

      <div className="post-detail">
        <header className="post-detail-header">
          <span className="post-type-badge">
            {post.type === 'project' ? '🎮 项目' : post.type === 'devlog' ? '📝 日志' : post.type === 'tech' ? '💻 技术' : post.type === 'design' ? '🎨 设计' : '☕ 生活'}
          </span>
          <span className="post-category-badge">{post.category}</span>
        </header>

        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-meta">
          <span>📅 {post.date}</span>
          <span>⏱ {post.readTime}</span>
          {post.author && <span>✍️ {post.author}</span>}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="post-detail-content">
          <p className="post-excerpt-large">{post.excerpt}</p>
          {post.content && (
            <div className="post-content">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
