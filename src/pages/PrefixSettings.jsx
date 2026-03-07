import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { TangyuanIcon } from '../components/icons/SiteIcons'
import '../styles/PrefixSettings.css'

/**
 * 风格化前缀设置页面
 * 配置 Intro 动画作为屏保效果
 */
export default function PrefixSettings() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [settings, setSettings] = useState({
    enabled: true,
    timeout: 5,
    showMatrix: true,
    showBalls: true,
    showEyes: true,
    speed: 1.0
  })
  const [saved, setSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // 加载设置
  useEffect(() => {
    const saved = localStorage.getItem('prefix_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  // 保存设置
  const handleSave = () => {
    localStorage.setItem('prefix_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 预览 Canvas 动画
  useEffect(() => {
    if (!previewMode || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    const chars = '01TGXYZWABXY'
    const fontSize = 11
    const columns = Math.floor(width / fontSize)
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const balls = [
      { x: 0.5, y: 0.5, radius: 0.12, angle: 0, speed: 0.015, orbitRadius: 0, isCenter: true },
      { x: 0.5, y: 0.5, radius: 0.08, angle: 0, speed: 0.015, orbitRadius: 0.2, isCenter: false },
    ]

    let time = 0
    const animate = () => {
      if (!previewMode) return
      
      time += settings.speed
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // 代码雨
      if (settings.showMatrix) {
        ctx.fillStyle = '#0f0'
        ctx.font = `${fontSize}px monospace`
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i] += 1
        }
      }

      // 球体
      if (settings.showBalls) {
        balls.forEach((ball) => {
          if (!ball.isCenter) {
            ball.angle += ball.speed * settings.speed
            ball.x = 0.5 + Math.cos(ball.angle) * ball.orbitRadius
            ball.y = 0.5 + Math.sin(ball.angle) * ball.orbitRadius
          }
          const x = ball.x * width
          const y = ball.y * height
          const radius = ball.radius * Math.min(width, height)
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
          gradient.addColorStop(1, 'rgba(100, 100, 100, 0.1)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // 清理
    }
  }, [previewMode, settings])

  return (
    <div className="prefix-settings-page">
      <Header />
      
      <div className="settings-container">
        {/* 页面标题 */}
        <div className="settings-header">
          <h1>
            <TangyuanIcon size={32} color="#ff9500" />
            风格化前缀
          </h1>
          <p>自定义进场动画与屏保效果</p>
        </div>

        {/* 预览区域 */}
        <div className="preview-section">
          <div className="preview-header">
            <h3>实时预览</h3>
            <button 
              className="preview-btn primary"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {previewMode ? '关闭预览' : '全屏预览'}
            </button>
          </div>
          
          <div className="preview-window">
            <canvas 
              ref={canvasRef} 
              className={`preview-canvas ${previewMode ? 'active' : ''}`}
            />
            {!previewMode && (
              <div className="preview-placeholder">
                <p>点击"全屏预览"查看动画效果</p>
              </div>
            )}
          </div>
        </div>

        {/* 动画元素开关 */}
        <div className="settings-section">
          <h3>动画元素</h3>
          <div className="setting-item">
            <label>代码雨效果</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="show-matrix"
                checked={settings.showMatrix}
                onChange={(e) => setSettings({...settings, showMatrix: e.target.checked})}
              />
              <label htmlFor="show-matrix"></label>
            </div>
          </div>
          
          <div className="setting-item">
            <label>轨道球体</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="show-balls"
                checked={settings.showBalls}
                onChange={(e) => setSettings({...settings, showBalls: e.target.checked})}
              />
              <label htmlFor="show-balls"></label>
            </div>
          </div>
          
          <div className="setting-item">
            <label>追踪眼睛</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="show-eyes"
                checked={settings.showEyes}
                onChange={(e) => setSettings({...settings, showEyes: e.target.checked})}
              />
              <label htmlFor="show-eyes"></label>
            </div>
          </div>
        </div>

        {/* 激活设置 */}
        <div className="settings-section">
          <h3>激活设置</h3>
          <div className="setting-item">
            <label>无操作后激活</label>
            <select 
              value={settings.timeout}
              onChange={(e) => setSettings({...settings, timeout: Number(e.target.value)})}
              disabled={!settings.enabled}
            >
              <option value={0}>永不激活</option>
              <option value={1}>1 分钟</option>
              <option value={3}>3 分钟</option>
              <option value={5}>5 分钟</option>
              <option value={10}>10 分钟</option>
              <option value={15}>15 分钟</option>
              <option value={30}>30 分钟</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>启用屏保</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="enable-screensaver"
                checked={settings.enabled}
                onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
              />
              <label htmlFor="enable-screensaver"></label>
            </div>
          </div>
          
          <div className="setting-item">
            <label>动画速度</label>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              value={settings.speed}
              onChange={(e) => setSettings({...settings, speed: Number(e.target.value)})}
              className="speed-slider"
            />
            <span className="speed-value">{settings.speed.toFixed(1)}x</span>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="settings-actions">
          <button className="btn-secondary" onClick={() => navigate('/special')}>
            取消
          </button>
          <button className={`btn-primary ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                已保存
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                </svg>
                保存设置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
