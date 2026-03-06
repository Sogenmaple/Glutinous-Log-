import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import { types } from '../data/posts'
import { getTypeIcon } from './icons/TypeIcons'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://36.151.149.117:3001/api/posts')
      const data = await response.json()
      console.log('获取到的文章:', data)
      setPosts(data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 动态获取分类
  const categories = [
    { id: 'all', name: '全部', count: posts.filter(p => p.status === 'published').length },
    ...Array.from(new Set(posts.filter(p => p.status === 'published').map(p => p.category)))
      .map(cat => ({ id: cat, name: cat, count: posts.filter(p => p.category === cat && p.status === 'published').length }))
  ]

  const filteredPosts = posts.filter(post => {
    if (post.status !== 'published') return false
    if (activeCategory !== 'all' && post.category !== activeCategory) return false
    if (activeType !== 'all' && post.type !== activeType) return false
    return true
  })

  if (loading) {
    return (
      <section id="posts" className="section posts-section">
        <div className="section-container">
          <h2 className="section-title cassette-title">
            <span className="cassette-label">BLOG</span>
            <span className="title-text">博客 & 项目</span>
          </h2>
          <div className="loading">加载中...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="posts" className="section posts-section">
      <div className="section-container">
        <h2 className="section-title cassette-title">
          <span className="cassette-label">BLOG</span>
          <span className="title-text">博客 & 项目</span>
        </h2>

        {/* 类型筛选 */}
        <div className="type-filter">
          {types.map((type) => (
            <button
              key={type.id}
              className={`type-btn ${activeType === type.id ? 'active' : ''}`}
              onClick={() => setActiveType(type.id)}
            >
              {type.id !== 'all' && getTypeIcon(type.id, 16)}
              {type.name}
            </button>
          ))}
        </div>

        {/* 分类筛选 */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
              <span className="count">{category.count}</span>
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="empty-state">
            <p>暂无内容</p>
          </div>
        )}
      </div>
    </section>
  )
}
