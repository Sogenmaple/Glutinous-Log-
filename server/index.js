import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const JWT_SECRET = 'tangyuan-blog_secret_key_2026'

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

// 启动服务器
initDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  })
})
