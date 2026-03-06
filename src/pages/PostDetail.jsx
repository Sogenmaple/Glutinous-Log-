import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTypeIcon } from '../components/icons/TypeIcons'
import Header from '../components/Header'

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
      const response = await fetch(`http://36.151.149.117:3001/api/posts/${id}`)
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
      <Header />
      <div className="post-detail-wrapper">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← 返回
        </button>

        <div className="post-detail">
          <header className="post-detail-header">
            <span className="post-type-badge">
              {getTypeIcon(post.type, 16)}
              <span>{post.type === 'project' ? '项目' : post.type === 'devlog' ? '日志' : post.type === 'tech' ? '技术' : post.type === 'design' ? '设计' : '生活'}</span>
            </span>
            <span className="post-category-badge">{post.category}</span>
          </header>

          <h1 className="post-detail-title">{post.title}</h1>

          <div className="post-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {post.date}
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {post.readTime}
            </span>
            {post.author && (
              <span className="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {post.author}
              </span>
            )}
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
              <div className="post-content markdown-content">
                {renderContent(post.content)}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function renderContent(content) {
  if (!content) return null
  
  const lines = content.split('\n')
  const elements = []
  let inCodeBlock = false
  let codeLines = []
  let codeLanguage = ''

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={index} className="code-block">
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        codeLines = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLanguage = line.slice(3)
      }
      return
    }

    if (inCodeBlock) {
      codeLines.push(line)
      return
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={index}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index}>{line.slice(4)}</h3>)
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={index}>{line.slice(5)}</h4>)
    } else if (line.startsWith('- ')) {
      elements.push(<li key={index}>{line.slice(2)}</li>)
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={index}>{line.slice(2)}</blockquote>)
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={index}><strong>{line.slice(2, -2)}</strong></p>)
    } else if (line.startsWith('*') && line.endsWith('*')) {
      elements.push(<p key={index}><em>{line.slice(1, -1)}</em></p>)
    } else if (line.trim() === '---') {
      elements.push(<hr key={index} />)
    } else if (line.trim()) {
      elements.push(<p key={index}>{line}</p>)
    }
  })

  return elements
}
