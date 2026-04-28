import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Desktop.css'

/**
 * 汤圆的小窝 - 模拟电脑桌面
 * 桌面图标 + 窗口系统 + 任务栏 + 资源管理器
 * 黑白漫画风格
 */

// 桌面图标数据
const DESKTOP_ICONS = [
  { id: 'portfolio', name: '作品集', icon: '🎮', path: '/games', type: 'folder' },
  { id: 'blog', name: '博客', icon: '📝', path: '/blog', type: 'folder' },
  { id: 'about', name: '关于我', icon: '👤', path: '/about', type: 'folder' },
  { id: 'pomodoro', name: '番茄钟', icon: '🍅', path: '/special/pomodoro', type: 'app' },
  { id: 'minigames', name: '小游戏', icon: '🕹️', path: '/special/minigames', type: 'folder' },
  { id: 'special', name: '特殊构造', icon: '⚡', path: '/special', type: 'folder' },
  { id: 'profile', name: '个人中心', icon: '👤', path: '/profile', type: 'app' },
  { id: 'login', name: '登录', icon: '🔑', path: '/login', type: 'app' },
  { id: 'register', name: '注册', icon: '📋', path: '/register', type: 'app' },
  { id: 'explorer', name: '资源管理器', icon: '📁', path: '#explorer', type: 'system' },
  { id: 'settings', name: '设置', icon: '⚙️', path: '#settings', type: 'system' },
  { id: 'terminal', name: '终端', icon: '💻', path: '#terminal', type: 'system' },
]

// 窗口组件
function Window({ window, onClose, onMinimize, onFocus, children }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
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
      {/* 标题栏 */}
      <div className="window-titlebar" onMouseDown={handleMouseDown}>
        <span className="window-title">{window.title}</span>
        <div className="window-controls">
          <button className="window-btn minimize" onClick={() => onMinimize(window.id)}>─</button>
          <button className="window-btn maximize" onClick={() => {}}>☐</button>
          <button className="window-btn close" onClick={() => onClose(window.id)}>✕</button>
        </div>
      </div>

      {/* 窗口内容 */}
      <div className="window-content">
        {children}
      </div>

      {/* 调整大小手柄 */}
      <div
        className="resize-handle resize-right"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
        }}
      ></div>
      <div
        className="resize-handle resize-bottom"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
        }}
      ></div>
      <div
        className="resize-handle resize-corner"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
        }}
      ></div>
    </div>
  )
}

