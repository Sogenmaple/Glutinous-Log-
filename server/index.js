import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { sendVerificationCode, verifyCode } from './services/emailService.js'
import { 
  initLeaderboardFile,
  getGameLeaderboard, 
  submitScore, 
  getUserRank,
  deleteLeaderboardEntry,
  clearGameLeaderboard 
} from './services/leaderboardService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'tangyuan-blog_secret_key_2026_change_in_production'

// 文件上传配置
const UPLOAD_DIR = path.join(__dirname, '../uploads')
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.access(UPLOAD_DIR)
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
    }
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'))
    }
  }
})

// 中间件
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 数据文件路径
const DATA_DIR = path.join(__dirname, '../src/data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const POSTS_FILE = path.join(DATA_DIR, 'posts-data.json')

// 初始化数据文件
async function initDataFiles() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
  
  try {
    await fs.access(USERS_FILE)
  } catch {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const defaultAdmin = {
      id: 'admin',
      username: 'admin',
      email: 'admin@tangyuan.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    }
    await fs.writeFile(USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf-8')
    console.log('✓ 默认管理员账户已创建 (admin/admin123)')
  }
  
  try {
    await fs.access(POSTS_FILE)
  } catch {
    await fs.writeFile(POSTS_FILE, JSON.stringify([], null, 2))
  }
}

// 认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: '未授权' })
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' })
    }
    req.user = user
    next()
  })
}

// ============ 认证路由 ============

// 注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请填写所有必填项' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少为 6 位' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    
    const existingUser = users.find(u => u.username === username)
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    
    const existingEmail = users.find(u => u.email === email)
    if (existingEmail) {
      return res.status(400).json({ error: '邮箱已被注册' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ error: '注册失败' })
  }
})

// 登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    const user = users.find(u => u.username === username)
    
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '登录失败' })
  }
})

// 游客登录
app.post('/api/guest-login', async (req, res) => {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    
    // 生成游客用户名
    const guestUsername = `Guest_${Date.now().toString(36).toUpperCase()}`
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 创建游客用户
    const guestUser = {
      id: guestId,
      username: guestUsername,
      email: `${guestUsername}@guest.local`,
      password: '',
      role: 'guest',
      displayName: guestUsername,
      bio: '游客用户',
      avatar: '',
      createdAt: new Date().toISOString()
    }
    
    // 保存到用户列表
    users.push(guestUser)
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    const token = jwt.sign(
      { id: guestUser.id, username: guestUser.username, role: guestUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.json({
      message: '游客登录成功',
      token,
      user: {
        id: guestUser.id,
        username: guestUser.username,
        email: guestUser.email,
        role: guestUser.role,
        displayName: guestUser.displayName
      }
    })
  } catch (error) {
    console.error('游客登录错误:', error)
    res.status(500).json({ error: '游客登录失败' })
  }
})

// ============ 文章路由 ============

// 获取所有文章
app.get('/api/posts', async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    res.json(posts)
  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ error: '获取文章失败' })
  }
})

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    // 兼容数字和字符串 ID
    const postId = req.params.id
    const post = posts.find(p => String(p.id) === postId)
    
    if (!post) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    res.json(post)
  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ error: '获取文章失败' })
  }
})

// 创建文章（需要认证）
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    
    const newPost = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    posts.push(newPost)
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    
    res.status(201).json(newPost)
  } catch (error) {
    console.error('创建文章错误:', error)
    res.status(500).json({ error: '创建文章失败' })
  }
})

// 更新文章（需要认证）
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    const index = posts.findIndex(p => p.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    posts[index] = {
      ...posts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    res.json(posts[index])
  } catch (error) {
    console.error('更新文章错误:', error)
    res.status(500).json({ error: '更新文章失败' })
  }
})

// 删除文章（需要认证）
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    const index = posts.findIndex(p => p.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    posts.splice(index, 1)
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文章错误:', error)
    res.status(500).json({ error: '删除文章失败' })
  }
})

// ============ 用户管理路由（仅管理员）===========

// 获取所有用户（需要管理员权限）
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    
    // 移除密码信息
    users = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }))
    
    res.json(users)
  } catch (error) {
    console.error('获取用户列表错误:', error)
    res.status(500).json({ error: '获取用户列表失败' })
  }
})

// 删除用户（需要管理员权限）
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    // 不能删除自己
    if (users[index].username === req.user.username) {
      return res.status(400).json({ error: '不能删除自己的账户' })
    }
    
    users.splice(index, 1)
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除用户错误:', error)
    res.status(500).json({ error: '删除用户失败' })
  }
})

