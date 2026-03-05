import { useState } from 'react'
import PostCard from './PostCard'
import { posts, categories, types } from '../data/posts'
import { getTypeIcon } from './icons/TypeIcons'

export default function PostList() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')

  const filteredPosts = posts.filter(post => {
    if (post.status !== 'published') return false
    if (activeCategory !== 'all' && post.category !== activeCategory) return false
    if (activeType !== 'all' && post.type !== activeType) return false
    return true
  })

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
