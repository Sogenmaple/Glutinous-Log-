import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Desktop.css'

/**
 * 汤圆的小窝 - 模拟电脑桌面 v7.5
 * 桌面图标 + 窗口系统 + 任务栏 + 资源管理器
 * 黑白漫画风格，窗口内用 iframe 加载真实完整页面
 */

// 检测是否在 iframe 中（避免桌面嵌套桌面）
const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

// 桌面图标数据
const DESKTOP_ICONS = [
  { id: 'portfolio', name: '作品集', symbol: 'P', route: '/games' },
  { id: 'blog', name: '博客', symbol: 'B', route: '/blog' },
  { id: 'about', name: '关于我', symbol: 'A', route: '/about' },
  { id: 'pomodoro', name: '番茄钟', symbol: 'T', route: '/special/pomodoro' },
  { id: 'minigames', name: '小游戏', symbol: 'G', route: '/special/minigames' },
  { id: 'special', name: '特殊构造', symbol: 'S', route: '/special' },
  { id: 'profile', name: '个人中心', symbol: 'U', route: '/profile' },
  { id: 'login', name: '登录', symbol: 'L', route: '/login' },
  { id: 'register', name: '注册', symbol: 'R', route: '/register' },
  { id: 'spotlight', name: '聚光灯遮罩', symbol: '◎', route: '/downloads/spotlight-overlay.exe', download: true },
  { id: 'explorer', name: '资源管理器', symbol: 'E', route: null },
  { id: 'settings', name: '设置', symbol: 'C', route: null },
  { id: 'terminal', name: '终端', symbol: '$', route: null },
  { id: 'invert', name: '反相窗口', symbol: '◐', route: null },
]

// 路径映射（资源管理器地址栏）
const PATH_MAP = {
  '/games': 'portfolio',
  '/blog': 'blog',
  '/about': 'about',
  '/special/pomodoro': 'pomodoro',
  '/special/minigames': 'minigames',
  '/special': 'special',
  '/profile': 'profile',
  '/login': 'login',
  '/register': 'register',
  '/invert': 'invert',
}

// 窗口组件
function Window({ window, onClose, onMinimize, onFocus, onNavigate, onResize, onToggleMaximize, animState, children }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [wasMaximized, setWasMaximized] = useState(false) // 记录是否从最大化状态还原
  const windowRef = useRef(null)

  // 拖动
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.resize-handle')) return
    e.preventDefault()
    setIsDragging(true)
    const rect = windowRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    onFocus(window.id)
  }, [window.id, onFocus])

  useEffect(() => {
    if (!isDragging) return
    // 锁定光标并禁用 iframe 鼠标事件，防止光标进入 iframe 内部
    const iframes = document.querySelectorAll('.window-iframe')
    iframes.forEach(f => { f.style.pointerEvents = 'none' })
    document.body.style.cursor = 'move'
    document.body.style.userSelect = 'none'
    const handleMouseMove = (e) => {
      windowRef.current.style.left = Math.max(0, e.clientX - dragOffset.x) + 'px'
      windowRef.current.style.top = Math.max(0, e.clientY - dragOffset.y) + 'px'
    }
    const handleMouseUp = () => {
      setIsDragging(false)
      iframes.forEach(f => { f.style.pointerEvents = '' })
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      iframes.forEach(f => { f.style.pointerEvents = '' })
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  // 拉伸
  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = windowRef.current.getBoundingClientRect()
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY, w: rect.width, h: rect.height })
    onFocus(window.id)
  }, [window.id, onFocus])

  useEffect(() => {
    if (!isResizing) return
    // 锁定光标并禁用 iframe 鼠标事件，防止光标进入 iframe 内部
    const iframes = document.querySelectorAll('.window-iframe')
    iframes.forEach(f => { f.style.pointerEvents = 'none' })
    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
    const handleMouseMove = (e) => {
      const dx = e.clientX - resizeStart.x
      const dy = e.clientY - resizeStart.y
      const newW = Math.max(300, resizeStart.w + dx)
      const newH = Math.max(200, resizeStart.h + dy)
      windowRef.current.style.width = newW + 'px'
      windowRef.current.style.height = newH + 'px'
    }
    const handleMouseUp = () => {
      setIsResizing(false)
      iframes.forEach(f => { f.style.pointerEvents = '' })
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      // 更新状态
      const rect = windowRef.current.getBoundingClientRect()
      onResize && onResize(window.id, Math.round(rect.width), Math.round(rect.height))
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      iframes.forEach(f => { f.style.pointerEvents = '' })
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resizeStart, window.id, onResize])

  const icon = DESKTOP_ICONS.find(i => i.id === window.appId)

  // 最大化/还原处理
  const handleMaximizeToggle = useCallback(() => {
    onToggleMaximize && onToggleMaximize(window.id)
  }, [window.id, onToggleMaximize])

  return (
    <div
      ref={windowRef}
      className={`desktop-window ${window.isMinimized ? 'minimized' : ''} ${window.isMaximized ? 'maximized' : ''} ${animState || ''}`}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      }}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown}>
        <span className="window-title">{window.title}</span>
        <div className="window-controls">
          {icon?.route && (
            <button
              className="window-btn jump"
              onClick={() => openWindow(icon)}
              title="在新窗口中打开"
            >
              &gt;
            </button>
          )}
          <button className="window-btn minimize" onClick={() => onMinimize(window.id)} title="最小化">_</button>
          <button className="window-btn maximize" onClick={handleMaximizeToggle} title={window.isMaximized ? '还原' : '最大化'}>□</button>
          <button className="window-btn close" onClick={() => onClose(window.id)} title="关闭">X</button>
        </div>
      </div>

      <div className="window-content">
        {children}
      </div>
      <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
    </div>
  )
}

