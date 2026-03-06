import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon } from '../components/icons/SiteIcons'

/**
 * 生成随机验证码
 */
function generateCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 注册页面
 */
export default function Register() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  })
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 绘制验证码
  useState(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = 100
    const height = 36
    
    // 清空画布
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(0, 0, width, height)
    
    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
    }
    
    // 绘制验证码文字
    ctx.font = 'bold 20px monospace'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < captchaCode.length; i++) {
      const x = 20 + i * 20
      const y = height / 2 + (Math.random() - 0.5) * 8
      const angle = (Math.random() - 0.5) * 0.4
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = '#ff9500'
      ctx.fillText(captchaCode[i], 0, 0)
      ctx.restore()
    }
    
    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(255,149,0,${Math.random() * 0.5})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 验证验证码
    if (formData.captcha.toUpperCase() !== captchaCode) {
      setError('验证码错误')
      setCaptchaCode(generateCaptcha())
      setFormData({ ...formData, captcha: '' })
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

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setFormData({ ...formData, captcha: '' })
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

            <div className="form-group">
              <label className="form-label">
                <span>验证码</span>
              </label>
              <div className="captcha-wrapper">
                <input
                  type="text"
                  className="form-input captcha-input"
                  placeholder="请输入验证码"
                  value={formData.captcha}
                  onChange={(e) => setFormData({ ...formData, captcha: e.target.value.toUpperCase() })}
                  required
                  maxLength={4}
                />
                <div className="captcha-canvas" onClick={refreshCaptcha} title="点击刷新">
                  <canvas ref={canvasRef} width={100} height={36}></canvas>
                </div>
              </div>
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
