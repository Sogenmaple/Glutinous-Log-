import { useState, useEffect } from 'react'
import { getTypeIcon } from '../icons/TypeIcons'

export default function PostListAdmin({ onEdit }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 筛选和搜索
  const filteredPosts = posts.filter(post => {
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchTitle = post.title.toLowerCase().includes(term)
      const matchContent = post.content?.toLowerCase().includes(term)
      const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(term))
      if (!matchTitle && !matchContent && !matchTags) return false
    }
    
    // 类型筛选
    if (filterType !== 'all' && post.type !== filterType) return false
    
    // 状态筛选
    if (filterStatus !== 'all' && post.status !== filterStatus) return false
    
    return true
  })

  // 统计
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length
  }

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">加载文章中...</div>
    </div>
  )

  return (
    <div className="post-list-admin">
      {/* 统计卡片 */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总文章数</div>
        </div>
        <div className="stat-card published">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">已发布</div>
        </div>
        <div className="stat-card draft">
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">草稿</div>
        </div>
      </div>

      {/* 筛选工具栏 */}
      <div className="filter-toolbar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="搜索文章标题、内容或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-search">
              ×
            </button>
          )}
        </div>

        <div className="filter-group">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部类型</option>
            <option value="project">游戏项目</option>
            <option value="devlog">开发日志</option>
            <option value="tech">技术分享</option>
            <option value="design">设计笔记</option>
            <option value="life">生活随笔</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>

      {/* 文章表格 */}
      <div className="posts-table-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{marginBottom: '1rem', opacity: 0.5}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <div>没有找到符合条件的文章</div>
            {searchTerm && (
              <button onClick={() => {setSearchTerm(''); setFilterType('all'); setFilterStatus('all');}} className="btn-reset">
                清除筛选
              </button>
            )}
          </div>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>标题</th>
                <th>分类</th>
                <th>标签</th>
                <th>状态</th>
                <th>日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <span className="post-type-icon">
                      {getTypeIcon(post.type, 20)}
                    </span>
                  </td>
                  <td className="post-title-cell">
                    <div className="title-text">{post.title}</div>
                    {post.excerpt && (
                      <div className="title-excerpt">{post.excerpt.slice(0, 60)}...</div>
                    )}
                  </td>
                  <td>
                    <span className="category-badge">{post.category}</span>
                  </td>
                  <td>
                    <div className="tags-cell">
                      {post.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="mini-tag">{tag}</span>
                      ))}
                      {post.tags?.length > 3 && (
                        <span className="more-tags">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      <span className="status-indicator"></span>
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td>{post.date || post.createdAt?.split('T')[0]}</td>
                  <td className="actions">
                    <button onClick={() => onEdit(post)} className="btn-edit" title="编辑">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="btn-delete" title="删除">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 结果统计 */}
      {filteredPosts.length > 0 && (
        <div className="result-info">
          显示 {filteredPosts.length} / {posts.length} 篇文章
        </div>
      )}
    </div>
  )
}
