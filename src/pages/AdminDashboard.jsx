import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostEditor from '../components/admin/PostEditor'
import PostListAdmin from '../components/admin/PostListAdmin'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('list') // 'list' | 'create' | 'edit'
  const [editingPost, setEditingPost] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      navigate('/admin/login')
      return
    }
    
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setView('edit')
  }

  const handleCreate = () => {
    setEditingPost(null)
    setView('create')
  }

  const handleBack = () => {
    setView('list')
    setEditingPost(null)
  }

  if (!user) return null

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.5rem'}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            博客管理后台
          </h1>
          <span className="admin-user">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {user.username}
          </span>
        </div>
        <div className="admin-header-right">
          <button onClick={handleBack} className="admin-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            文章列表
          </button>
          <button onClick={handleCreate} className="admin-btn admin-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新建文章
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-danger">
            退出登录
          </button>
        </div>
      </header>

      <main className="admin-main">
        {view === 'list' && (
          <PostListAdmin onEdit={handleEdit} />
        )}
        {(view === 'create' || view === 'edit') && (
          <PostEditor post={editingPost} onBack={handleBack} />
        )}
      </main>
    </div>
  )
}
