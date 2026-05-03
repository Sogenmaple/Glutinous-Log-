import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  ArticleIcon,
  InfoIcon,
  ReturnIcon,
  SaveIcon,
  MailIcon
} from '../components/icons/SiteIcons'
import '../styles/AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
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
      const endpointMap = {
        overview: '/api/admin/overview',
        users: '/api/admin/users',
        articles: '/api/admin/articles',
        logs: '/api/admin/logs',
        settings: '/api/admin/overview'
      }
      const endpoint = endpointMap[activeTab] || '/api/admin/overview'
      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (activeTab === 'users') setUsers(data.users || [])
        else if (activeTab === 'articles') setArticles(data.articles || [])
        else if (activeTab === 'logs') setLogs(data.logs || [])
        else setStats(data)
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

  const tabLabels = {
    overview: '系统概览',
    users: '用户管理',
    articles: '文章管理',
    logs: '操作日志',
    settings: '系统设置'
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <AdminToolsIcon size={48} color="#000000" />
            <h1>管理后台</h1>
            <p>ADMIN DASHBOARD</p>
          </div>
          <nav className="admin-nav">
            {Object.entries(tabLabels).map(([key, label]) => {
              const iconMap = {
                overview: ChartIcon,
                users: UserIcon,
                articles: ArticleIcon,
                logs: InfoIcon,
                settings: SettingsIcon
              }
              const Icon = iconMap[key]
              return (
                <button
                  key={key}
                  className={`nav-item ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>
          <div className="admin-user-info">
            <div className="user-avatar">
              <UserIcon size={32} color="#000000" />
            </div>
            <div className="user-details">
              <span className="user-name">{user.username}</span>
              <span className="user-role">管理员</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="退出登录">
              <ReturnIcon size={18} />
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <h2>{tabLabels[activeTab]}</h2>
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshIcon size={18} className={refreshing ? 'spinning' : ''} />
              刷新
            </button>
          </div>

          <div className="admin-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>加载中... (´･ω･`)</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'users' && (
                  <UsersTab
                    users={users}
                    onToggleAdmin={handleToggleAdmin}
                    onDeleteUser={handleDeleteUser}
                  />
                )}
                {activeTab === 'articles' && (
                  <ArticlesTab
                    articles={articles}
                    onDeleteArticle={handleDeleteArticle}
                  />
                )}
                {activeTab === 'logs' && <LogsTab logs={logs} />}
                {activeTab === 'settings' && <SettingsTab />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

/* ========== 子组件 ========== */

function OverviewTab({ stats }) {
  const cards = [
    { title: '总用户数', value: stats?.totalUsers || 0, icon: UserIcon },
    { title: '在线用户', value: stats?.onlineUsers || 0, icon: CheckIcon },
    { title: '文章总数', value: stats?.totalPosts || 0, icon: ArticleIcon },
    { title: '总访问量', value: stats?.totalViews || 0, icon: ChartIcon }
  ]

  return (
    <div className="tab-content">
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card">
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
          {['服务器运行正常 (≧∇≦) ﾉ', '数据库连接正常', '前端服务正常'].map((s, i) => (
            <div key={i} className="status-item">
              <span className="status-indicator online"></span>
              <span>{s}</span>
            </div>
          ))}
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
            <MailIcon size={20} />
            <span>群发邮件</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function UsersTab({ users, onToggleAdmin, onDeleteUser }) {
  return (
    <div className="tab-content">
      <div className="manga-table">
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
            {users.length === 0 ? (
              <tr><td colSpan="6" className="no-data">暂无用户数据 (｡•́︿•̀｡)</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td className="cell-id">{u.id?.slice(-8) || 'N/A'}</td>
                <td className="cell-name">{u.username || u.displayName}</td>
                <td className="cell-email">{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                    {u.role === 'admin' ? <><LockIcon size={14} /> 管理员</> : <><UserIcon size={14} /> 用户</>}
                  </span>
                </td>
                <td className="cell-date">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('zh-CN') : 'N/A'}
                </td>
                <td className="cell-actions">
                  <button
                    className={`action-btn ${u.role === 'admin' ? 'warning' : 'success'}`}
                    onClick={() => onToggleAdmin(u.id, u.role)}
                    title={u.role === 'admin' ? '取消管理员' : '设为管理员'}
                  >
                    {u.role === 'admin' ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => onDeleteUser(u.id)}
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

function ArticlesTab({ articles, onDeleteArticle }) {
  const navigate = useNavigate()

  return (
    <div className="tab-content">
      <div className="tab-header">
        <button className="btn-create" onClick={() => navigate('/admin/article/new')}>
          <ArticleIcon size={18} />
          新建文章
        </button>
      </div>
      <div className="manga-table">
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
              <tr><td colSpan="7" className="no-data">暂无文章 (｡•́︿•̀｡) 点击上方按钮创建第一篇吧！</td></tr>
            ) : articles.map((a) => (
              <tr key={a.id}>
                <td className="cell-id">{String(a.id).slice(-6) || 'N/A'}</td>
                <td className="cell-title">{a.title}</td>
                <td>{a.author || 'admin'}</td>
                <td>
                  <span className="category-tag">{a.category || '未分类'}</span>
                </td>
                <td className="cell-date">
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString('zh-CN') : 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${a.status === 'published' ? 'published' : 'draft'}`}>
                    {a.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="cell-actions">
                  <button
                    className="action-btn primary"
                    title="编辑"
                    onClick={() => navigate(`/admin/article/edit/${a.id}`)}
                  >
                    <SaveIcon size={16} />
                  </button>
                  <button
                    className="action-btn danger"
                    title="删除"
                    onClick={() => onDeleteArticle(a.id)}
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

function LogsTab({ logs }) {
  const sampleLogs = [
    { id: 1, action: '用户登录', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
    { id: 2, action: '查看用户列表', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
    { id: 3, action: '更新用户角色', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
    { id: 4, action: '查看系统概览', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' },
    { id: 5, action: '刷新统计数据', user: 'admin', time: new Date().toISOString(), ip: '127.0.0.1' }
  ]
  const display = logs.length > 0 ? logs : sampleLogs

  return (
    <div className="tab-content">
      <div className="manga-table">
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
            {display.map((log) => (
              <tr key={log.id}>
                <td className="cell-date">{new Date(log.time).toLocaleString('zh-CN')}</td>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="tab-content">
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
