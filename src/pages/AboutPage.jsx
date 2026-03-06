import About from '../components/About'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { UserIcon } from '../components/icons/SiteIcons'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <UserIcon size={40} color="#bd00ff" />
            </span>
            <span className="title-text">关于汤圆</span>
          </h1>
          <p className="page-subtitle">ABOUT ME - 独立游戏开发者，创意实现者</p>
        </div>
        <About />
      </main>
      <Footer />
    </>
  )
}
