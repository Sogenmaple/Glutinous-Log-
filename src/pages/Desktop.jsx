import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Desktop.css'

/**
 * 汤圆的小窝 - 模拟电脑桌面
 * 桌面图标 + 窗口系统 + 任务栏 + 资源管理器
 * 黑白漫画风格，无 emoji
 */

// 桌面图标数据（无 emoji，纯文本/CSS 图标）
const DESKTOP_ICONS = [
  { id: 'portfolio', name: '作品集', symbol: 'P', path: '/games', type: 'folder' },
  { id: 'blog', name: '博客', symbol: 'B', path: '/blog', type: 'folder' },
  { id: 'about', name: '关于我', symbol: 'A', path: '/about', type: 'folder' },
  { id: 'pomodoro', name: '番茄钟', symbol: 'T', path: '/special/pomodoro', type: 'app' },
  { id: 'minigames', name: '小游戏', symbol: 'G', path: '/special/minigames', type: 'folder' },
  { id: 'special', name: '特殊构造', symbol: 'S', path: '/special', type: 'folder' },
  { id: 'profile', name: '个人中心', symbol: 'U', path: '/profile', type: 'app' },
  { id: 'login', name: '登录', symbol: 'L', path: '/login', type: 'app' },
  { id: 'register', name: '注册', symbol: 'R', path: '/register', type: 'app' },
  { id: 'explorer', name: '资源管理器', symbol: 'E', path: '#explorer', type: 'system' },
  { id: 'settings', name: '设置', symbol: 'C', path: '#settings', type: 'system' },
  { id: 'terminal', name: '终端', symbol: '$', path: '#terminal', type: 'system' },
]

// 窗口组件
function Window({ window, onClose, onMinimize, onFocus, children }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls')) return
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

    const handleMouseMove = (e) => {
      const x = e.clientX - dragOffset.x
      const y = e.clientY - dragOffset.y
      windowRef.current.style.left = Math.max(0, x) + 'px'
      windowRef.current.style.top = Math.max(0, y) + 'px'
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={windowRef}
      className={`desktop-window ${window.isMinimized ? 'minimized' : ''}`}
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
          <button className="window-btn minimize" onClick={() => onMinimize(window.id)} title="最小化">_</button>
          <button className="window-btn maximize" onClick={() => {}} title="最大化">□</button>
          <button className="window-btn close" onClick={() => onClose(window.id)} title="关闭">X</button>
        </div>
      </div>

      <div className="window-content">
        {children}
      </div>
    </div>
  )
}