// 更新用户角色（需要管理员权限）
app.put('/api/users/:id/role', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' })
    }
    
    const { role } = req.body
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    users[index].role = role
    users[index].updatedAt = new Date().toISOString()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    res.json({ message: '角色更新成功', user: users[index] })
  } catch (error) {
    console.error('更新用户角色错误:', error)
    res.status(500).json({ error: '更新用户角色失败' })
  }
})

// ============ 文件上传 ============

// 上传图片
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' })
    }
    
    const imageUrl = `/uploads/${req.file.filename}`
    res.json({
      message: '上传成功',
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    })
  } catch (error) {
    console.error('上传错误:', error)
    res.status(500).json({ error: error.message || '上传失败' })
  }
})

// ============ 验证码路由 ============

// 发送注册验证码
app.post('/api/send-code', async (req, res) => {
  try {
    const { email, type } = req.body
    
    if (!email) {
      return res.status(400).json({ error: '邮箱不能为空' })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' })
    }
    
    // 检查邮箱是否已存在（仅注册时）
    if (type === 'register') {
      const usersData = await fs.readFile(USERS_FILE, 'utf-8')
      const users = JSON.parse(usersData)
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        return res.status(400).json({ error: '该邮箱已被注册' })
      }
    }
    
    const result = await sendVerificationCode(email, type || 'register')
    
    if (result.success) {
      res.json({ message: '验证码已发送', expires: 300 })
    } else {
      res.status(500).json({ error: result.error || '发送失败' })
    }
  } catch (error) {
    console.error('发送验证码错误:', error)
    res.status(500).json({ error: '发送失败' })
  }
})

// 验证验证码
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code, type } = req.body
    
    if (!email || !code) {
      return res.status(400).json({ error: '邮箱和验证码不能为空' })
    }
    
    const result = await verifyCode(email, code, type || 'register')
    
    if (result.success) {
      res.json({ message: '验证成功' })
    } else {
      res.status(400).json({ error: result.error })
    }
  } catch (error) {
    console.error('验证错误:', error)
    res.status(500).json({ error: '验证失败' })
  }
})

// 重置密码
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: '邮箱和新密码不能为空' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: '密码长度至少为 6 位' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.email === email)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    // 更新密码
    users[index].password = await bcrypt.hash(newPassword, 10)
    users[index].updatedAt = new Date().toISOString()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    console.log(`✓ 密码已重置：${email}`)
    res.json({ message: '密码重置成功' })
  } catch (error) {
    console.error('重置密码错误:', error)
    res.status(500).json({ error: '重置失败' })
  }
})

// ============ 管理员路由 ============

// 管理员中间件
function authenticateAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next()
    } else {
      res.status(403).json({ error: '需要管理员权限' })
    }
  })
}

// 获取管理概览
app.get('/api/admin/overview', authenticateAdmin, async (req, res) => {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    
    // 读取文章数据
    let totalPosts = 0
    try {
      const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
      const posts = JSON.parse(postsData)
      totalPosts = posts.length
    } catch (e) {
      totalPosts = 0
    }
    
    // 计算总访问量（从文章阅读量累加）
    let totalViews = 0
    try {
      const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
      const posts = JSON.parse(postsData)
      totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
    } catch (e) {
      totalViews = 0
    }
    
    res.json({
      totalUsers: users.length,
      onlineUsers: Math.floor(Math.random() * 10) + 1,
      totalPosts: totalPosts,
      totalViews: totalViews,
      uptime: '正常运行中'
    })
  } catch (error) {
    console.error('获取概览错误:', error)
    res.status(500).json({ error: '获取概览失败' })
  }
})

// 获取所有用户
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    
    const userList = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt
    }))
    
    res.json({ users: userList })
  } catch (error) {
    console.error('获取用户列表错误:', error)
    res.status(500).json({ error: '获取用户列表失败' })
  }
})

// 更新用户角色
app.put('/api/admin/users/:userId/role', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === userId)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    users[index].role = role
    users[index].updatedAt = new Date().toISOString()
    
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    res.json({ message: '角色更新成功' })
  } catch (error) {
    console.error('更新角色错误:', error)
    res.status(500).json({ error: '更新角色失败' })
  }
})

// 删除用户
app.delete('/api/admin/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === userId)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    // 不允许删除自己
    if (userId === req.user.id) {
      return res.status(400).json({ error: '不能删除自己的账户' })
    }
    
    users.splice(index, 1)
    
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    res.json({ message: '用户删除成功' })
  } catch (error) {
    console.error('删除用户错误:', error)
    res.status(500).json({ error: '删除用户失败' })
  }
})

