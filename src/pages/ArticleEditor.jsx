import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { ReturnIcon, SaveIcon } from '../components/icons/SiteIcons'
import '../styles/ArticleEditor.css'

export default function ArticleEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      loadArticle()
    }
  }, [])

  const loadArticle = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTitle(data.title || '')
        setContent(data.content || '')
        setCategory(data.category || '')
        setStatus(data.status || 'draft')
      }
    } catch (err) {
      console.error('加载文章失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }
    setSaving(true)
    const token = localStorage.getItem('token')
    const articleData = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      status,
      author: 'admin'
    }

    try {
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
        navigate('/admin')
      } else {
        const data = await res.json()
        alert(data.error || '保存失败')
      }
    } catch (err) {
      console.error('保存文章失败:', err)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="article-editor-page">
      <Header />
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-header-left">
            <button className="back-btn" onClick={() => navigate('/admin')}>
              <ReturnIcon size={18} />
              返回
            </button>
            <h2>{isEdit ? '编辑文章' : '新建文章'}</h2>
          </div>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            <SaveIcon size={18} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>

        {loading ? (
          <div className="editor-loading">
            <div className="loading-spinner"></div>
            <p>加载文章中...</p>
          </div>
        ) : (
          <div className="editor-form">
            <div className="form-row">
              <div className="form-group">
                <label>标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入文章标题"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>分类</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="例如：技术、生活、游戏"
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入文章内容..."
                rows={20}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
