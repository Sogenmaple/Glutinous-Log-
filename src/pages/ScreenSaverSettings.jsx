import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { TangyuanIcon } from '../components/icons/SiteIcons'
import '../styles/ScreenSaverSettings.css'

/**
 * 屏保设置页面
 * 可预览、选择屏保样式，设置激活时间等
 */
export default function ScreenSaverSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    enabled: true,
    timeout: 5, // 分钟
    style: 'tangyuan', // 屏保样式
    showClock: false,
    showHint: true
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [saved, setSaved] = useState(false)

  // 加载设置
  useEffect(() => {
    const saved = localStorage.getItem('screensaver_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  // 保存设置
  const handleSave = () => {
    localStorage.setItem('screensaver_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 屏保样式选项
  const screensaverStyles = [
    {
      id: 'tangyuan',
      name: '汤圆头像',
      description: '经典汤圆头像 + 旋转光环',
      icon: TangyuanIcon,
      color: 'amber',
      available: true
    },
    {
      id: 'particles',
      name: '粒子流动',
      description: '彩色粒子漂浮效果',
      icon: TangyuanIcon,
      color: 'cyan',
      available: false,
      comingSoon: true
    },
    {
      id: 'clock',
      name: '数字时钟',
      description: '复古风格数字时钟',
      icon: TangyuanIcon,
      color: 'purple',
      available: false,
      comingSoon: true
    },
    {
      id: 'matrix',
      name: '代码雨',
      description: '黑客帝国风格代码雨',
      icon: TangyuanIcon,
      color: 'green',
      available: false,
      comingSoon: true
    }
  ]

  // 时间选项
  const timeoutOptions = [
    { value: 1, label: '1 分钟' },
    { value: 3, label: '3 分钟' },
    { value: 5, label: '5 分钟' },
    { value: 10, label: '10 分钟' },
    { value: 15, label: '15 分钟' },
    { value: 30, label: '30 分钟' },
    { value: 0, label: '永不激活' }
  ]

  return (
    <div className="screensaver-settings-page">
      <Header />
      
      <div className="settings-container">
        {/* 页面标题 */}
        <div className="settings-header">
          <h1>
            <TangyuanIcon size={32} color="#ff9500" />
            屏保设置
          </h1>
          <p>自定义屏保样式和激活规则</p>
        </div>

        {/* 预览区域 */}
        <div className="preview-section">
          <div className="preview-header">
            <h3>实时预览</h3>
            <button 
              className="preview-btn"
              onClick={() => setPreviewMode(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              全屏预览
            </button>
          </div>
          
          <div className="preview-window">
            <div className="preview-content tangyuan-style">
              <TangyuanIcon size={80} color="#ff9500" />
              <div className="preview-ring"></div>
              <h4>汤圆的小窝</h4>
              <p>屏保预览效果</p>
            </div>
          </div>
        </div>

        {/* 屏保样式选择 */}
        <div className="settings-section">
          <h3>屏保样式</h3>
          <div className="style-grid">
            {screensaverStyles.map(style => {
              const IconComponent = style.icon
              const isSelected = settings.style === style.id
              
              return (
                <div 
                  key={style.id}
                  className={`style-card ${isSelected ? 'selected' : ''} ${!style.available ? 'disabled' : ''}`}
                  onClick={() => style.available && setSettings({...settings, style: style.id})}
                >
                  <div className={`style-icon ${style.color}`}>
                    <IconComponent size={32} color="currentColor" />
                  </div>
                  <div className="style-info">
                    <h4>{style.name}</h4>
                    <p>{style.description}</p>
                  </div>
                  {style.comingSoon && (
                    <span className="coming-soon-tag">即将推出</span>
                  )}
                  {isSelected && style.available && (
                    <span className="selected-tag">已选择</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 激活时间设置 */}
        <div className="settings-section">
          <h3>激活时间</h3>
          <div className="setting-item">
            <label>无操作后激活</label>
            <select 
              value={settings.timeout}
              onChange={(e) => setSettings({...settings, timeout: Number(e.target.value)})}
              disabled={!settings.enabled}
            >
              {timeoutOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
        </div>

        {/* 显示选项 */}
        <div className="settings-section">
          <h3>显示选项</h3>
          <div className="setting-item">
            <label>显示时钟</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="show-clock"
                checked={settings.showClock}
                onChange={(e) => setSettings({...settings, showClock: e.target.checked})}
              />
              <label htmlFor="show-clock"></label>
            </div>
          </div>
          
          <div className="setting-item">
            <label>显示退出提示</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="show-hint"
                checked={settings.showHint}
                onChange={(e) => setSettings({...settings, showHint: e.target.checked})}
              />
              <label htmlFor="show-hint"></label>
            </div>
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

      {/* 预览覆盖层 */}
      {previewMode && (
        <div className="preview-overlay" onClick={() => setPreviewMode(false)}>
          <div className="preview-fullscreen tangyuan-style">
            <TangyuanIcon size={120} color="#ff9500" />
            <div className="fullscreen-ring"></div>
            <h1>汤圆的小窝</h1>
            <p>点击任意位置退出预览</p>
          </div>
        </div>
      )}
    </div>
  )
}