// 获取所有文章
app.get('/api/admin/articles', authenticateAdmin, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    
    res.json({ articles: posts || [] })
  } catch (error) {
    console.error('获取文章列表错误:', error)
    res.json({ articles: [] })
  }
})

// 获取单篇文章（管理员）
app.get('/api/admin/articles/:articleId', authenticateAdmin, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    const post = posts.find(p => p.id === req.params.articleId)
    if (!post) {
      return res.status(404).json({ error: '文章不存在' })
    }
    res.json(post)
  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ error: '获取文章失败' })
  }
})

// 创建文章（管理员）
app.post('/api/admin/articles', authenticateAdmin, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    
    const newPost = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    posts.push(newPost)
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    
    console.log(`✓ 文章已创建：${newPost.title}`)
    res.status(201).json(newPost)
  } catch (error) {
    console.error('创建文章错误:', error)
    res.status(500).json({ error: '创建文章失败' })
  }
})

// 更新文章（管理员）
app.put('/api/admin/articles/:articleId', authenticateAdmin, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    const index = posts.findIndex(p => p.id === req.params.articleId)
    
    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    posts[index] = {
      ...posts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    }
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    console.log(`✓ 文章已更新：${posts[index].title}`)
    res.json(posts[index])
  } catch (error) {
    console.error('更新文章错误:', error)
    res.status(500).json({ error: '更新文章失败' })
  }
})

// 删除文章
app.delete('/api/admin/articles/:articleId', authenticateAdmin, async (req, res) => {
  try {
    const { articleId } = req.params
    
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    const index = posts.findIndex(p => p.id === articleId)
    
    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    posts.splice(index, 1)
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    
    res.json({ message: '文章删除成功' })
  } catch (error) {
    console.error('删除文章错误:', error)
    res.status(500).json({ error: '删除文章失败' })
  }
})

// 获取操作日志
app.get('/api/admin/logs', authenticateAdmin, async (req, res) => {
  try {
    // 模拟日志数据
    const logs = [
      { id: 1, action: '管理员登录', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
      { id: 2, action: '查看用户列表', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
      { id: 3, action: '更新用户角色', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
      { id: 4, action: '查看系统概览', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
      { id: 5, action: '刷新统计数据', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' }
    ]
    
    res.json({ logs })
  } catch (error) {
    console.error('获取日志错误:', error)
    res.status(500).json({ error: '获取日志失败' })
  }
})

// 获取统计数据
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    
    res.json({
      totalUsers: users.length,
      totalPosts: 0,
      totalGames: 5,
      popularGames: [
        { name: '飞扬的小鸟', plays: Math.floor(Math.random() * 5000) + 1000 },
        { name: '俄罗斯方块', plays: Math.floor(Math.random() * 4000) + 1000 },
        { name: '吃豆人', plays: Math.floor(Math.random() * 3000) + 1000 },
        { name: '贪吃蛇', plays: Math.floor(Math.random() * 2000) + 1000 },
        { name: '扫雷', plays: Math.floor(Math.random() * 1000) + 100 }
      ]
    })
  } catch (error) {
    console.error('获取统计数据错误:', error)
    res.status(500).json({ error: '获取统计数据失败' })
  }
})

// 验证当前密码
app.post('/api/verify-current-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword } = req.body
    
    if (!currentPassword) {
      return res.status(400).json({ error: '请输入当前密码' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    const user = users.find(u => u.id === req.user.id)
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    const validPassword = await bcrypt.compare(currentPassword, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: '当前密码错误' })
    }
    
    res.json({ message: '验证成功' })
  } catch (error) {
    console.error('验证当前密码错误:', error)
    res.status(500).json({ error: '验证失败' })
  }
})

// ============ 个人资料路由 ============

// 获取当前用户资料
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    const user = users.find(u => u.id === req.user.id)
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || null,
      displayName: user.displayName || user.username,
      bio: user.bio || '',
      role: user.role,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error('获取资料错误:', error)
    res.status(500).json({ error: '获取资料失败' })
  }
})

// 更新个人资料
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === req.user.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    if (displayName) users[index].displayName = displayName
    if (bio !== undefined) users[index].bio = bio
    if (avatar) users[index].avatar = avatar
    
    users[index].updatedAt = new Date().toISOString()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    res.json({
      message: '更新成功',
      user: {
        id: users[index].id,
        username: users[index].username,
        email: users[index].email,
        displayName: users[index].displayName,
        bio: users[index].bio,
        avatar: users[index].avatar,
        role: users[index].role
      }
    })
  } catch (error) {
    console.error('更新资料错误:', error)
    res.status(500).json({ error: '更新失败' })
  }
})

