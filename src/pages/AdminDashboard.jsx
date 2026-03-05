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
          <h1>📝 博客管理后台</h1>
          <span className="admin-user">👤 {user.username}</span>
        </div>
        <div className="admin-header-right">
          <button onClick={handleBack} className="admin-btn">
            📋 文章列表
          </button>
          <button onClick={handleCreate} className="admin-btn admin-btn-primary">
            ✨ 新建文章
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
