import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginIcon, LockIcon, MailIcon, UserIcon, CheckIcon, EyeIcon, EyeOffIcon } from '../components/icons/SiteIcons'

/**
 * 注册页面 - 带验证码
 */
export default function Register() {
  const navigate = useNavigate()
  const timerRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [flashlightActive, setFlashlightActive] = useState(false)
  const [activePasswordField, setActivePasswordField] = useState('')
  const [sourcePos, setSourcePos] = useState({ x: 0, y: 0 })

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
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'register' })
      })

      const data = await response.json()

      if (response.ok) {
        setCodeSent(true)
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
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: formData.code, type: 'register' })
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
        setError('')
      } else {
        setError(data.error || '验证码错误')
      }
    } catch (err) {
      setError('网络错误，请重试')
    }
  }

  // 更新光束位置和角度
  const updateBeam = (sourceX, sourceY, angleDeg) => {
    const cone = document.querySelector('.flashlight-cone')
    const overlay = document.querySelector('.flashlight-overlay')
    
    const halfAngle = 10 * Math.PI / 180
    const angleRad = (angleDeg - 180) * Math.PI / 180
    
    const topAngle = angleRad - halfAngle
    const bottomAngle = angleRad + halfAngle
    const tanTop = Math.tan(topAngle)
    const tanBottom = Math.tan(bottomAngle)
    const leftY1 = sourceY + tanTop * sourceX
    const leftY2 = sourceY + tanBottom * sourceX
    
    // 更新光束三角形
    if (cone) {
      cone.style.clipPath = `polygon(${sourceX}px ${sourceY}px, 0 ${leftY1}px, 0 ${leftY2}px)`
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
  const togglePasswordView = (field) => {
    if (field === 'password') {
      const newState = !showPassword
      // 如果开启新的手电筒，先关闭另一个
      if (newState && showConfirmPassword) {
        setShowConfirmPassword(false)
      }
      setShowPassword(newState)
      setActivePasswordField(newState ? 'password' : '')
      
      if (newState) {
        setFlashlightActive(true)
        
        setTimeout(() => {
          const toggleBtn = document.querySelector('.password-toggle')
          if (toggleBtn) {
            const rect = toggleBtn.getBoundingClientRect()
            const sourceX = rect.left + rect.width / 2
            const sourceY = rect.top + rect.height / 2
            setSourcePos({ x: sourceX, y: sourceY })
            updateBeam(sourceX, sourceY, 180)
          }
        }, 50)
      } else {
        setFlashlightActive(false)
      }
    } else if (field === 'confirm') {
      const newState = !showConfirmPassword
      // 如果开启新的手电筒，先关闭另一个
      if (newState && showPassword) {
        setShowPassword(false)
      }
      setShowConfirmPassword(newState)
      setActivePasswordField(newState ? 'confirm' : '')
      
      if (newState) {
        setFlashlightActive(true)
        
        setTimeout(() => {
          const toggleBtns = document.querySelectorAll('.password-toggle')
          const toggleBtn = toggleBtns[1]
          if (toggleBtn) {
            const rect = toggleBtn.getBoundingClientRect()
            const sourceX = rect.left + rect.width / 2
            const sourceY = rect.top + rect.height / 2
            setSourcePos({ x: sourceX, y: sourceY })
            updateBeam(sourceX, sourceY, 180)
          }
        }, 50)
      } else {
        setFlashlightActive(false)
      }
    }
  }

  // 鼠标移动处理
  useEffect(() => {
    if (!flashlightActive) return
    
    const handleMouseMove = (e) => {
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

    if (!verified) {
      setError('请先验证邮箱')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || '注册失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

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
            <h1 className="auth-title">创建账号</h1>
            <p className="auth-subtitle">JOIN TANGYUAN'S WORLD</p>
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
              <label className="form-label">邮箱</label>
              <div className="form-input-wrapper">
                <MailIcon size={20} color="#666666" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">验证码</label>
              <div className="input-with-btn">
                <div className="form-input-wrapper">
                  <CheckIcon size={20} color="#666666" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="请输入验证码"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={!codeSent}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="send-code-btn"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0 || !formData.email}
                >
                  {countdown > 0 ? `${countdown}s` : (codeSent ? '重发' : '发送')}
                </button>
              </div>
              {codeSent && (
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyCode}
                  disabled={verified}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {verified ? '✓ 已验证' : '验证'}
                </button>
              )}
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
                    onFocus={() => activePasswordField === 'password' && setFlashlightActive(true)}
                    onBlur={() => activePasswordField === 'password' && setFlashlightActive(false)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordView('password')}
                  tabIndex={-1}
                  title="手电筒查看密码"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">确认密码</label>
              <div className="password-container">
                <div className="form-input-wrapper">
                  <LockIcon size={20} color="#666666" />
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onFocus={() => activePasswordField === 'confirm' && setFlashlightActive(true)}
                    onBlur={() => activePasswordField === 'confirm' && setFlashlightActive(false)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordView('confirm')}
                  tabIndex={-1}
                  title="手电筒查看密码"
                />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="auth-footer">
            <span>已有账号？</span>
            <Link to="/login" className="auth-link">立即登录</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
