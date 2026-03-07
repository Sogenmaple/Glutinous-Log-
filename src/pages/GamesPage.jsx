import GameShowcase from '../components/GameShowcase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { GameIcon } from '../components/icons/SiteIcons'

export default function GamesPage() {
  // 开发历程数据 - 留存文字信息
  const developmentHistory = [
    { date: '2024.07.06', jam: 'CiGA 2024', title: '渡维', desc: '在多维空间之间穿梭，解开维度谜题', tags: ['CiGA', '维度', '解谜'], links: { gmhub: 'https://gmhub.com', bilibili: 'https://bilibili.com' } },
    { date: '2025.06.29', jam: 'CiGA 2025', title: '反物环', desc: '逆转物质循环，构建能量回路', tags: ['CiGA', '物理', '益智'], links: { gmhub: 'https://gmhub.com' } },
    { date: '2025.08.09', jam: 'Mini Jam 232', title: '泡泡战士', desc: '发射泡泡，困住敌人', tags: ['Mini Jam', '动作', '射击'], links: { gmhub: 'https://gmhub.com' } },
    { date: '2025.08.23', jam: 'Mini Jam 234', title: '出拳哥', desc: '用拳头解决一切', tags: ['Mini Jam', '格斗', '动作'], links: { gmhub: 'https://gmhub.com' } },
    { date: '2025.09.06', jam: 'Code Jam', title: '代码世界', desc: '在代码世界中构建逻辑', tags: ['Code Jam', '编程', '解谜'], links: { gmhub: 'https://gmhub.com' } },
    { date: '2025.09.20', jam: 'Go Game Jam', title: '围棋之旅', desc: '黑白子的策略对决', tags: ['Go Jam', '棋类', '策略'], links: { gmhub: 'https://gmhub.com' } },
    { date: '2025.10.11', jam: 'Chess Jam', title: '棋盘战术', desc: '国际象棋战术演练', tags: ['Chess Jam', '棋类', '战术'], links: { gmhub: 'https://gmhub.com' } }
  ]

  return (
    <>
      <Header />
      <main className="games-page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <GameIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">汤圆的游戏宇宙</span>
          </h1>
          <p className="page-subtitle">TANGYUAN'S GAME UNIVERSE · 穿越时空的互动体验</p>
        </div>
        
        {/* 开发历程 - 纯文字信息 */}
        <section className="dev-history-section">
          <h2 className="section-title-simple">开发历程</h2>
          <p className="section-subtitle-simple">DEVELOPMENT HISTORY // JOURNEY LOG</p>
          <div className="dev-history-list">
            {developmentHistory.map((item, index) => (
              <div key={index} className="dev-history-item">
                <span className="dev-date">{item.date}</span>
                <span className="dev-jam">{item.jam}</span>
                <h3 className="dev-title">{item.title}</h3>
                <p className="dev-desc">{item.desc}</p>
                <div className="dev-tags">
                  {item.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <GameShowcase />
      </main>
      <Footer />
    </>
  )
}
