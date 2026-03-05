import { useState } from 'react'
import PostCard from './PostCard'
import { posts, categories } from '../data/posts'

export default function PostList() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredPosts = activeCategory === 'all'
    ? posts.filter(post => post.status === 'published')
    : posts.filter(post => post.category === activeCategory && post.status === 'published')

  return (
    <section id="posts" className="section posts-section">
      <div className="section-container">
        <h2 className="section-title cassette-title">
          <span className="cassette-label">BLOG</span>
          <span className="title-text">博客文章</span>
        </h2>

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
            <p>暂无文章</p>
          </div>
        )}
      </div>
    </section>
  )
}
