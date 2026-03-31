import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { 
  AdminToolsIcon, 
  UserIcon, 
  ChartIcon, 
  SettingsIcon, 
  LockIcon,
  UnlockIcon,
  TrashIcon,
  CheckIcon,
  RefreshIcon,
  GameIcon,
  MailIcon,
  ArticleIcon,
  InfoIcon,
  ReturnIcon,
  SaveIcon,
  LoadIcon
} from '../components/icons/SiteIcons'
import '../styles/AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview | users | articles | logs | settings
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [activeTab])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      navigate('/admin/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      navigate('/')
      return
    }
    
    setUser(parsedUser)
  }

  const loadData = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    
    try {
      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUsers(data.users || [])
        }
      } else if (activeTab === 'articles') {
        const res = await fetch('/api/admin/articles', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setArticles(data.articles || [])
        }
      } else if (activeTab === 'stats') {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } else if (activeTab === 'logs') {
        const res = await fetch('/api/admin/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setLogs(data.logs || [])
        }
      } else if (activeTab === 'overview') {
        const res = await fetch('/api/admin/overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      }
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleToggleAdmin = async (userId, currentRole) => {
    const token = localStorage.getItem('token')
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ))
      }
    } catch (err) {
      console.error('更新角色失败:', err)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！(´･ω･`)')) return
    
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (err) {
      console.error('删除用户失败:', err)
    }
  }

  const handleDeleteArticle = async (articleId) => {
    if (!confirm('确定要删除此文章吗？(´･ω･`)')) return
    
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== articleId))
      }
    } catch (err) {
      console.error('删除文章失败:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="admin-dashboard-page">
      <Header />

      <div className="admin-container">
        {/* 侧边栏 */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <AdminToolsIcon size={48} color="#000000" />
            <h1>管理后台</h1>
            <p>ADMIN DASHBOARD</p>
          </div>

          <nav className="admin-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <ChartIcon size={20} />
              <span>系统概览</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <UserIcon size={20} />
              <span>用户管理</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              <ArticleIcon size={20} />
              <span>文章管理</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <InfoIcon size={20} />
              <span>操作日志</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={20} />
              <span>系统设置</span>
            </button>
          </nav>

          <div className="admin-user-info">
            <div className="user-avatar">
              <UserIcon size={32} color="#000000" />
            </div>
            <div className="user-details">
              <span className="user-name">{user.username}</span>
              <span className="user-role">管理员</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <ReturnIcon size={18} />
            </button>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="admin-main">
          <div className="admin-header">
            <h2>
              {activeTab === 'overview' && '系统概览'}
              {activeTab === 'users' && '用户管理'}
              {activeTab === 'articles' && '文章管理'}
              {activeTab === 'games' && '游戏管理'}
              {activeTab === 'stats' && '数据统计'}
              {activeTab === 'logs' && '操作日志'}
              {activeTab === 'settings' && '系统设置'}
            </h2>
            <button 
              className="refresh-btn" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshIcon size={18} className={refreshing ? 'spinning' : ''} />
              刷新
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>加载中... (´･ω･`)</p>
            </div>
          ) : (
            <>
              {/* 概览页面 */}
              {activeTab === 'overview' && (
                <OverviewTab stats={stats} />
              )}

              {/* 用户管理页面 */}
              {activeTab === 'users' && (
                <UsersTab 
                  users={users} 
                  onToggleAdmin={handleToggleAdmin}
                  onDeleteUser={handleDeleteUser}
                />
              )}

              {/* 文章管理页面 */}
              {activeTab === 'articles' && (
                <ArticlesTab 
                  articles={articles}
                  onDeleteArticle={handleDeleteArticle}
                />
              )}

              {/* 操作日志页面 */}
              {activeTab === 'logs' && (
                <LogsTab logs={logs} />
              )}

              {/* 系统设置页面 */}
              {activeTab === 'settings' && (
                <SettingsTab />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

// 概览标签页
function OverviewTab({ stats }) {
  const cards = [
    {
      title: '总用户数',
      value: stats?.totalUsers || 0,
      icon: UserIcon
    },
    {
      title: '在线用户',
      value: stats?.onlineUsers || 0,
      icon: CheckIcon
    },
    {
      title: '文章总数',
      value: stats?.totalPosts || 0,
      icon: ArticleIcon
    },
    {
      title: '总访问量',
      value: stats?.totalViews || 0,
      icon: ChartIcon
    }
  ]

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <card.icon size={32} color="#000000" />
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.title}</span>
              <span className="stat-value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-section">
        <h3>系统状态</h3>
        <div className="status-list">
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>服务器运行正常 (≧∇≦) ﾉ</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>数据库连接正常</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>邮件服务正常</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>前端服务正常</span>
          </div>
        </div>
      </div>

      <div className="overview-section">
        <h3>快速操作</h3>
        <div className="quick-actions">
          <button className="quick-action-btn">
            <ArticleIcon size={20} />
            <span>新建文章</span>
          </button>
          <button className="quick-action-btn">
            <UserIcon size={20} />
            <span>添加用户</span>
          </button>
          <button className="quick-action-btn">
            <GameIcon size={20} />
            <span>添加游戏</span>
          </button>
          <button className="quick-action-btn">
            <MailIcon size={20} />
            <span>群发邮件</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// 用户管理标签页
function UsersTab({ users, onToggleAdmin, onDeleteUser }) {
  return (
    <div className="users-tab">
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>用户 ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-id">{user.id?.slice(-8) || 'N/A'}</td>
                <td className="user-name">{user.username || user.displayName}</td>
                <td className="user-email">
                  <MailIcon size={16} />
                  {user.email}
                </td>
                <td>
                  <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                    {user.role === 'admin' ? (
                      <>
                        <LockIcon size={14} /> 管理员
                      </>
                    ) : (
                      <>
                        <UserIcon size={14} /> 用户
                      </>
                    )}
                  </span>
                </td>
                <td className="user-date">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="user-actions">
                  <button
                    className={`action-btn ${user.role === 'admin' ? 'warning' : 'success'}`}
                    onClick={() => onToggleAdmin(user.id, user.role)}
                    title={user.role === 'admin' ? '取消管理员' : '设为管理员'}
                  >
                    {user.role === 'admin' ? (
                      <UnlockIcon size={16} />
                    ) : (
                      <LockIcon size={16} />
                    )}
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => onDeleteUser(user.id)}
                    title="删除用户"
                  >
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 文章管理标签页
function ArticlesTab({ articles, onDeleteArticle }) {
  const navigate = useNavigate()
  
  const handleEdit = (articleId) => {
    navigate(`/admin/article/edit/${articleId}`)
  }
  
  return (
    <div className="articles-tab">
      <div className="articles-header">
        <button className="create-article-btn" onClick={() => navigate('/admin/article/new')}>
          <ArticleIcon size={18} />
          新建文章
        </button>
      </div>
      
      <div className="articles-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>作者</th>
              <th>分类</th>
              <th>发布时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  暂无文章 (｡•́︿•̀｡) 点击上方按钮创建第一篇吧！
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="article-id">{String(article.id).slice(-6) || 'N/A'}</td>
                  <td className="article-title">{article.title}</td>
                  <td className="article-author">{article.author || 'admin'}</td>
                  <td>
                    <span className="category-tag">{article.category || '未分类'}</span>
                  </td>
                  <td className="article-date">
                    {new Date(article.createdAt || article.date).toLocaleDateString('zh-CN')}
                  </td>
                  <td>
                    <span className={`status-badge ${article.status === 'published' ? 'published' : 'draft'}`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="article-actions">
                    <button className="action-btn primary" title="编辑" onClick={() => handleEdit(article.id)}>
                      <SaveIcon size={16} />
                    </button>
                    <button 
                      className="action-btn danger" 
                      onClick={() => onDeleteArticle(article.id)}
                      title="删除"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 操作日志标签页
function LogsTab({ logs }) {
  const sampleLogs = [
    { id: 1, action: '用户登录', user: 'admin', time: new Date().toISOString(), ip: '192.168.1.1' },
    { id: 2, action: '更新用户角色', user: 'admin', time: new Date().toISOString(), ip: '192.168.1.1' },
    { id: 3, action: '删除文章', user: 'admin', time: new Date().toISOString(), ip: '192.168.1.1' },
    { id: 4, action: '发布文章', user: 'admin', time: new Date().toISOString(), ip: '192.168.1.1' },
    { id: 5, action: '系统设置更新', user: 'admin', time: new Date().toISOString(), ip: '192.168.1.1' }
  ]

  const displayLogs = logs.length > 0 ? logs : sampleLogs

  return (
    <div className="logs-tab">
      <div className="logs-header">
        <h3>最近操作记录</h3>
        <button className="export-logs-btn">
          <LoadIcon size={16} />
          导出日志
        </button>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>操作</th>
              <th>操作人</th>
              <th>IP 地址</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs.map((log) => (
              <tr key={log.id}>
                <td className="log-time">
                  {new Date(log.time).toLocaleString('zh-CN')}
                </td>
                <td className="log-action">{log.action}</td>
                <td className="log-user">{log.user}</td>
                <td className="log-ip">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 系统设置标签页
function SettingsTab() {
  return (
    <div className="settings-tab">
      <div className="settings-section">
        <h3>网站配置</h3>
        <div className="setting-item">
          <label>网站名称</label>
          <input type="text" defaultValue="汤圆的小窝" />
        </div>
        <div className="setting-item">
          <label>网站描述</label>
          <input type="text" defaultValue="磁带未来主义风格的创意空间" />
        </div>
        <div className="setting-item">
          <label>维护模式</label>
          <div className="toggle-switch">
            <input type="checkbox" id="maintenance" />
            <label htmlFor="maintenance"></label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>安全设置</h3>
        <div className="setting-item">
          <label>注册开放</label>
          <div className="toggle-switch">
            <input type="checkbox" id="registration" defaultChecked />
            <label htmlFor="registration"></label>
          </div>
        </div>
        <div className="setting-item">
          <label>登录验证码</label>
          <div className="toggle-switch">
            <input type="checkbox" id="captcha" />
            <label htmlFor="captcha"></label>
          </div>
        </div>
        <div className="setting-item">
          <label>强制邮箱验证</label>
          <div className="toggle-switch">
            <input type="checkbox" id="email-verify" defaultChecked />
            <label htmlFor="email-verify"></label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>邮件服务</h3>
        <div className="setting-item">
          <label>SMTP 服务器</label>
          <input type="text" defaultValue="smtp.qq.com" />
        </div>
        <div className="setting-item">
          <label>发件人邮箱</label>
          <input type="email" defaultValue="ovo.hello@qq.com" />
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn">
          <CheckIcon size={18} />
          保存设置
        </button>
      </div>
    </div>
  )
}
