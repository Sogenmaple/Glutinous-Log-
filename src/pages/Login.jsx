import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon, EyeIcon, EyeOffIcon, CheckIcon } from '../components/icons/SiteIcons'

/**
 * 登录页面
 */
export default function Login() {
  const navigate = useNavigate()
  const passwordRef = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [flashlightActive, setFlashlightActive] = useState(false)
  const [sourcePos, setSourcePos] = useState({ x: 0, y: 0 })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCodeSent, setResetCodeSent] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [resetCountdown, setResetCountdown] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetStep, setResetStep] = useState(1) // 1: 输入邮箱，2: 输入验证码，3: 设置新密码

  // 游客登录
  const handleGuestLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/guest-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || '游客登录失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 发送重置密码验证码
  const handleSendResetCode = async () => {
    if (!resetEmail) {
      setError('请输入邮箱地址 (´･ω･`)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setResetCodeSent(true)
        setResetStep(2)
        setResetCountdown(60)
        const timer = setInterval(() => {
          setResetCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        setError('')
      } else {
        setError(data.error || '发送失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setLoading(false)
    }
  }

  // 验证重置密码验证码
  const handleVerifyResetCode = async () => {
    if (!resetCode) {
      setError('请输入验证码 (´･ω･`)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setResetStep(3)
        setError('')
      } else {
        setError(data.error || '验证失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setLoading(false)
    }
  }

  // 重置密码
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致 (´･ω･`)')
      return
    }

    if (newPassword.length < 6) {
      setError('密码长度至少为 6 位 (´･ω･`)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setError('')
        alert('密码重置成功！请使用新密码登录喵～ (≧∇≦) ﾉ')
        setShowForgotPassword(false)
        setResetStep(1)
        setResetEmail('')
        setResetCodeSent(false)
        setResetCode('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error || '重置失败 (´；ω；`)')
      }
    } catch (err) {
      setError('网络错误，请重试 (´；ω；`)')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || '登录失败')
      }
    } catch (err) {
      setError('网络错误，请检查服务器')
    } finally {
      setLoading(false)
    }
  }

  // 更新光束位置和角度
  const updateBeam = (sourceX, sourceY, angleDeg) => {
    const cone = document.querySelector('.flashlight-cone')
    const overlay = document.querySelector('.flashlight-overlay')
    
    // 10 度夹角
    const halfAngle = 10 * Math.PI / 180
    const angleRad = (angleDeg - 180) * Math.PI / 180 // 基准是向左（180 度）
    
    // 计算光束上下边缘的角度
    const topAngle = angleRad - halfAngle
    const bottomAngle = angleRad + halfAngle
    
    // 计算左侧边界交点
    const tanTop = Math.tan(topAngle)
    const tanBottom = Math.tan(bottomAngle)
    const leftY1 = sourceY + tanTop * sourceX
    const leftY2 = sourceY + tanBottom * sourceX
    
    // 更新光束三角形
    if (cone) {
      cone.style.clipPath = `polygon(${sourceX}px ${sourceY}px, 0 ${leftY1}px, 0 ${leftY2}px)`
      
      // 定位光源点
      const source = cone.querySelector('.flashlight-source')
      if (source) {
        source.style.left = `${sourceX}px`
        source.style.top = `${sourceY}px`
      }
      cone.classList.add('active')
    }
    
    // 更新遮罩 - 全屏反相
    if (overlay) {
      overlay.style.clipPath = 'none'
      overlay.classList.add('active')
    }
  }

  // 手电筒查看密码
  const togglePasswordView = () => {
    // 如果忘记密码模态框打开中，不激活手电筒效果
    if (showForgotPassword) {
      return
    }
    
    const newState = !showPassword
    setShowPassword(newState)
    
    if (newState) {
      // 激活手电筒效果
      setFlashlightActive(true)
      
      // 精确定位到眼睛图标
      setTimeout(() => {
        const toggleBtn = document.querySelector('.password-toggle')
        if (toggleBtn) {
          const rect = toggleBtn.getBoundingClientRect()
          const sourceX = rect.left + rect.width / 2
          const sourceY = rect.top + rect.height / 2
          setSourcePos({ x: sourceX, y: sourceY })
          
          // 初始光束角度（水平向左）
          updateBeam(sourceX, sourceY, 180)
        }
      }, 50)
    } else {
      // 关闭手电筒效果
      setFlashlightActive(false)
    }
  }

  // 打开忘记密码模态框时，关闭手电筒效果
  useEffect(() => {
    if (showForgotPassword) {
      setShowPassword(false)
      setFlashlightActive(false)
    }
  }, [showForgotPassword])

  // 鼠标移动处理
  useEffect(() => {
    if (!flashlightActive) return
    
    const handleMouseMove = (e) => {
      // 计算鼠标相对于光源的角度
      const dx = e.clientX - sourcePos.x
      const dy = e.clientY - sourcePos.y
      
      // 计算角度（相对于水平向左，反转 Y 轴使方向正确）
      let angle = Math.atan2(-dy, -dx) * 180 / Math.PI
      
      // 限制在±5 度范围内（相对于水平向左 180 度）
      if (angle < 0) angle += 360
      let relativeAngle = angle - 180
      if (relativeAngle < -180) relativeAngle += 360
      if (relativeAngle > 180) relativeAngle -= 360
      if (relativeAngle < -5) relativeAngle = -5
      if (relativeAngle > 5) relativeAngle = 5
      
      updateBeam(sourcePos.x, sourcePos.y, 180 + relativeAngle)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [flashlightActive, sourcePos])

  return (
    <div className={`auth-page ${flashlightActive ? 'inverted' : ''}`}>
      <div className="auth-bg-grid"></div>
      <div className="auth-bg-glow"></div>

      {/* 手电筒效果 */}
      {flashlightActive && (
        <>
          <div className="flashlight-overlay active"></div>
          <div className="flashlight-cone active">
            <div className="flashlight-source"></div>
          </div>
        </>
      )}

      <div className="auth-container">
        <div className="auth-card">
          <div className="corner-decor corner-tl"></div>
          <div className="corner-decor corner-tr"></div>
          <div className="corner-decor corner-bl"></div>
          <div className="corner-decor corner-br"></div>
          
          <div className="auth-header">
            <div className="auth-icon">
              <LoginIcon size={64} color="#000000" />
            </div>
            <h1 className="auth-title">欢迎回来</h1>
            <p className="auth-subtitle">LOGIN TO TANGYUAN'S WORLD</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">用户名</label>
              <div className="form-input-wrapper">
                <UserIcon size={20} color="#666666" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="password-container">
                <div className="form-input-wrapper">
                  <LockIcon size={20} color="#666666" />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordView}
                  tabIndex={-1}
                  title="手电筒查看密码"
                />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </button>
            
            <button 
              type="button" 
              className="auth-btn" 
              onClick={handleGuestLogin}
              style={{ background: '#f5f5f5 !important', marginTop: '0.5rem' }}
            >
              游客登录
            </button>
            
            <div className="auth-form-footer">
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={() => setShowForgotPassword(true)}
              >
                忘记密码？
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <span>还没有账号？</span>
            <Link to="/register" className="auth-link">立即注册</Link>
          </div>
        </div>
      </div>

      {/* 忘记密码模态框 */}
      {showForgotPassword && (
        <div className="auth-modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h2>忘记密码</h2>
              <button className="auth-modal-close" onClick={() => setShowForgotPassword(false)}>×</button>
            </div>
            
            <div className="auth-modal-body">
              {/* 步骤 1: 输入邮箱 */}
              {resetStep === 1 && (
                <>
                  <p style={{ marginBottom: '1rem', color: '#666' }}>请输入您的注册邮箱，我们将发送验证码喵～</p>
                  <div className="form-group">
                    <label className="form-label">邮箱地址</label>
                    <div className="form-input-wrapper">
                      <MailIcon size={20} color="#666666" />
                      <input
                        type="email"
                        className="form-input"
                        placeholder="请输入邮箱"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <div className="form-error">{error}</div>}
                  <button 
                    className="auth-btn" 
                    onClick={handleSendResetCode}
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                  >
                    {loading ? '发送中...' : '发送验证码'}
                  </button>
                </>
              )}

              {/* 步骤 2: 输入验证码 */}
              {resetStep === 2 && (
                <>
                  <p style={{ marginBottom: '1rem', color: '#666' }}>验证码已发送到 {resetEmail} 喵～</p>
                  <div className="form-group">
                    <label className="form-label">验证码</label>
                    <div className="form-input-wrapper">
                      <CheckIcon size={20} color="#666666" />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="请输入 6 位验证码"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        maxLength="6"
                      />
                    </div>
                  </div>
                  {resetCountdown > 0 && (
                    <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                      {resetCountdown}秒后可重新发送
                    </p>
                  )}
                  {error && <div className="form-error">{error}</div>}
                  <button 
                    className="auth-btn" 
                    onClick={handleVerifyResetCode}
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                  >
                    {loading ? '验证中...' : '验证'}
                  </button>
                </>
              )}

              {/* 步骤 3: 设置新密码 */}
              {resetStep === 3 && (
                <>
                  <p style={{ marginBottom: '1rem', color: '#666' }}>验证成功！请设置新密码喵～</p>
                  <div className="form-group">
                    <label className="form-label">新密码</label>
                    <div className="form-input-wrapper">
                      <LockIcon size={20} color="#666666" />
                      <input
                        type="password"
                        className="form-input"
                        placeholder="请输入新密码（至少 6 位）"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">确认新密码</label>
                    <div className="form-input-wrapper">
                      <LockIcon size={20} color="#666666" />
                      <input
                        type="password"
                        className="form-input"
                        placeholder="请再次输入新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <div className="form-error">{error}</div>}
                  <button 
                    className="auth-btn" 
                    onClick={handleResetPassword}
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                  >
                    {loading ? '重置中...' : '确认重置'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