// 资源管理器组件
function Explorer({ navigate }) {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedItems, setSelectedItems] = useState([])

  const fileSystem = {
    '/': [
      { name: '作品集', type: 'folder', path: '/games' },
      { name: '博客', type: 'folder', path: '/blog' },
      { name: '关于我', type: 'folder', path: '/about' },
      { name: '番茄钟', type: 'app', path: '/special/pomodoro' },
      { name: '小游戏', type: 'folder', path: '/special/minigames' },
      { name: '特殊构造', type: 'folder', path: '/special' },
      { name: '个人中心', type: 'app', path: '/profile' },
    ],
  }

  const items = fileSystem[currentPath] || []

  const handleDoubleClick = (item) => {
    if (item.path.startsWith('/')) {
      navigate(item.path)
    }
  }

  return (
    <div className="explorer">
      {/* 地址栏 */}
      <div className="explorer-addressbar">
        <span className="address-icon">📁</span>
        <span className="address-path">{currentPath === '/' ? '桌面' : currentPath}</span>
      </div>

      {/* 文件列表 */}
      <div className="explorer-content">
        {items.map((item, index) => (
          <div
            key={index}
            className={`explorer-item ${selectedItems.includes(index) ? 'selected' : ''}`}
            onClick={() => setSelectedItems([index])}
            onDoubleClick={() => handleDoubleClick(item)}
          >
            <span className="explorer-item-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
            <span className="explorer-item-name">{item.name}</span>
          </div>
        ))}
      </div>

      {/* 状态栏 */}
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
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const commands = {
    help: '可用命令: help, clear, date, whoami, ls, exit',
    date: () => new Date().toLocaleString('zh-CN'),
    whoami: '汤圆',
    ls: '作品集/ 博客/ 关于我/ 番茄钟/ 小游戏/ 特殊构造/',
    clear: () => { setLines([]); return null },
    exit: '再见！',
  }

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines = [...lines, { text: `> ${cmd}`, type: 'input' }]

    if (trimmed === '') {
      setLines([...newLines, { text: '', type: 'blank' }])
      return
    }

    if (commands[trimmed]) {
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
          <span>汤圆的小窝 v6.0</span>
        </div>
        <div className="setting-item">
          <label>域名</label>
          <span>ovo-ovo.cn</span>
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

  // 打开窗口
  const openWindow = useCallback((icon) => {
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
      x: 100 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      width: 800,
      height: 500,
      zIndex: zIndexCounter + 1,
      isMinimized: false,
    }

    setWindows(prev => [...prev, newWindow])
    setZIndexCounter(prev => prev + 1)

    // 导航到对应页面（系统窗口除外）
    if (icon.path.startsWith('/') && !icon.path.startsWith('#')) {
      navigate(icon.path)
    }
  }, [windows, zIndexCounter, navigate])

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
    if (icon.path.startsWith('#')) {
      openWindow(icon)
    } else {
      openWindow(icon)
    }
  }

  return (
    <div className="desktop-environment" onContextMenu={handleContextMenu}>
      {/* 桌面背景 */}
      <div className="manga-halftone"></div>

      {/* 桌面图标 */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((icon, index) => (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            style={{ top: `${index * 90}px` }}
            onClick={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => handleIconDoubleClick(icon)}
          >
            <span className="desktop-icon-img">{icon.icon}</span>
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
            {window.appId === 'explorer' && <Explorer navigate={navigate} />}
            {window.appId === 'terminal' && <Terminal />}
            {window.appId === 'settings' && <Settings />}
            {window.appId === 'portfolio' && (
              <div className="window-placeholder">
                <h2>作品集</h2>
                <p>正在打开作品集页面...</p>
              </div>
            )}
            {window.appId === 'blog' && (
              <div className="window-placeholder">
                <h2>博客</h2>
                <p>正在打开博客页面...</p>
              </div>
            )}
            {window.appId === 'about' && (
              <div className="window-placeholder">
                <h2>关于我</h2>
                <p>正在打开关于页面...</p>
              </div>
            )}
            {window.appId === 'pomodoro' && (
              <div className="window-placeholder">
                <h2>番茄钟</h2>
                <p>正在打开番茄钟...</p>
              </div>
            )}
            {window.appId === 'minigames' && (
              <div className="window-placeholder">
                <h2>小游戏</h2>
                <p>正在打开小游戏...</p>
              </div>
            )}
            {window.appId === 'special' && (
              <div className="window-placeholder">
                <h2>特殊构造</h2>
                <p>正在打开特殊构造...</p>
              </div>
            )}
            {window.appId === 'profile' && (
              <div className="window-placeholder">
                <h2>个人中心</h2>
                <p>正在打开个人中心...</p>
              </div>
            )}
            {window.appId === 'login' && (
              <div className="window-placeholder">
                <h2>登录</h2>
                <p>正在打开登录页面...</p>
              </div>
            )}
            {window.appId === 'register' && (
              <div className="window-placeholder">
                <h2>注册</h2>
                <p>正在打开注册页面...</p>
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
            navigate('/games')
            setContextMenu(null)
          }}>
            打开作品集
          </div>
          <div className="context-menu-item" onClick={() => {
            navigate('/blog')
            setContextMenu(null)
          }}>
            打开博客
          </div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-item" onClick={() => {
            openWindow(DESKTOP_ICONS.find(i => i.id === 'explorer'))
            setContextMenu(null)
          }}>
            打开资源管理器
          </div>
          <div className="context-menu-item" onClick={() => {
            openWindow(DESKTOP_ICONS.find(i => i.id === 'terminal'))
            setContextMenu(null)
          }}>
            打开终端
          </div>
          <div className="context-menu-divider"></div>
          <div className="context-menu-item" onClick={() => {
            openWindow(DESKTOP_ICONS.find(i => i.id === 'settings'))
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
        {/* 开始按钮 */}
        <button className="taskbar-start">
          <span className="start-icon">🍡</span>
          <span className="start-text">开始</span>
        </button>

        {/* 任务栏窗口列表 */}
        <div className="taskbar-windows">
          {windows.map(window => (
            <button
              key={window.id}
              className={`taskbar-window-btn ${window.isMinimized ? 'minimized' : ''} ${window.isMinimized ? '' : 'active'}`}
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
                {DESKTOP_ICONS.find(i => i.id === window.appId)?.icon || '📄'}
              </span>
              <span className="taskbar-window-title">{window.title}</span>
            </button>
          ))}
        </div>

        {/* 系统托盘 */}
        <div className="taskbar-tray">
          <span className="tray-time">{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