// 修改密码
app.put('/api/profile/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '请填写所有必填项' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新密码长度至少为 6 位' })
    }
    
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    let users = JSON.parse(usersData)
    const index = users.findIndex(u => u.id === req.user.id)
    
    if (index === -1) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    const validPassword = await bcrypt.compare(currentPassword, users[index].password)
    if (!validPassword) {
      return res.status(401).json({ error: '当前密码错误' })
    }
    
    users[index].password = await bcrypt.hash(newPassword, 10)
    users[index].updatedAt = new Date().toISOString()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    
    res.json({ message: '密码修改成功' })
  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({ error: '修改失败' })
  }
})

// ============ 游戏排行榜 API ============

// 获取用户头像辅助函数
async function getUserAvatar(userId) {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf-8')
    const users = JSON.parse(usersData)
    const user = users.find(u => u.id === userId)
    return user ? (user.avatar || null) : null
  } catch {
    return null
  }
}

// 获取游戏排行榜
app.get('/api/leaderboard/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params
    const { limit = 10 } = req.query
    const leaderboard = await getGameLeaderboard(gameId, parseInt(limit))
    
    // 为每个排行榜条目添加头像
    const leaderboardWithAvatars = await Promise.all(
      leaderboard.map(async (entry) => ({
        ...entry,
        avatar: await getUserAvatar(entry.userId)
      }))
    )
    
    res.json({ success: true, data: leaderboardWithAvatars })
  } catch (error) {
    console.error('获取排行榜错误:', error)
    res.status(400).json({ error: error.message })
  }
})

// 提交游戏分数
app.post('/api/leaderboard/:gameId/score', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params
    const { score } = req.body
    
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: '无效的分数' })
    }
    
    const result = await submitScore(gameId, req.user.id, req.user.username, score)
    res.json(result)
  } catch (error) {
    console.error('提交分数错误:', error)
    res.status(400).json({ error: error.message })
  }
})

// 获取用户排名
app.get('/api/leaderboard/:gameId/rank', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params
    const rank = await getUserRank(gameId, req.user.id)
    if (rank) {
      // 添加用户头像
      const avatar = req.user.avatar || null
      res.json({ success: true, data: { ...rank, avatar, userId: req.user.id } })
    } else {
      res.json({ success: true, data: null })
    }
  } catch (error) {
    console.error('获取排名错误:', error)
    res.status(400).json({ error: error.message })
  }
})

// 管理员：删除排行榜记录
app.delete('/api/leaderboard/:gameId/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' })
    }
    
    const { gameId, userId } = req.params
    const success = await deleteLeaderboardEntry(gameId, userId)
    res.json({ success })
  } catch (error) {
    console.error('删除记录错误:', error)
    res.status(400).json({ error: error.message })
  }
})

// 管理员：清空游戏排行榜
app.delete('/api/leaderboard/:gameId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '权限不足' })
    }
    
    const { gameId } = req.params
    const success = await clearGameLeaderboard(gameId)
    res.json({ success })
  } catch (error) {
    console.error('清空排行榜错误:', error)
    res.status(400).json({ error: error.message })
  }
})

// ============ ovo 聊天 API ============

// ovo 聊天接口（无需认证，只读）
app.post('/api/ovo-chat', async (req, res) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '消息不能为空' })
    }

    const apiKey = process.env.DASHSCOPE_API_KEY
    const baseUrl = process.env.DASHSCOPE_BASE_URL || 'https://coding.dashscope.aliyuncs.com/v1'

    if (!apiKey) {
      return res.status(500).json({ error: '服务器未配置 AI 服务' })
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen3.5-plus',
        messages: [
          { role: 'system', content: '你是汤圆的小窝里的 AI 助手，名叫 ovo。你温暖、友好、略带调皮。用简洁的方式回答用户问题。【重要】你只能输出纯文本，绝对不能生成图片、不要输出任何图片链接或 Markdown 图片语法。不要使用任何 emoji 表情符号或特殊图标字符。' },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
        temperature: 0.8,
        enable_thinking: false
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DashScope API 错误:', response.status, errText)
      return res.status(502).json({ error: 'AI 服务响应异常' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，我没有收到回复'

    res.json({ reply })
  } catch (error) {
    console.error('ovo 聊天错误:', error)
    res.status(500).json({ error: '请求失败，请稍后重试' })
  }
})

// 启动服务器
initDataFiles().then(() => {
  initLeaderboardFile()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 服务器运行在 http://0.0.0.0:${PORT}`)
  })
})
