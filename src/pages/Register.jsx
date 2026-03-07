import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon } from '../components/icons/SiteIcons'

/**
 * 注册页面
 */
export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://36.151.149.117:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.message || '注册失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-grid"></div>
      <div className="auth-bg-glow"></div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <LoginIcon size={64} color="#06b6d4" />
            </div>
            <h1 className="auth-title">创建账号</h1>
            <p className="auth-subtitle">JOIN TANGYUAN'S WORLD</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <UserIcon size={18} />
                <span>用户名</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MailIcon size={18} />
                <span>邮箱</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <LockIcon size={18} />
                <span>密码</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="请输入密码（至少 6 位）"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <LockIcon size={18} />
                <span>确认密码</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </button>

            <div className="auth-footer">
              <span>已有账号？</span>
              <Link to="/login" className="auth-link">立即登录</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
