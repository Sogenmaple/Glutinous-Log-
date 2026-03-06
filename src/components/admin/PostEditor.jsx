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
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)

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

  useEffect(() => {
    setCharCount(formData.content.length)
    setWordCount(formData.content.split(/\s+/).filter(w => w).length)
  }, [formData.content])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleQuickInsert = (text) => {
    const textarea = document.querySelector('textarea[name="content"]')
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = formData.content.slice(0, start) + text + formData.content.slice(end)
    
    setFormData({ ...formData, content: newContent })
    
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + text.length
    }, 0)
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
        ? `http://36.151.149.117:3001/api/posts/${post.id}`
        : 'http://36.151.149.117:3001/api/posts'
      
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
      <div className="editor-header">
        <h2 className="editor-title">{post ? '编辑文章' : '新建文章'}</h2>
        <button onClick={onBack} className="btn-back">
          ← 返回列表
        </button>
      </div>
      
      {message && <div className={`editor-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        {/* 标题 */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              标题 *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="输入文章标题..."
            />
          </div>
        </div>

        {/* 基本信息行 */}
        <div className="form-row">
          <div className="form-group">
            <label>类型 *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="project">🎮 游戏项目</option>
              <option value="devlog">📝 开发日志</option>
              <option value="tech">💻 技术分享</option>
              <option value="design">🎨 设计笔记</option>
              <option value="life">☕ 生活随笔</option>
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
              <option value="draft">📄 草稿</option>
              <option value="published">✅ 已发布</option>
            </select>
          </div>
        </div>

        {/* 封面图和阅读时间 */}
        <div className="form-row">
          <div className="form-group">
            <label>封面图片 URL</label>
            <input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>阅读时间</label>
            <input
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="5 分钟"
            />
          </div>
        </div>

        {/* 摘要 */}
        <div className="form-group">
          <label>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            摘要 *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="3"
            placeholder="文章简短描述，将显示在列表页（建议 100 字以内）"
            maxLength={200}
          />
          <div className="char-hint">{formData.excerpt.length}/200</div>
        </div>

        {/* 标签 */}
        <div className="form-group">
          <label>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            标签
          </label>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="用逗号分隔，例如：Unity, 物理，解谜，独立游戏"
          />
          <div className="form-hint">标签将显示在文章末尾，便于分类检索</div>
        </div>

        {/* 正文内容 */}
        <div className="form-group">
          <div className="content-label-row">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '0.3rem'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              正文内容
            </label>
            <div className="content-stats">
              <span className="stat">📝 {charCount} 字</span>
              <span className="stat">📄 {wordCount} 词</span>
            </div>
          </div>
          
          {/* 快捷插入按钮 */}
          <div className="quick-insert">
            <button type="button" onClick={() => handleQuickInsert('## ')} title="插入二级标题">H2</button>
            <button type="button" onClick={() => handleQuickInsert('### ')} title="插入三级标题">H3</button>
            <button type="button" onClick={() => handleQuickInsert('**粗体**')} title="插入粗体"><strong>B</strong></button>
            <button type="button" onClick={() => handleQuickInsert('*斜体*')} title="插入斜体"><em>I</em></button>
            <button type="button" onClick={() => handleQuickInsert('\n- ')} title="插入列表">• 列表</button>
            <button type="button" onClick={() => handleQuickInsert('\n> ')} title="插入引用">❝ 引用</button>
            <button type="button" onClick={() => handleQuickInsert('```\n\n```')} title="插入代码块">{`</>`}</button>
            <button type="button" onClick={() => handleQuickInsert('\n---\n')} title="插入分隔线">━ 分隔</button>
          </div>
          
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="20"
            placeholder={`使用 Markdown 格式编写文章内容...

提示：
## 标题
**粗体文字**
- 列表项
> 引用文字
\`\`\`
代码块
\`\`\``}
            className="content-textarea"
          />
          <div className="form-hint">支持 Markdown 格式，预览功能即将上线</div>
        </div>

        {/* 操作按钮 */}
        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            取消
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <svg className="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
                保存中...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {post ? '更新文章' : '创建文章'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
