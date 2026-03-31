import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import '../styles/ArticleEditor.css'

export default function ArticleEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'project',
    category: '游戏项目',
    tags: [],
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 分钟'
  })
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      loadArticle()
    }
  }, [id])

  const loadArticle = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/posts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setFormData({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          type: data.type || 'project',
          category: data.category || '游戏项目',
          tags: data.tags || [],
          status: data.status || 'draft',
          date: data.date || new Date().toISOString().split('T')[0],
          readTime: data.readTime || '5 分钟'
        })
      }
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t)
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      
      const articleData = {
        ...formData,
        author: user?.username || 'admin',
        updatedAt: new Date().toISOString()
      }
      
      const url = isEdit 
        ? `/api/admin/articles/${id}`
        : '/api/admin/articles'
      
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      })
      
      if (res.ok) {
        alert(isEdit ? '文章已更新！' : '文章已创建！')
        navigate('/admin')
      } else {
        const error = await res.json()
        alert('保存失败：' + (error.error || '未知错误'))
      }
    } catch (error) {
      console.error('保存文章失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="editor-page">
        <Header />
        <div className="editor-loading">加载中...</div>
      </div>
    )
  }

  return (
    <div className="editor-page">
      <Header />
      <div className="editor-container">
        <div className="editor-header">
          <button onClick={() => navigate('/admin')} className="back-btn">
            ← 返回管理后台
          </button>
          <h1>{isEdit ? '编辑文章' : '新建文章'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>标题 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="输入文章标题"
            />
          </div>

          <div className="form-group">
            <label>摘要 *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              placeholder="简短的文章摘要"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>类型 *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="project">游戏项目</option>
                <option value="devlog">开发日志</option>
                <option value="tech">技术分享</option>
                <option value="design">设计</option>
                <option value="life">生活</option>
              </select>
            </div>

            <div className="form-group">
              <label>分类 *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="如：游戏项目"
              />
            </div>

            <div className="form-group">
              <label>状态 *</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>标签（用逗号分隔）</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="如：游戏，开发，测试"
            />
          </div>

          <div className="form-group">
            <label>内容 *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              placeholder="使用 Markdown 格式编写文章内容"
              className="content-editor"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin')} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? '保存中...' : (isEdit ? '更新文章' : '创建文章')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
