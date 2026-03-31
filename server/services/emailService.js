import nodemailer from 'nodemailer'

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'your-email@qq.com',
      pass: process.env.EMAIL_PASS || 'your-auth-code'
    }
  })
}

// 生成 6 位随机验证码
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 验证码存储（生产环境建议使用 Redis）
const verificationCodes = new Map()

// 清理过期的验证码（每 10 分钟）
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of verificationCodes.entries()) {
    if (now - value.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(key)
    }
  }
}, 10 * 60 * 1000)

/**
 * 发送验证码邮件
 * @param {string} to - 收件人邮箱
 * @param {string} type - 验证码类型：register, login, reset
 * @returns {Promise<{success: boolean, code?: string, error?: string}>}
 */
export const sendVerificationCode = async (to, type = 'register') => {
  try {
    const code = generateCode()
    const key = `${type}:${to}`
    
    // 存储验证码，5 分钟过期
    verificationCodes.set(key, {
      code,
      timestamp: Date.now(),
      attempts: 0
    })

    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"汤圆的小窝" <${process.env.EMAIL_USER || 'your-email@qq.com'}>`,
      to,
      subject: type === 'register' ? '【汤圆的小窝】注册验证码' : 
               type === 'login' ? '【汤圆的小窝】登录验证码' :
               '【汤圆的小窝】重置密码验证码',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%); padding: 30px; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; }
            .code-box { background: linear-gradient(135deg, rgba(255,149,0,0.1) 0%, rgba(255,107,0,0.1) 100%); border: 2px dashed #ff9500; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 36px; font-weight: bold; color: #ff9500; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .info { color: #666; line-height: 1.8; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>(=^ェ^=) 汤圆的小窝</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">TAPE FUTURISM · CREATIVE CORNER</p>
            </div>
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">${type === 'register' ? '欢迎加入～' : type === 'login' ? '欢迎回来～' : '重置密码'}</h2>
              <p class="info">
                亲爱的玩家，您好！<br><br>
                您正在${type === 'register' ? '注册' : type === 'login' ? '登录' : '重置密码'}汤圆的小窝账号，
                请使用以下验证码完成验证：
              </p>
              <div class="code-box">
                <div class="code">${code}</div>
                <p style="color: #999; font-size: 12px; margin: 10px 0 0;">验证码 5 分钟内有效 (｡•́︿•̀｡)</p>
              </div>
              <div class="warning">
                <strong>安全提示 (｡•́︿•̀｡)：</strong><br>
                • 请勿将验证码泄露给他人<br>
                • 如非本人操作，请忽略此邮件<br>
                • 验证码 5 分钟后自动失效
              </div>
              <p class="info">
                祝您游戏愉快～ (=^ェ^=)<br>
                汤圆的小窝 团队
              </p>
            </div>
            <div class="footer">
              <p>此邮件由系统自动发送，请勿直接回复</p>
              <p>© 2024 汤圆的小窝 · All Rights Reserved</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)
    
    console.log(`✓ 验证码邮件已发送至：${to}`)
    return { success: true, code } // 开发环境返回 code，生产环境应移除
  } catch (error) {
    console.error('发送邮件失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 验证验证码
 * @param {string} to - 邮箱
 * @param {string} code - 用户输入的验证码
 * @param {string} type - 验证码类型
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyCode = async (to, code, type = 'register') => {
  const key = `${type}:${to}`
  const record = verificationCodes.get(key)
  
  if (!record) {
    return { success: false, error: '验证码不存在或已过期' }
  }
  
  if (Date.now() - record.timestamp > 5 * 60 * 1000) {
    verificationCodes.delete(key)
    return { success: false, error: '验证码已过期' }
  }
  
  if (record.attempts >= 3) {
    verificationCodes.delete(key)
    return { success: false, error: '验证次数过多，请重新获取验证码' }
  }
  
  if (record.code !== code) {
    record.attempts++
    verificationCodes.set(key, record)
    return { success: false, error: `验证码错误，还剩${3 - record.attempts}次机会` }
  }
  
  verificationCodes.delete(key)
  return { success: true }
}

/**
 * 发送短信验证码（示例，需要接入实际短信服务）
 * @param {string} phone - 手机号
 * @param {string} type - 验证码类型
 */
export const sendSMSCode = async (phone, type = 'register') => {
  const code = generateCode()
  const key = `${type}:${phone}`
  
  verificationCodes.set(key, {
    code,
    timestamp: Date.now(),
    attempts: 0
  })
  
  // TODO: 接入短信服务商（阿里云、腾讯云等）
  // 示例代码：
  // await smsClient.sendSms({
  //   PhoneNumbers: phone,
  //   SignName: '汤圆的小窝',
  //   TemplateCode: 'SMS_XXX',
  //   TemplateParam: JSON.stringify({ code })
  // })
  
  console.log(`[SMS] 验证码 ${code} 发送至 ${phone}`)
  return { success: true, code } // 开发环境
}

export default { sendVerificationCode, verifyCode, sendSMSCode }