// 资源管理器组件
function Explorer({ navigate, openWindow }) {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedItems, setSelectedItems] = useState([])

  const fileSystem = {
    '/': [
      { name: '作品集', type: 'folder', action: () => openWindow('portfolio') },
      { name: '博客', type: 'folder', action: () => openWindow('blog') },
      { name: '关于我', type: 'folder', action: () => openWindow('about') },
      { name: '番茄钟', type: 'app', action: () => openWindow('pomodoro') },
      { name: '小游戏', type: 'folder', action: () => openWindow('minigames') },
      { name: '特殊构造', type: 'folder', action: () => openWindow('special') },
      { name: '个人中心', type: 'app', action: () => openWindow('profile') },
    ],
  }

  const items = fileSystem[currentPath] || []

  const handleDoubleClick = (item) => {
    if (item.action) item.action()
  }

  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <button className="explorer-nav-btn" disabled>&lt; 后退</button>
        <button className="explorer-nav-btn" disabled>前进 &gt;</button>
        <div className="explorer-addressbar">
          <span className="address-path">{currentPath === '/' ? '桌面' : currentPath}</span>
        </div>
      </div>

      <div className="explorer-content">
        {items.map((item, index) => (
          <div
            key={index}
            className={`explorer-item ${selectedItems.includes(index) ? 'selected' : ''}`}
            onClick={() => setSelectedItems([index])}
            onDoubleClick={() => handleDoubleClick(item)}
          >
            <div className={`explorer-item-icon ${item.type === 'folder' ? 'folder-icon' : 'file-icon'}`}>
              <span className="icon-symbol">{item.type === 'folder' ? '[]' : '[]'}</span>
            </div>
            <span className="explorer-item-name">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="explorer-statusbar">
        <span>{items.length} 个项目</span>
        <span>{selectedItems.length} 个已选中</span>
      </div>
    </div>
  )
}

// 终端组件
function Terminal() {
  const [lines, setLines] = useState([
    { text: '汤圆的小窝 终端 v1.0', type: 'info' },
    { text: 'Copyright (c) 2026 TangYuan. All rights reserved.', type: 'info' },
    { text: '', type: 'blank' },
    { text: '输入 help 查看可用命令', type: 'info' },
    { text: '', type: 'blank' },
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const commands = {
    help: '可用命令: help, clear, date, whoami, ls, echo [text], exit',
    date: () => new Date().toLocaleString('zh-CN'),
    whoami: '汤圆',
    ls: '作品集/  博客/  关于我/  番茄钟/  小游戏/  特殊构造/  个人中心/',
    clear: () => { setLines([]); return null },
    exit: '再见！',
  }

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines = [...lines, { text: `C:\\Users\\TangYuan&gt; ${cmd}`, type: 'input' }]

    if (trimmed === '') {
      setLines([...newLines, { text: '', type: 'blank' }])
      return
    }

    if (trimmed.startsWith('echo ')) {
      newLines.push({ text: cmd.substring(5), type: 'output' })
    } else if (commands[trimmed]) {
      const result = typeof commands[trimmed] === 'function' ? commands[trimmed]() : commands[trimmed]
      if (result !== null) {
        newLines.push({ text: result, type: 'output' })
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
        <span className="terminal-prompt">C:\Users\TangYuan&gt;</span>
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
          <span>汤圆的小窝 v7.0</span>
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

  // 初始化图标位置（网格布局：从上到下排满一列，再换到下一列）
  useEffect(() => {
    const positions = {}
    const iconWidth = 80
    const iconHeight = 90
    const paddingX = 20
    const paddingY = 70 // 顶部留空给标题栏
    const gapX = 10
    const gapY = 10

    // 计算每列能放几个图标
    const viewportHeight = window.innerHeight - 48 // 减去任务栏
    const maxIconsPerColumn = Math.floor((viewportHeight - paddingY) / (iconHeight + gapY))

    DESKTOP_ICONS.forEach((icon, index) => {
      const col = Math.floor(index / maxIconsPerColumn)
      const row = index % maxIconsPerColumn
      positions[icon.id] = {
        x: paddingX + col * (iconWidth + gapX),
        y: paddingY + row * (iconHeight + gapY),
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

    // 如果窗口已打开，则聚焦
    const existing = windows.find(w => w.appId === icon.id)
    if (existing) {
      setWindows(prev => prev.map(w =>
        w.id === existing.id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w
      ))
      setZIndexCounter(prev => prev + 1)
      return
    }

    // 创建新窗口
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
  }, [windows, zIndexCounter])

  // 关闭窗口
  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
  }, [])

  // 最小化窗口
  const minimizeWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: true } : w
    ))
  }, [])

  // 聚焦窗口
  const focusWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, zIndex: zIndexCounter + 1 } : w
    ))
    setZIndexCounter(prev => prev + 1)
  }, [zIndexCounter])

  // 右键菜单
  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  // 点击桌面关闭右键菜单
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // 桌面图标双击
  const handleIconDoubleClick = (icon) => {
    openWindow(icon)
  }

  // 桌面图标拖拽
  const handleIconDragStart = useCallback((e, iconId) => {
    e.preventDefault()
    const startPos = { x: e.clientX, y: e.clientY }
    let hasMoved = false

    const handleMouseMove = (e) => {
      const dx = e.clientX - startPos.x
      const dy = e.clientY - startPos.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true
      }
    }

    const handleMouseUp = (e) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      if (hasMoved) {
        // 更新图标位置
        setIconPositions(prev => ({
          ...prev,
          [iconId]: {
            x: Math.max(0, e.clientX - 40),
            y: Math.max(60, e.clientY - 40),
          }
        }))
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  // 获取窗口对应的图标
  const getWindowIcon = (appId) => {
    return DESKTOP_ICONS.find(i => i.id === appId)
  }

  return (
    <div className="desktop-environment" onContextMenu={handleContextMenu}>
      <div className="manga-halftone"></div>

      {/* 桌面图标 */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon) => (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            style={{
              left: (iconPositions[icon.id]?.x || 20) + 'px',
              top: (iconPositions[icon.id]?.y || 70) + 'px',
            }}
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => handleIconDoubleClick(icon)}
            onMouseDown={(e) => handleIconDragStart(e, icon.id)}
          >
            <div className="desktop-icon-img">
              <span className="icon-symbol">{icon.symbol}</span>
            </div>
            <span className="desktop-icon-label">{icon.name}</span>
          </div>
        ))}
      </div>

      {/* 窗口区域 */}
      <div className="desktop-windows">
        {windows.map(window => (
          <Window
            key={window.id}
            window={window}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
          >
            {window.appId === 'explorer' && (
              <Explorer navigate={navigate} openWindow={(id) => openWindow(id)} />
            )}
            {window.appId === 'terminal' && <Terminal />}
            {window.appId === 'settings' && <Settings />}
            {['portfolio', 'blog', 'about', 'pomodoro', 'minigames', 'special', 'profile', 'login', 'register'].includes(window.appId) && (
              <div className="window-placeholder">
                <h2>{window.title}</h2>
                <p>正在导航到 {window.title} 页面...</p>
                <button className="placeholder-btn" onClick={() => navigate(getWindowIcon(window.appId)?.path || '/')}>
                  立即跳转
                </button>
              </div>
            )}
          </Window>
        ))}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="context-menu-item" onClick={() => {
            openWindow('explorer')
            setContextMenu(null)
          }}>
            打开资源管理器
          </div>
          <div className="context-menu-item" onClick={() => {
            openWindow('terminal')
            setContextMenu(null)
          }}>
            打开终端
          </div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-item" onClick={() => {
            openWindow('settings')
            setContextMenu(null)
          }}>
            系统设置
          </div>
          <div className="context-menu-item" onClick={() => {
            window.location.reload()
          }}>
            刷新桌面
          </div>
        </div>
      )}

      {/* 任务栏 */}
      <div className="taskbar">
        <button className="taskbar-start" onClick={() => openWindow('explorer')}>
          <span className="start-symbol">[]</span>
          <span className="start-text">开始</span>
        </button>

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
                      w.id === window.id ? { ...w, isMinimized: false } : w
                    ))
                  } else {
                    minimizeWindow(window.id)
                  }
                }}
              >
                <span className="taskbar-window-icon">
                  {icon?.symbol || '?'}
                </span>
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
