import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { SnakeIcon } from '../components/icons/SiteIcons'
import '../styles/MangaGames.css'

/**
 * 游戏宇宙 - 只保留贪吃蛇
 * compact 模式：无 Header/Footer，用于桌面窗口内嵌
 */
export default function GamesPage({ compact = false }) {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const games = [
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典益智游戏，控制蛇吃掉所有食物，注意不要撞到自己',
      icon: SnakeIcon,
      path: '/special/snake',
      tags: ['休闲', '经典', '挑战']
    }
  ]

  const content = (
    <div className="manga-games-page">
      {!compact && <><div className="manga-halftone"></div><div className="manga-concentration"></div></>}
      <div className="manga-container">
        <header className="manga-masthead">
          <div className="manga-masthead-top">
            <span className="manga-issue">VOL.2024.NO.12</span>
            <span className="manga-date">
              {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="manga-main-title">
            <h1 className="manga-title-cn">小游戏</h1>
            <span className="manga-title-en">MINI GAMES</span>
          </div>
          <div className="manga-tagline">
            <span>RETRO GAMES</span>
            <span className="manga-sep">◆</span>
            <span>PIXEL ART</span>
            <span className="manga-sep">◆</span>
            <span>INFINITE FUN</span>
          </div>
        </header>
        <div className="manga-games-grid">
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <div key={game.id} className="manga-game-card wide" onClick={() => navigate(game.path)}>
                <div className="manga-corner tl"></div>
                <div className="manga-corner tr"></div>
                <div className="manga-corner bl"></div>
                <div className="manga-corner br"></div>
                <span className="manga-status">PLAYABLE</span>
                <div className="manga-card-icon"><IconComponent size={48} /></div>
                <div className="manga-card-content">
                  <h3 className="manga-card-title-cn">{game.title}</h3>
                  <span className="manga-card-title-en">{game.subtitle}</span>
                  <div className="manga-divider"></div>
                  <p className="manga-card-desc">{game.description}</p>
                  <div className="manga-tags">
                    {game.tags.map((tag, i) => (<span key={i} className="manga-tag">{tag}</span>))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {!compact && (
          <footer className="manga-footer">
            <div className="manga-footer-content">
              <div className="manga-footer-line">
                <span>EST.2024</span>
                <span className="manga-sep">◆</span>
                <span>MADE WITH ♥ BY TANGYUAN</span>
                <span className="manga-sep">◆</span>
                <span>ALL RIGHTS RESERVED</span>
              </div>
              <div className="manga-icp">
                <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">鄂 ICP 备 2026010257 号</a>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )

  if (compact) return content

  return (
    <>
      <Header />
      {content}
    </>
  )
}
