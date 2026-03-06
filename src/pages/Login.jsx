import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon } from '../components/icons/SiteIcons'

/**
 * 登录页面
 */
export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('尝试登录:', formData.username)
      const response = await fetch('http://36.151.149.117:3001/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      console.log('响应状态:', response.status)
      const data = await response.json()
      console.log('响应数据:', data)

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        console.log('登录成功:', data.user.username)
        navigate('/')
      } else {
        setError(data.error || data.message || '登录失败')
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError('网络错误：' + err.message)
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
              <LoginIcon size={64} color="#ff9500" />
            </div>
            <h1 className="auth-title">汤圆的小窝</h1>
            <p className="auth-subtitle">TANGYUAN'S CREATIVE CORNER</p>
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
                <LockIcon size={18} />
                <span>密码</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>

            <div className="auth-footer">
              <span>还没有账号？</span>
              <Link to="/register" className="auth-link">立即注册</Link>
            </div>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="auth-guest">
            <Link to="/" className="guest-btn">
              游客模式
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
