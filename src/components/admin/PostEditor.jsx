import { useState, useEffect } from 'react'

export default function PostEditor({ post, onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'project',
    category: '游戏项目',
    tags: '',
    status: 'draft',
    coverImage: '',
    readTime: '5 分钟'
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        type: post.type || 'project',
        category: post.category || '游戏项目',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        status: post.status || 'draft',
        coverImage: post.coverImage || '',
        readTime: post.readTime || '5 分钟'
      })
    }
  }, [post])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const token = localStorage.getItem('token')
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toISOString().split('T')[0]
    }

    try {
      const url = post 
        ? `http://localhost:3001/api/posts/${post.id}`
        : 'http://localhost:3001/api/posts'
      
      const response = await fetch(url, {
        method: post ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        setMessage(post ? '✅ 文章已更新' : '✅ 文章已创建')
        setTimeout(() => {
          onBack()
        }, 1000)
      } else {
        const data = await response.json()
        setMessage('❌ ' + (data.error || '操作失败'))
      }
    } catch (error) {
      setMessage('❌ 网络错误')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="post-editor">
      <h2 className="editor-title">{post ? '编辑文章' : '新建文章'}</h2>
      
      {message && <div className="editor-message">{message}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label>标题 *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="文章标题"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>类型 *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="project">游戏项目</option>
              <option value="devlog">开发日志</option>
              <option value="tech">技术分享</option>
              <option value="design">设计笔记</option>
              <option value="life">生活随笔</option>
            </select>
          </div>

          <div className="form-group">
            <label>分类 *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="游戏项目">游戏项目</option>
              <option value="开发日志">开发日志</option>
              <option value="技术分享">技术分享</option>
              <option value="设计笔记">设计笔记</option>
              <option value="生活随笔">生活随笔</option>
            </select>
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
          <label>摘要 *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="3"
            placeholder="文章简短描述（100 字以内）"
          />
        </div>

        <div className="form-group">
          <label>标签</label>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="用逗号分隔，例如：Unity, 物理，解谜"
          />
        </div>

        <div className="form-group">
          <label>正文内容</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="15"
            placeholder="使用 Markdown 格式编写文章内容..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            取消
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '保存中...' : (post ? '更新文章' : '创建文章')}
          </button>
        </div>
      </form>
    </div>
  )
}
