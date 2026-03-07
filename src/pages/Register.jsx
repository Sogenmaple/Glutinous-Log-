import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon, CheckIcon } from '../components/icons/SiteIcons'

/**
 * 注册页面 - 带验证码
 */
export default function Register() {
  const navigate = useNavigate()
  const timerRef = useRef(null)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  })
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verified, setVerified] = useState(false)

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.email) {
      setError('请先输入邮箱')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('邮箱格式不正确')
      return
    }

    setSendingCode(true)
    setError('')

    try {
      const response = await fetch('http://36.151.149.117:3001/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'register' })
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
        setCountdown(60)
        
        // 倒计时
        timerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        // 开发环境：在控制台显示验证码
        console.log('📧 注册验证码:', data.code)
      } else {
        setError(data.error || '发送失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setSendingCode(false)
    }
  }

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!formData.code) {
      setError('请输入验证码')
      return
    }

    setError('')

    try {
      const response = await fetch('http://36.151.149.117:3001/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: formData.code, type: 'register' })
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
      } else {
        setError(data.error || '验证失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    }
  }

  // 提交注册
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!verified) {
      setError('请先验证邮箱')
      return
    }

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

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

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
                disabled={sendingCode || loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MailIcon size={18} />
                <span>邮箱</span>
              </label>
              <div className="input-with-btn">
                <input
                  type="email"
                  className="form-input"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={codeSent || sendingCode || loading}
                />
                {!codeSent ? (
                  <button
                    type="button"
                    className="send-code-btn"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                  >
                    {sendingCode ? '发送中...' : '获取验证码'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="send-code-btn disabled"
                    disabled
                  >
                    {countdown}s 后重发
                  </button>
                )}
              </div>
            </div>

            {codeSent && (
              <div className="form-group">
                <label className="form-label">
                  <CheckIcon size={18} />
                  <span>验证码</span>
                </label>
                <div className="input-with-btn">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="请输入 6 位验证码"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    maxLength="6"
                    disabled={verified || loading}
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
                disabled={!verified || loading}
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
                disabled={!verified || loading}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading || !verified}>
              {loading ? '注册中...' : verified ? '完成注册' : '请先验证邮箱'}
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
