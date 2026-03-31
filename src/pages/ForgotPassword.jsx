import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LockIcon, MailIcon, CheckIcon, ReturnIcon } from '../components/icons/SiteIcons'

/**
 * 忘记密码页面 - 通过邮箱验证重置密码
 */
export default function ForgotPassword() {
  const navigate = useNavigate()
  const timerRef = useRef(null)
  
  const [step, setStep] = useState(1) // 1: 输入邮箱，2: 验证验证码，3: 重置密码
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
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
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
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
        body: JSON.stringify({ email: formData.email, code: formData.code, type: 'reset' })
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
        setStep(3)
      } else {
        setError(data.error || '验证失败')
      }
    } catch (err) {
      setError('网络错误，请重试')
    }
  }

  // 提交重置密码
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('密码重置成功！即将跳转到登录页面...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.error || '重置失败')
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
              <LockIcon size={64} color="#06b6d4" />
            </div>
            <h1 className="auth-title">忘记密码</h1>
            <p className="auth-subtitle">RESET PASSWORD</p>
          </div>

          {/* 步骤指示器 */}
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>验证邮箱</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>验证身份</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>重置密码</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={step === 3 ? handleResetPassword : (e) => e.preventDefault()}>
            {/* 步骤 1: 输入邮箱 */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <MailIcon size={18} />
                    <span>邮箱地址</span>
                  </label>
                  <div className="input-with-btn">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="请输入注册时的邮箱"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={sendingCode || loading}
                    />
                    <button
                      type="button"
                      className="send-code-btn"
                      onClick={handleSendCode}
                      disabled={sendingCode}
                    >
                      {sendingCode ? '发送中...' : '获取验证码'}
                    </button>
                  </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <button 
                  type="button" 
                  className="auth-btn secondary"
                  onClick={() => navigate('/login')}
                >
                  <ReturnIcon size={18} />
                  <span>返回登录</span>
                </button>
              </>
            )}

            {/* 步骤 2: 验证验证码 */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <MailIcon size={18} />
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

                <div className="form-group">
                  <label className="form-label">
                    <MailIcon size={18} />
                    <span>邮箱</span>
                  </label>
                  <div className="input-with-btn">
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      readOnly
                      disabled
                    />
                    <button
                      type="button"
                      className="send-code-btn"
                      onClick={handleSendCode}
                      disabled={sendingCode || countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
                    </button>
                  </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <button 
                  type="button" 
                  className="auth-btn secondary"
                  onClick={() => setStep(1)}
                >
                  <ReturnIcon size={18} />
                  <span>返回上一步</span>
                </button>
              </>
            )}

            {/* 步骤 3: 重置密码 */}
            {step === 3 && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <LockIcon size={18} />
                    <span>新密码</span>
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="请输入新密码（至少 6 位）"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <LockIcon size={18} />
                    <span>确认新密码</span>
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="请再次输入新密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? '重置中...' : '确认重置'}
                </button>
              </>
            )}
          </form>

          <div className="auth-footer">
            <span>想起密码了？</span>
            <Link to="/login" className="auth-link">立即登录</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
