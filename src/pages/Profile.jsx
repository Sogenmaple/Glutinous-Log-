import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { UserIcon, LockIcon, MailIcon } from '../components/icons/SiteIcons'
import '../styles/Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [previewAvatar, setPreviewAvatar] = useState(null)
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatar: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [message, setMessage] = useState({ type: '', text: '' })
  const [error, setError] = useState('')

  // 加载用户资料
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('http://36.151.149.117:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setFormData({
          displayName: data.displayName || data.username,
          bio: data.bio || '',
          avatar: data.avatar || ''
        })
        if (data.avatar) {
          setPreviewAvatar(data.avatar)
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    } catch (err) {
      setError('加载失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 处理头像上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '图片大小不能超过 5MB' })
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://36.151.149.117:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, avatar: data.url }))
        setPreviewAvatar(data.url)
        setMessage({ type: 'success', text: '头像上传成功' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || '上传失败' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: '上传失败' })
    }
  }

  // 保存个人资料
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://36.151.149.117:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setMessage({ type: 'success', text: '保存成功' })
      } else {
        const error = await response.json()
        setError(error.message || '保存失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  // 修改密码
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('两次输入的新密码不一致')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密码长度至少为 6 位')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://36.151.149.117:3001/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '密码修改成功' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        setError(error.message || '修改失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Header />
      
      <div className="tape-bg"></div>
      <div className="tape-grid"></div>
      <div className="tape-scanlines"></div>

      <div className="profile-container">
        {/* 左侧用户卡片 */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="user-card-header">
              <div className="avatar-wrapper" onClick={handleAvatarClick}>
                {previewAvatar ? (
                  <img src={previewAvatar} alt="头像" className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">
                    <UserIcon size={48} color="#ff9500" />
                  </div>
                )}
                <div className="avatar-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <h2 className="user-name">{user?.displayName || user?.username}</h2>
              <p className="user-email">{user?.email}</p>
            </div>

            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-value">{user?.id?.slice(-6) || 'N/A'}</span>
                <span className="stat-label">用户 ID</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{new Date(user?.createdAt).toLocaleDateString('zh-CN')}</span>
                <span className="stat-label">注册日期</span>
              </div>
            </div>

            <div className="user-role-badge">
              {user?.role === 'admin' ? '👑 管理员' : '🎮 玩家'}
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <UserIcon size={18} />
              <span>个人资料</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <LockIcon size={18} />
              <span>账户安全</span>
            </button>
          </nav>
        </aside>

        {/* 右侧内容区 */}
        <main className="profile-content">
          <div className="profile-header">
            <h1>{activeTab === 'profile' ? '个人资料' : '账户安全'}</h1>
            <p className="profile-subtitle">
              {activeTab === 'profile' ? '管理您的个人信息和偏好设置' : '保护您的账户安全'}
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          {/* 个人资料表单 */}
          {activeTab === 'profile' && (
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-section">
                <h3 className="section-title">基本信息</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">显示名称</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="您的显示名称"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">邮箱</label>
                    <input
                      type="email"
                      className="form-input"
                      value={user?.email || ''}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                    <span className="form-hint">邮箱不可修改，如需更改请联系管理员</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">个人简介</label>
                  <textarea
                    className="form-textarea"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="介绍一下自己吧..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  {saving ? '保存中...' : '保存更改'}
                </button>
              </div>
            </form>
          )}

          {/* 账户安全表单 */}
          {activeTab === 'security' && (
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-section">
                <h3 className="section-title">修改密码</h3>
                
                <div className="form-group">
                  <label className="form-label">
                    <LockIcon size={16} />
                    当前密码
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="请输入当前密码"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <LockIcon size={16} />
                    新密码
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="请输入新密码（至少 6 位）"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <LockIcon size={16} />
                    确认新密码
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="请再次输入新密码"
                    required
                  />
                </div>

                {error && <div className="form-error">{error}</div>}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {saving ? '修改中...' : '修改密码'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
