import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/manga-common.css'
import '../styles/AdminLogin.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        const parsed = JSON.parse(user)
        if (parsed.role === 'admin') {
          navigate('/admin')
        }
      } catch { /* ignore */ }
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user.role !== 'admin') {
          setError('需要管理员权限 (´･ω･`)')
          setLoading(false)
          return
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/admin')
      } else {
        setError(data.error || '登录失败')
      }
    } catch {
      setError('网络错误，请检查服务器是否运行')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="manga-halftone"></div>
      <div className="login-wrapper">
        <div className="login-card">
          {/* 角落装饰 */}
          <div className="manga-corner tl"></div>
          <div className="manga-corner tr"></div>
          <div className="manga-corner bl"></div>
          <div className="manga-corner br"></div>

          {/* 标题 */}
          <div className="login-header">
            <div className="login-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="login-title">管理后台</h1>
            <p className="login-subtitle">ADMIN DASHBOARD</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>

            <div className="login-footer">
              <span>默认：admin / admin123</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
