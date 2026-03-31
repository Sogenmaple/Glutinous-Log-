import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { UserIcon, LockIcon, MailIcon, SettingsIcon, ReturnIcon, CheckIcon } from '../components/icons/SiteIcons'
import '../styles/Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const timerRef = useRef(null)
  
  // 从 sessionStorage 读取或初始化状态
  const getSavedState = (key, defaultValue) => {
    try {
      const saved = sessionStorage.getItem(`profile_${key}`)
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue
    }
  }
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(() => getSavedState('activeTab', 'profile'))
  const [previewAvatar, setPreviewAvatar] = useState(null)
  
  const [formData, setFormData] = useState(() => getSavedState('formData', {
    displayName: '',
    bio: '',
    avatar: ''
  }))
  
  const [passwordStep, setPasswordStep] = useState(1) // 1: 邮箱验证，2: 设置新密码
  const [passwordForm, setPasswordForm] = useState(() => getSavedState('passwordForm', {
    currentPassword: '',
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  }))
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verified, setVerified] = useState(false)
  
  const [message, setMessage] = useState({ type: '', text: '' })
  const [error, setError] = useState('')
  const [sendingCode, setSendingCode] = useState(false)

  // 保存状态到 sessionStorage
  useEffect(() => {
    sessionStorage.setItem('profile_activeTab', JSON.stringify(activeTab))
  }, [activeTab])
  
  useEffect(() => {
    sessionStorage.setItem('profile_formData', JSON.stringify(formData))
  }, [formData])
  
  useEffect(() => {
    sessionStorage.setItem('profile_passwordForm', JSON.stringify(passwordForm))
  }, [passwordForm])

  // 加载用户资料
  useEffect(() => {
    loadProfile()
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setFormData(prev => ({
          displayName: data.displayName || data.username,
          bio: data.bio || '',
          avatar: data.avatar || ''
        }))
        setPasswordForm(prev => ({
          ...prev,
          email: data.email || ''
        }))
        if (data.avatar) {
          setPreviewAvatar(data.avatar)
          
          // 同步更新 localStorage 中的头像
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
          if (currentUser) {
            currentUser.avatar = data.avatar
            localStorage.setItem('user', JSON.stringify(currentUser))
          }
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
      setMessage({ type: 'error', text: '图片大小不能超过 5MB (´･ω･`) ' })
      return
    }

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      if (response.ok) {
        const data = await response.json()
        const fullAvatarUrl = data.url.startsWith('http') ? data.url : data.url
        setFormData(prev => ({ ...prev, avatar: fullAvatarUrl }))
        setPreviewAvatar(fullAvatarUrl)
        
        // 更新 localStorage 中的用户头像 - 确保完整更新 user 对象
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (currentUser && currentUser.id) {
          currentUser.avatar = fullAvatarUrl
          localStorage.setItem('user', JSON.stringify(currentUser))
          console.log('Profile: 已更新 localStorage 头像:', fullAvatarUrl)
        } else {
          console.log('Profile: localStorage 中 user 对象不完整，尝试从服务器重新加载')
          // 重新加载用户信息
          loadProfile()
        }
        
        // 触发自定义事件，通知 Header 组件更新
        window.dispatchEvent(new CustomEvent('avatar-updated'))
        console.log('Profile: 已触发 avatar-updated 事件')
        
        setMessage({ type: 'success', text: '头像上传成功！(≧∇≦) ﾉ' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || '上传失败 (´；ω；`)' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: '上传失败 (´；ω；`)' })
    }
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!passwordForm.email) {
      setError('请先输入邮箱 (´･ω･`)')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(passwordForm.email)) {
      setError('邮箱格式不正确 (´･ω･`)')
      return
    }

    setSendingCode(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: passwordForm.email, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        setPasswordStep(2)
        setCountdown(60)
        
        timerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        setMessage({ type: 'success', text: '验证码已发送到邮箱，请查收～ (≧∇≦) ﾉ' })
      } else {
        setError(data.error || '发送失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setSendingCode(false)
    }
  }

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!passwordForm.code) {
      setError('请输入验证码 (´･ω･`)')
      return
    }

    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: passwordForm.email, code: passwordForm.code, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
        setPasswordStep(3)
        setMessage({ type: 'success', text: '验证成功！(≧∇≦) ﾉ' })
      } else {
        setError(data.error || '验证失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    }
  }

  // 保存个人资料
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
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
        
        // 确保头像信息也更新到 localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (currentUser && formData.avatar) {
          currentUser.avatar = formData.avatar
        }
        localStorage.setItem('user', JSON.stringify(currentUser))
        
        // 触发头像更新事件
        window.dispatchEvent(new CustomEvent('avatar-updated'))
        
        setMessage({ type: 'success', text: '保存成功！(≧∇≦) ﾉ' })
      } else {
        const error = await response.json()
        setError(error.message || '保存失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  // 修改密码 - 步骤 1: 验证当前密码
  const handleVerifyCurrentPassword = async () => {
    if (!passwordForm.currentPassword) {
      setError('请输入当前密码 (´･ω･`)')
      return
    }

    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/verify-current-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordStep(2)
        setMessage({ type: 'success', text: '当前密码验证成功，请验证邮箱～ (≧∇≦) ﾉ' })
      } else {
        setError(data.error || '当前密码错误 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setSaving(false)
    }
  }

  // 修改密码 - 步骤 3: 提交新密码
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!verified) {
      setError('请先验证邮箱 (´･ω･`)')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('两次输入的新密码不一致 (´･ω･`)')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密码长度至少为 6 位 (´･ω･`)')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          newPassword: passwordForm.newPassword,
          email: passwordForm.email,
          code: passwordForm.code
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '密码修改成功！(≧∇≦) ﾉ' })
        setPasswordForm({ currentPassword: '', email: user?.email || '', code: '', newPassword: '', confirmPassword: '' })
        setPasswordStep(1)
        setCodeSent(false)
        setVerified(false)
        sessionStorage.removeItem('profile_passwordForm')
      } else {
        const error = await response.json()
        setError(error.message || '修改失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  // 清除 sessionStorage
  const clearSessionStorage = () => {
    sessionStorage.removeItem('profile_activeTab')
    sessionStorage.removeItem('profile_formData')
    sessionStorage.removeItem('profile_passwordForm')
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>加载中... (´･ω･`)</p>
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
                    <UserIcon size={48} color="#000000" />
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
              {user?.role === 'admin' ? '管理员 (★^O^★)' : '玩家 (≧∇≦) ﾉ'}
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('profile')
                clearSessionStorage()
              }}
            >
              <UserIcon size={18} />
              <span>个人资料</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('security')
                setPasswordForm(prev => ({ ...prev, email: user?.email || '' }))
              }}
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
              {/* 步骤指示器 */}
              <div className="steps-indicator">
                <div className={`step ${passwordStep >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <span>验证邮箱</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${passwordStep >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <span>设置新密码</span>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">修改密码</h3>
                
                {/* 步骤 1: 邮箱验证 */}
                {passwordStep === 1 && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        <MailIcon size={16} />
                        邮箱地址
                      </label>
                      <div className="input-with-btn">
                        <input
                          type="email"
                          className="form-input"
                          value={passwordForm.email}
                          onChange={(e) => setPasswordForm({ ...passwordForm, email: e.target.value })}
                          disabled={codeSent}
                        />
                        <button
                          type="button"
                          className="send-code-btn"
                          onClick={handleSendCode}
                          disabled={sendingCode || countdown > 0}
                        >
                          {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                        </button>
                      </div>
                    </div>

                    {codeSent && (
                      <div className="form-group">
                        <label className="form-label">
                          <CheckIcon size={16} />
                          验证码
                        </label>
                        <div className="input-with-btn">
                          <input
                            type="text"
                            className="form-input"
                            value={passwordForm.code}
                            onChange={(e) => setPasswordForm({ ...passwordForm, code: e.target.value })}
                            maxLength="6"
                            placeholder="请输入 6 位验证码"
                          />
                          <button
                            type="button"
                            className={`verify-btn ${verified ? 'verified' : ''}`}
                            onClick={handleVerifyCode}
                            disabled={verified}
                          >
                            {verified ? '✓ 已验证' : '验证'}
                          </button>
                        </div>
                      </div>
                    )}

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="save-btn"
                        onClick={() => verified && setPasswordStep(2)}
                        disabled={!verified}
                      >
                        <CheckIcon size={18} />
                        {verified ? '验证成功，继续设置密码' : '请先验证邮箱'}
                      </button>
                    </div>
                  </>
                )}

                {/* 步骤 2: 设置新密码 */}
                {passwordStep === 2 && (
                  <>
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
                      />
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="save-btn secondary"
                        onClick={() => setPasswordStep(1)}
                      >
                        <ReturnIcon size={18} />
                        返回验证邮箱
                      </button>
                      <button 
                        type="submit" 
                        className="save-btn" 
                        disabled={saving || !verified}
                      >
                        <LockIcon size={18} />
                        {saving ? '修改中...' : '确认修改'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