// 反相窗口 - 整个窗口容器使用 mix-blend-mode 反相下方内容
function InvertWindowContainer({ window: win, onClose, onMinimize, onFocus, onDrag, onResize, onToggleMaximize, animState, children }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [wasMaximized, setWasMaximized] = useState(false)
  const windowRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.resize-handle')) return
    e.stopPropagation()
    setIsDragging(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    onFocus(win.id)
  }, [win.id, onFocus])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const x = Math.max(0, e.clientX - dragOffset.x)
      const y = Math.max(0, e.clientY - dragOffset.y)
      onDrag && onDrag(win.id, x, y)
    }
    if (isResizing) {
      const newW = Math.max(200, resizeStart.w + (e.clientX - resizeStart.x))
      const newH = Math.max(120, resizeStart.h + (e.clientY - resizeStart.y))
      onResize(win.id, newW, newH)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, win, onDrag, onResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleResizeMouseDown = useCallback((e) => {
    e.stopPropagation()
    setIsResizing(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) setResizeStart({ x: e.clientX, y: e.clientY, w: rect.width, h: rect.height })
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = isResizing ? 'nwse-resize' : 'move'
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const handleMaximizeToggle = useCallback(() => {
    onToggleMaximize(win.id)
  }, [win.id, onToggleMaximize])

  const animClass = animState ? ` ${animState}` : ''
  const icon = DESKTOP_ICONS.find(i => i.id === win.appId)

  return (
    <div
      ref={windowRef}
      className={`desktop-window invert-window-container${animClass}${win.isMaximized ? ' maximized' : ''}${win.isMinimized ? ' minimized' : ''}`}
      style={{
        left: win.x + 'px',
        top: win.y + 'px',
        width: win.width + 'px',
        height: win.height + 'px',
        zIndex: win.zIndex,
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-titlebar">
        <span className="window-icon">{icon?.symbol || '?'}</span>
        <span className="window-title">{win.title}</span>
        <div className="window-controls">
          <button className="window-btn minimize" onClick={() => onMinimize(win.id)} title="最小化">_</button>
          <button className="window-btn maximize" onClick={handleMaximizeToggle} title={win.isMaximized ? '还原' : '最大化'}>□</button>
          <button className="window-btn close" onClick={() => onClose(win.id)} title="关闭">X</button>
        </div>
      </div>
      <div className="window-content invert-content">
        {children}
      </div>
      <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
    </div>
  )
}

// 资源管理器组件
function Explorer({ openWindow }) {
  const [addressInput, setAddressInput] = useState('/')
  const [selectedItems, setSelectedItems] = useState([])

  const desktopItems = [
    { name: '作品集', type: 'folder', appId: 'portfolio' },
    { name: '博客', type: 'folder', appId: 'blog' },
    { name: '关于我', type: 'folder', appId: 'about' },
    { name: '番茄钟', type: 'app', appId: 'pomodoro' },
    { name: '小游戏', type: 'folder', appId: 'minigames' },
    { name: '特殊构造', type: 'folder', appId: 'special' },
    { name: '个人中心', type: 'app', appId: 'profile' },
    { name: '登录', type: 'app', appId: 'login' },
    { name: '注册', type: 'app', appId: 'register' },
  ]

  const handleAddressSubmit = (e) => {
    if (e.key !== 'Enter') return
    const value = addressInput.trim().toLowerCase()

    // cmd 命令 → 打开终端
    if (value === 'cmd' || value === 'terminal') {
      openWindow('terminal')
      setAddressInput('/')
      return
    }

    // 路径映射
    const appId = PATH_MAP[value] || PATH_MAP['/' + value.replace(/^\//, '')]
    if (appId) {
      openWindow(appId)
      setAddressInput(value.startsWith('/') ? value : '/' + value)
      return
    }

    // 尝试模糊匹配
    for (const [path, id] of Object.entries(PATH_MAP)) {
      if (path.includes(value) || value.includes(path)) {
        openWindow(id)
        setAddressInput(path)
        return
      }
    }
  }

  const handleDoubleClick = (item) => {
    openWindow(item.appId)
  }

  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <div className="explorer-addressbar">
          <span className="address-symbol">&gt;</span>
          <input
            className="address-input"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={handleAddressSubmit}
            placeholder="输入路径（如 /games）或 cmd 打开终端..."
          />
          <button className="address-go-btn" onClick={() => handleAddressSubmit({ key: 'Enter' })}>
            转到
          </button>
        </div>
      </div>

      <div className="explorer-content">
        {desktopItems.map((item, index) => (
          <div
            key={index}
            className={`explorer-item ${selectedItems.includes(index) ? 'selected' : ''}`}
            onClick={() => setSelectedItems([index])}
            onDoubleClick={() => handleDoubleClick(item)}
          >
            <div className={`explorer-item-icon ${item.type === 'folder' ? 'folder-icon' : 'file-icon'}`}>
              <span className="icon-symbol">[]</span>
            </div>
            <span className="explorer-item-name">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="explorer-statusbar">
        <span>{desktopItems.length} 个项目</span>
        <span>{selectedItems.length} 个已选中</span>
      </div>
    </div>
  )
}

// 终端组件
function Terminal({ openWindow }) {
  const [lines, setLines] = useState([
    { text: '汤圆的小窝 终端 v1.0', type: 'info' },
    { text: 'Copyright (c) 2026 TangYuan. All rights reserved.', type: 'info' },
    { text: '', type: 'blank' },
    { text: '输入 help 查看可用命令', type: 'info' },
    { text: '', type: 'blank' },
  ])
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState(false)
  const inputRef = useRef(null)

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim()
    const trimmedLower = trimmed.toLowerCase()
    const newLines = [...lines, { text: `C:\\Users\\TangYuan> ${cmd}`, type: 'input' }]

    if (trimmed === '') {
      setLines([...newLines, { text: '', type: 'blank' }])
      return
    }

    // 聊天模式下，exit 退出，其他消息发送给 AI
    if (chatMode) {
      if (trimmedLower === 'exit') {
        setChatMode(false)
        newLines.push({ text: '已退出 ovo 聊天模式', type: 'output' })
        newLines.push({ text: '', type: 'blank' })
        setLines(newLines)
        setInput('')
        return
      }
      // 发送消息给 AI
      newLines.push({ text: '思考中...', type: 'output' })
      setLines(newLines)
      fetch('/api/ovo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      })
        .then(r => r.json())
        .then(data => {
          setLines(prev => {
            // 移除"思考中"那行
            const filtered = prev.filter(l => l.text !== '🤖 思考中...')
            return [...filtered, { text: `ovo: ${data.reply || data.error || '无回复'}`, type: 'output' }, { text: '', type: 'blank' }]
          })
        })
        .catch(() => {
          setLines(prev => {
            const filtered = prev.filter(l => l.text !== '🤖 思考中...')
            return [...filtered, { text: '请求失败，请稍后重试', type: 'error' }, { text: '', type: 'blank' }]
          })
        })
      setInput('')
      return
    }

    // 普通命令模式
    if (trimmedLower.startsWith('echo ')) {
      newLines.push({ text: cmd.substring(5), type: 'output' })
    } else if (trimmedLower === 'help') {
      newLines.push({ text: '可用命令: help, clear, date, whoami, ls, open [页面], ovo, exit', type: 'output' })
    } else if (trimmedLower === 'date') {
      newLines.push({ text: new Date().toLocaleString('zh-CN'), type: 'output' })
    } else if (trimmedLower === 'whoami') {
      newLines.push({ text: '汤圆', type: 'output' })
    } else if (trimmedLower === 'ls') {
      newLines.push({ text: '作品集/  博客/  关于我/  番茄钟/  小游戏/  特殊构造/  个人中心/', type: 'output' })
    } else if (trimmedLower === 'clear') {
      setLines([])
      return
    } else if (trimmedLower === 'exit') {
      newLines.push({ text: '再见！', type: 'output' })
      setLines(newLines)
      return
    } else if (trimmedLower === 'ovo') {
      setChatMode(true)
      newLines.push({ text: 'ovo 聊天模式已开启（输入 exit 退出）', type: 'output' })
      newLines.push({ text: '', type: 'blank' })
      setLines(newLines)
      setInput('')
      return
    } else if (trimmedLower.startsWith('open ')) {
      const target = trimmed.substring(5).trim()
      const appId = PATH_MAP['/' + target] || PATH_MAP[target]
      if (appId) {
        openWindow(appId)
        newLines.push({ text: `正在打开 ${target}...`, type: 'output' })
      } else {
        newLines.push({ text: `未找到页面: ${target}`, type: 'error' })
      }
    } else {
      newLines.push({ text: `'${trimmed}' 不是内部或外部命令`, type: 'error' })
    }

    newLines.push({ text: '', type: 'blank' })
    setLines(newLines)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    }
  }

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-output">
        {lines.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="terminal-prompt">{chatMode ? 'ovo >' : 'C:\\Users\\TangYuan>'}</span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  )
}

// 反相窗口组件 - 使用 CSS mix-blend-mode 反相下方内容
function InvertWindow() {
  return (
    <div className="invert-window">
      <div className="invert-info">
        <div className="invert-title">◐ 反相窗口</div>
        <div className="invert-desc">此窗口会将层级下方的所有内容反相显示</div>
        <div className="invert-hint">拖动窗口查看反相效果</div>
      </div>
    </div>
  )
}

// 设置组件
function Settings() {
  return (
    <div className="settings">
      <h3>系统设置</h3>
      <div className="settings-content">
        <div className="setting-item">
          <label>主题</label>
          <select>
            <option>黑白漫画</option>
            <option>经典 Windows</option>
          </select>
        </div>
        <div className="setting-item">
          <label>版本</label>
          <span>汤圆的小窝 v7.5</span>
        </div>
        <div className="setting-item">
          <label>域名</label>
          <span>ovo-ovo.cn</span>
        </div>
        <div className="setting-item">
          <label>服务器</label>
          <span>京东云 36.151.149.117</span>
        </div>
      </div>
    </div>
  )
}

export default function Desktop() {
  const navigate = useNavigate()
  const [windows, setWindows] = useState([])
  const [zIndexCounter, setZIndexCounter] = useState(100)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [iconPositions, setIconPositions] = useState({})
  const [animatingWindows, setAnimatingWindows] = useState({}) // { windowId: 'opening'|'closing'|'minimizing' }
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [draggingGhost, setDraggingGhost] = useState(null) // { id, x, y } 拖拽中的幽灵图标
  const [userAvatar, setUserAvatar] = useState('') // 当前用户头像
  const wasDraggedRef = useRef(false)

  // 加载用户头像
  useEffect(() => {
    const loadAvatar = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        setUserAvatar(user.avatar || '')
      } catch (e) { /* ignore */ }
    }
    loadAvatar()
    window.addEventListener('avatar-updated', loadAvatar)
    return () => window.removeEventListener('avatar-updated', loadAvatar)
  }, [])

  // 如果在 iframe 中，桌面页面不渲染（避免桌面嵌套桌面）
  // 但其他页面（如作品集、博客）可以在 iframe 中正常显示
  if (isInIframe()) {
    // 只在 hash 为空或 # 时返回 null（即桌面首页被嵌入时）
    // 如果 hash 指向具体页面（如 #/games），则正常渲染
    const hash = window.location.hash || '#'
    if (hash === '#' || hash === '#!/' || hash === '#/') {
      return null
    }
  }

  // 网格吸附参数（与下方保持一致）
  const GRID_SIZE = 80 // 网格间距
  const GRID_TOP = 15  // 顶部起始位置
  const GRID_LEFT = 20 // 左侧起始位置

  // 初始化图标位置（网格布局）
  useEffect(() => {
    const positions = {}
    const viewportHeight = window.innerHeight - 48
    const maxIconsPerColumn = Math.floor((viewportHeight - GRID_TOP) / GRID_SIZE)

    DESKTOP_ICONS.forEach((icon, index) => {
      const col = Math.floor(index / maxIconsPerColumn)
      const row = index % maxIconsPerColumn
      positions[icon.id] = {
        x: GRID_LEFT + col * GRID_SIZE,
        y: GRID_TOP + row * GRID_SIZE,
      }
    })

    setIconPositions(positions)
  }, [])

  // 打开窗口
  const openWindow = useCallback((iconOrId) => {
    const icon = typeof iconOrId === 'string'
      ? DESKTOP_ICONS.find(i => i.id === iconOrId)
      : iconOrId

    if (!icon) return

    // 处理下载链接
    if (icon.download && icon.route) {
      const a = document.createElement('a')
      a.href = icon.route
      a.download = icon.route.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    const existing = windows.find(w => w.appId === icon.id)
    if (existing) {
      setWindows(prev => prev.map(w =>
        w.id === existing.id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w
      ))
      setZIndexCounter(prev => prev + 1)
      return
    }

    const windowId = `win-${Date.now()}`
    const titleMap = {
      portfolio: '作品集',
      blog: '博客',
      about: '关于我',
      pomodoro: '番茄钟',
      minigames: '小游戏',
      special: '特殊构造',
      profile: '个人中心',
      login: '登录',
      register: '注册',
      spotlight: '聚光灯遮罩',
      explorer: '资源管理器',
      settings: '设置',
      terminal: '终端',
    }

    const newWindow = {
      id: windowId,
      appId: icon.id,
      title: titleMap[icon.id] || icon.name,
      x: 80 + Math.random() * 200,
      y: 40 + Math.random() * 100,
      width: icon.id === 'explorer' ? 700 : 800,
      height: icon.id === 'explorer' ? 450 : 500,
      zIndex: zIndexCounter + 1,
      isMinimized: false,
    }

    setWindows(prev => [...prev, newWindow])
    setZIndexCounter(prev => prev + 1)
    // 打开动画
    setAnimatingWindows(prev => ({ ...prev, [windowId]: 'opening' }))
    setTimeout(() => {
      setAnimatingWindows(prev => {
        const next = { ...prev }
        delete next[windowId]
        return next
      })
    }, 300)
  }, [windows, zIndexCounter])

  const closeWindow = useCallback((windowId) => {
    // 关闭动画
    setAnimatingWindows(prev => ({ ...prev, [windowId]: 'closing' }))
    setTimeout(() => {
      setWindows(prev => prev.filter(w => w.id !== windowId))
      setAnimatingWindows(prev => {
        const next = { ...prev }
        delete next[windowId]
        return next
      })
    }, 200)
  }, [])

  const minimizeWindow = useCallback((windowId) => {
    // 最小化动画
    setAnimatingWindows(prev => ({ ...prev, [windowId]: 'minimizing' }))
    setTimeout(() => {
      setWindows(prev => prev.map(w =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ))
      setAnimatingWindows(prev => {
        const next = { ...prev }
        delete next[windowId]
        return next
      })
    }, 250)
  }, [])

  // 最大化/还原窗口
  const toggleMaximizeWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId) return w
      
      if (w.isMaximized) {
        // 还原：恢复到原始尺寸和位置
        return {
          ...w,
          isMaximized: false,
          x: w.restoreX || w.x,
          y: w.restoreY || w.y,
          width: w.restoreWidth || w.width,
          height: w.restoreHeight || w.height,
        }
      } else {
        // 最大化：保存当前状态，设置全屏
        return {
          ...w,
          isMaximized: true,
          restoreX: w.x,
          restoreY: w.y,
          restoreWidth: w.width,
          restoreHeight: w.height,
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 48, // 减去任务栏高度
        }
      }
    }))
  }, [])

  const focusWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, zIndex: zIndexCounter + 1 } : w
    ))
    setZIndexCounter(prev => prev + 1)
  }, [zIndexCounter])

  // 跳转到完整页面（显示导航栏）
  const handleNavigate = useCallback((route) => {
    navigate(route)
  }, [navigate])

  // 拖动窗口位置
  const handleDrag = useCallback((windowId, x, y) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, x, y } : w
    ))
  }, [])

  // 调整窗口尺寸（用户拖拽拉伸后更新状态）
  const handleResize = useCallback((windowId, width, height) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, width, height } : w
    ))
  }, [])

  // 右键菜单
  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  // 点击桌面关闭右键菜单 + 取消选中图标 + 关闭头像菜单
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null)
      setSelectedIcon(null)
      setShowAvatarMenu(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // 吸附到网格
  const snapToGrid = useCallback((x, y) => {
    const col = Math.round((x - GRID_LEFT) / GRID_SIZE)
    const row = Math.round((y - GRID_TOP) / GRID_SIZE)
    return {
      x: GRID_LEFT + Math.max(0, col) * GRID_SIZE,
      y: GRID_TOP + Math.max(0, row) * GRID_SIZE,
    }
  }, [])

  // 桌面图标拖拽（Windows 风格：推挤模式，拖过去把其他图标推开）
  const handleIconMouseDown = useCallback((e, iconId) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startPos = iconPositions[iconId]
    wasDraggedRef.current = false

    // 显示拖拽幽灵图标（初始位置在原图标位置，避免点击时偏移）
    setDraggingGhost({ id: iconId, x: startPos.x, y: startPos.y })

    const handleMouseMove = (e) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        wasDraggedRef.current = true
      }
      // 更新幽灵图标位置（跟随鼠标）
      setDraggingGhost({ id: iconId, x: e.clientX - 35, y: e.clientY - 40 })
    }

    const handleMouseUp = (e) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setDraggingGhost(null) // 隐藏幽灵图标

      if (!wasDraggedRef.current) return

      const snapped = snapToGrid(e.clientX - 35, e.clientY - 40)

      setIconPositions(prev => {
        const newPositions = { ...prev }

        // 检查目标位置是否已有图标
        const targetId = Object.keys(newPositions).find(id => {
          const pos = newPositions[id]
          return pos.x === snapped.x && pos.y === snapped.y && id !== iconId
        })

        if (targetId) {
          // 目标位置有图标：推挤到原图标位置
          newPositions[targetId] = { ...startPos }
        }
        // 拖拽图标放到目标位置（无论是否有阻挡）
        newPositions[iconId] = snapped

        return newPositions
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [snapToGrid, iconPositions])

  // 桌面图标点击
  const handleIconClick = useCallback((icon) => {
    if (wasDraggedRef.current) return
    setSelectedIcon(icon.id)
  }, [])

  // 桌面图标双击
  const handleIconDoubleClick = useCallback((icon) => {
    if (wasDraggedRef.current) return
    openWindow(icon)
  }, [openWindow])

  const getWindowIcon = (appId) => DESKTOP_ICONS.find(i => i.id === appId)

  // 获取 iframe URL（当前页面 URL + hash 路由）
  const getIframeUrl = (route) => {
    // 去掉 route 开头的 /，避免产生 //#/games 这样的双斜杠
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route
    return window.location.origin + window.location.pathname + '#/' + cleanRoute
  }

  return (
    <div className="desktop-environment" onContextMenu={handleContextMenu}>
      <div className="manga-halftone"></div>

      {/* 桌面图标 */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon) => {
          const isDragging = draggingGhost?.id === icon.id
          return (
            <div
              key={icon.id}
              className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
              style={{
                left: (iconPositions[icon.id]?.x || 20) + 'px',
                top: (iconPositions[icon.id]?.y || 15) + 'px',
                opacity: isDragging ? 0.3 : 1,
              }}
              onClick={() => handleIconClick(icon)}
              onDoubleClick={() => handleIconDoubleClick(icon)}
              onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            >
              <div className="desktop-icon-img">
                <span className="icon-symbol">{icon.symbol}</span>
              </div>
              <span className="desktop-icon-label">{icon.name}</span>
            </div>
          )
        })}
      </div>

      {/* 拖拽幽灵图标 */}
      {draggingGhost && (
        <div className="desktop-icon-ghost" style={{ left: draggingGhost.x, top: draggingGhost.y }}>
          <div className="desktop-icon-img">
            <span className="icon-symbol">{DESKTOP_ICONS.find(i => i.id === draggingGhost.id)?.symbol}</span>
          </div>
          <span className="desktop-icon-label">{DESKTOP_ICONS.find(i => i.id === draggingGhost.id)?.name}</span>
        </div>
      )}

      {/* 窗口区域 */}
      <div className="desktop-windows">
        {windows.map(window => {
          const icon = getWindowIcon(window.appId)
          const WindowComponent = window.appId === 'invert' ? InvertWindowContainer : Window
          return (
            <WindowComponent
              key={window.id}
              window={window}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onFocus={focusWindow}
              onNavigate={handleNavigate}
              onDrag={handleDrag}
              onResize={handleResize}
              onToggleMaximize={toggleMaximizeWindow}
              animState={animatingWindows[window.id]}
            >
              {window.appId === 'explorer' && <Explorer openWindow={openWindow} />}
              {window.appId === 'terminal' && <Terminal openWindow={openWindow} />}
              {window.appId === 'settings' && <Settings />}
              {window.appId === 'invert' && <InvertWindow />}
              {icon?.route && (
                <iframe
                  src={getIframeUrl(icon.route)}
                  className="window-iframe"
                  title={window.title}
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </WindowComponent>
          )
        })}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="context-menu-item" onClick={() => { openWindow('explorer'); setContextMenu(null) }}>
            打开资源管理器
          </div>
          <div className="context-menu-item" onClick={() => { openWindow('terminal'); setContextMenu(null) }}>
            打开终端
          </div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-item" onClick={() => { openWindow('settings'); setContextMenu(null) }}>
            系统设置
          </div>
          <div className="context-menu-item" onClick={() => window.location.reload()}>
            刷新桌面
          </div>
        </div>
      )}

      {/* 任务栏 */}
      <div className="taskbar">
        <div className="taskbar-avatar-wrapper" onClick={(e) => { e.stopPropagation(); setShowAvatarMenu(!showAvatarMenu) }}>
          {userAvatar ? (
            <img 
              className="taskbar-avatar" 
              src={userAvatar} 
              alt="头像"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }}
            />
          ) : (
            <img 
              className="taskbar-avatar" 
              src="/avatar.jpg" 
              alt="头像"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }}
            />
          )}
          <span className="taskbar-avatar-fallback">汤</span>
        </div>
        {showAvatarMenu && (
          <div className="avatar-dropdown">
            <div className="avatar-dropdown-item" onClick={() => { openWindow('profile'); setShowAvatarMenu(false) }}>
              <span className="avatar-dropdown-icon">[U]</span> 个人中心
            </div>
            <div className="avatar-dropdown-item" onClick={() => { openWindow('explorer'); setShowAvatarMenu(false) }}>
              <span className="avatar-dropdown-icon">[F]</span> 资源管理器
            </div>
            <div className="avatar-dropdown-divider"></div>
            <div className="avatar-dropdown-item" onClick={() => { navigate('/login'); setShowAvatarMenu(false) }}>
              <span className="avatar-dropdown-icon">[R]</span> 切换账号
            </div>
          </div>
        )}

        <div className="taskbar-windows">
          {windows.map(window => {
            const icon = getWindowIcon(window.appId)
            return (
              <button
                key={window.id}
                className={`taskbar-window-btn ${window.isMinimized ? 'minimized' : 'active'}`}
                onClick={() => {
                  if (window.isMinimized) {
                    setWindows(prev => prev.map(w =>
                      w.id === window.id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w
                    ))
                    setZIndexCounter(prev => prev + 1)
                    // 恢复动画
                    setAnimatingWindows(prev => ({ ...prev, [window.id]: 'opening' }))
                    setTimeout(() => {
                      setAnimatingWindows(prev => {
                        const next = { ...prev }
                        delete next[window.id]
                        return next
                      })
                    }, 300)
                  } else {
                    minimizeWindow(window.id)
                  }
                }}
              >
                <span className="taskbar-window-icon">{icon?.symbol || '?'}</span>
                <span className="taskbar-window-title">{window.title}</span>
              </button>
            )
          })}
        </div>

        <div className="taskbar-tray">
          <span className="tray-time">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
