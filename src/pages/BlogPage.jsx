import PostList from '../components/PostList'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { BookIcon } from '../components/icons/SiteIcons'

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="blog-page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <BookIcon size={40} color="#06b6d4" />
            </span>
            <span className="title-text">思维碎片</span>
          </h1>
          <p className="page-subtitle">THOUGHT FRAGMENTS - 开发日志 · 技术分享 · 生活随笔</p>
        </div>
        <PostList />
      </main>
      <Footer />
    </>
  )
}
