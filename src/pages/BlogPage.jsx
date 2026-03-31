import PostList from '../components/PostList'
import Header from '../components/Header'
import { BookIcon } from '../components/icons/SiteIcons'
import '../styles/MangaBlog.css'

/**
 * 博客页面 - 黄黑漫画风格
 */
export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="manga-blog-page manga-page">
        <div className="manga-page-header">
          <h1 className="manga-page-title">
            <span className="manga-title-icon">
              <BookIcon size={40} />
            </span>
            <span className="manga-title-text">汤圆的博客</span>
          </h1>
          <p className="manga-page-subtitle">TANGYUAN'S BLOG - 开发日志 · 技术分享 · 生活随笔</p>
        </div>
        <PostList />
      </main>
    </>
  )
}
