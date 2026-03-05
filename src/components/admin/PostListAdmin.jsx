import { useState, useEffect } from 'react'
import { getTypeIcon } from '../icons/TypeIcons'

export default function PostListAdmin({ onEdit }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  if (loading) return <div className="loading">加载中...</div>

  return (
    <div className="post-list-admin">
      <div className="posts-table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>类型</th>
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <span className="post-type-icon">
                    {getTypeIcon(post.type, 20)}
                  </span>
                </td>
                <td className="post-title-cell">{post.title}</td>
                <td>{post.category}</td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    <span className="status-indicator"></span>
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td>{post.date || post.createdAt?.split('T')[0]}</td>
                <td className="actions">
                  <button onClick={() => onEdit(post)} className="btn-edit">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="btn-delete">
                    删除
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
