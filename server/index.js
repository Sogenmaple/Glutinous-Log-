import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const JWT_SECRET = 'tangyuan-blog_secret_key_2026' // 生产环境应该用环境变量

// 中间件
app.use(cors())
app.use(express.json())

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
  
  // 初始化用户文件（带默认管理员）
  try {
    await fs.access(USERS_FILE)
  } catch {
    const defaultAdmin = {
      id: 'admin',
      username: 'admin',
      email: 'admin@tangyuan.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    }
    await fs.writeFile(USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf-8')
    console.log('✓ 默认管理员账户已创建 (admin/admin123)')
  }
  }
  
  try {
    await fs.access(USERS_FILE)
  } catch {
    // 创建默认管理员账户
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await fs.writeFile(USERS_FILE, JSON.stringify([{
      id: 1,
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }], null, 2))
    console.log('默认管理员账户已创建：admin / admin123')
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
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username)
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' })
    }
    
    // 检查邮箱是否已存在
    const existingEmail = users.find(u => u.email === email)
    if (existingEmail) {
      return res.status(400).json({ error: '邮箱已被注册' })
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 创建新用户
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
    
    // 生成 token
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
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ============ 文章路由 ============

// 获取所有文章（公开）
app.get('/api/posts', async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    
    // 只返回已发布的文章（非管理员可以看到草稿）
    const token = req.headers.authorization?.split(' ')[1]
    let isAdmin = false
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        isAdmin = decoded.role === 'admin'
      } catch {}
    }
    
    const visiblePosts = isAdmin ? posts : posts.filter(p => p.status === 'published')
    
    res.json(visiblePosts)
  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    const post = posts.find(p => p.id === parseInt(req.params.id))
    
    if (!post) {
      return res.status(404).json({ error: '文章不存在' })
    }
    
    res.json(post)
  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 创建文章（需要认证）
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    const posts = JSON.parse(postsData)
    
    const newPost = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: req.user.username
    }
    
    posts.unshift(newPost)
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    
    res.status(201).json(newPost)
  } catch (error) {
    console.error('创建文章错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 更新文章（需要认证）
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    const index = posts.findIndex(p => p.id === parseInt(req.params.id))
    
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
    res.status(500).json({ error: '服务器错误' })
  }
})

// 删除文章（需要认证）
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postsData = await fs.readFile(POSTS_FILE, 'utf-8')
    let posts = JSON.parse(postsData)
    posts = posts.filter(p => p.id !== parseInt(req.params.id))
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文章错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 启动服务器
initDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
    console.log(`📝 后台管理：http://localhost:5173/admin`)
    console.log(`🌐 前台网站：http://localhost:5173`)
  })
})
