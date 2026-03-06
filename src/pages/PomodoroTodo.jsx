import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, CalendarIcon } from '../components/icons/SiteIcons'

export default function PomodoroTodo() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('timer')

  return (
    <div className="pomodoro-page">
      <Header />
      
      <main className="pomodoro-main">
        <div className="pomodoro-header">
          <h1 className="pomodoro-title">番茄专注</h1>
          <p className="pomodoro-subtitle">POMODORO FOCUS SYSTEM</p>
        </div>

        <div className="pomodoro-tabs">
          <button className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`} onClick={() => setActiveTab('timer')}>
            <ClockIcon size={18} /><span>专注</span>
          </button>
          <button className={`tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`} onClick={() => setActiveTab('heatmap')}>
            <CalendarIcon size={18} /><span>热力图</span>
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <ChartIcon size={18} /><span>统计</span>
          </button>
        </div>

        <div className="pomodoro-content">
          {activeTab === 'timer' && <TimerView />}
          {activeTab === 'heatmap' && <HeatmapTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </main>
    </div>
  )
}

// 专注视图 - 支持拖拽
function TimerView() {
  const [activeTodos, setActiveTodos] = useState(() => {
    const saved = localStorage.getItem('pomodoro_active_todos')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('pomodoro_active_todos', JSON.stringify(activeTodos))
  }, [activeTodos])

  const removeFromTodos = (todoId) => {
    const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
    localStorage.setItem('pomodoro_todos', JSON.stringify(todos.filter(t => t.id !== todoId)))
    window.dispatchEvent(new CustomEvent('todos-updated'))
  }

  const moveToActive = (todo) => {
    if (!activeTodos.find(t => t.id === todo.id)) {
      const activeTodo = { ...todo, startedAt: new Date().toISOString(), remainingTime: todo.duration || 25 }
      setActiveTodos([...activeTodos, activeTodo])
      removeFromTodos(todo.id)
    }
  }

  const moveBackToTodos = (todo) => {
    const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
    localStorage.setItem('pomodoro_todos', JSON.stringify([...todos, { ...todo, duration: todo.remainingTime }]))
    window.dispatchEvent(new CustomEvent('todos-updated'))
    setActiveTodos(activeTodos.filter(t => t.id !== todo.id))
  }

  const completeTodo = (todoId) => {
    const todo = activeTodos.find(t => t.id === todoId)
    if (todo) {
      const sessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')
      const completedTime = (todo.duration || 25) - (todo.remainingTime || 0)
      if (completedTime > 0) {
        sessions.push({
          id: Date.now(),
          todoId: todo.id,
          todoText: todo.text,
          duration: completedTime * 60,
          completedAt: new Date().toISOString(),
          mode: 'work'
        })
        localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions))
      }
    }
    setActiveTodos(activeTodos.filter(t => t.id !== todoId))
  }

  const updateActiveTodoTime = (todoId, newRemainingTime) => {
    setActiveTodos(activeTodos.map(t => t.id === todoId ? { ...t, remainingTime: newRemainingTime } : t))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const todoData = e.dataTransfer.getData('todo')
    if (todoData) {
      const todo = JSON.parse(todoData)
      moveToActive(todo)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  return (
    <div className="timer-view">
      <div className="todo-column">
        <div className="column-header">
          <h3>待办清单</h3>
          <span className="column-count">拖到右侧开始专注</span>
        </div>
        <TodosList onMoveToActive={moveToActive} />
      </div>

      <div 
        className={`focus-column ${activeTodos.length === 0 ? 'drop-zone' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="column-header">
          <h3>专注中</h3>
          {activeTodos.length > 0 && (
            <button className="clear-all-btn" onClick={() => activeTodos.forEach(todo => moveBackToTodos(todo))}>
              全部返回
            </button>
          )}
        </div>
        
        {activeTodos.length === 0 ? (
          <div className="empty-focus">
            <div className="drop-hint">
              <div className="drop-icon">⬆</div>
              <p>将待办事项拖拽到这里</p>
              <p className="drop-sub">开始专注计时</p>
            </div>
          </div>
        ) : (
          <div className="active-todos-list">
            {activeTodos.map(todo => (
              <ActiveTodoCard 
                key={todo.id} 
                todo={todo}
                onMoveBack={() => moveBackToTodos(todo)}
                onComplete={() => completeTodo(todo.id)}
                onUpdateTime={(newTime) => updateActiveTodoTime(todo.id, newTime)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TodosList({ onMoveToActive }) {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('pomodoro_todos') || '[]'))
  const [newTodo, setNewTodo] = useState('')
  const [showConfig, setShowConfig] = useState(null)
  const [config, setConfig] = useState({ priority: 'medium', dueDate: '', duration: 25 })

  useEffect(() => {
    const handleUpdate = () => setTodos(JSON.parse(localStorage.getItem('pomodoro_todos') || '[]'))
    window.addEventListener('todos-updated', handleUpdate)
    return () => window.removeEventListener('todos-updated', handleUpdate)
  }, [])

  useEffect(() => {
    localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setTodos([...todos, {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority: 'medium',
      dueDate: null,
      duration: 25,
      createdAt: new Date().toISOString()
    }])
    setNewTodo('')
  }

  const deleteTodo = (id) => setTodos(todos.filter(todo => todo.id !== id))

  const saveConfig = () => {
    if (!showConfig) return
    setTodos(todos.map(todo => todo.id === showConfig ? {
      ...todo,
      priority: config.priority,
      dueDate: config.dueDate || null,
      duration: config.duration
    } : todo))
    setShowConfig(null)
  }

  const openConfig = (todo) => {
    setConfig({ priority: todo.priority || 'medium', dueDate: todo.dueDate || '', duration: todo.duration || 25 })
    setShowConfig(todo.id)
  }

  const handleDragStart = (e, todo) => {
    e.dataTransfer.setData('todo', JSON.stringify(todo))
    e.dataTransfer.effectAllowed = 'move'
  }

  const filteredTodos = todos.filter(t => !t.completed)

  return (
    <div className="todos-list-container">
      <form className="add-todo-form" onSubmit={addTodo}>
        <input type="text" className="todo-input" placeholder="添加新任务..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button type="submit" className="add-btn"><PlusIcon size={18} /></button>
      </form>

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">暂无待办</div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item" draggable onDragStart={(e) => handleDragStart(e, todo)}>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span className={`priority-badge priority-${todo.priority}`}>
                  {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                </span>
                {todo.dueDate && <span className="due-badge">{new Date(todo.dueDate).toLocaleDateString('zh-CN')}</span>}
                <span className="duration-badge">{todo.duration}分钟</span>
              </div>
              <div className="todo-actions">
                <button className="config-btn" onClick={() => openConfig(todo)}>⚙</button>
                <button className="move-btn" onClick={() => onMoveToActive(todo)}>➤</button>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}><TrashIcon size={14} /></button>
              </div>

              {showConfig === todo.id && (
                <div className="config-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="config-content">
                    <h4>配置待办</h4>
                    <div className="config-field">
                      <label>优先级</label>
                      <select value={config.priority} onChange={(e) => setConfig({ ...config, priority: e.target.value })} className="config-select">
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    </div>
                    <div className="config-field">
                      <label>截止日期</label>
                      <input type="date" value={config.dueDate} onChange={(e) => setConfig({ ...config, dueDate: e.target.value })} className="config-input" />
                    </div>
                    <div className="config-field">
                      <label>持续时间：{config.duration} 分钟</label>
                      <input type="range" min="5" max="180" step="5" value={config.duration} onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })} className="config-slider" />
                    </div>
                    <div className="config-actions">
                      <button className="cancel-btn" onClick={() => setShowConfig(null)}>取消</button>
                      <button className="save-btn" onClick={saveConfig}>保存</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ActiveTodoCard({ todo, onMoveBack, onComplete, onUpdateTime }) {
  const [timeLeft, setTimeLeft] = useState((todo.remainingTime || 25) * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerStyle, setTimerStyle] = useState('digital')

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            onComplete()
            return 0
          }
          const newTime = prev - 1
          onUpdateTime(Math.ceil(newTime / 60))
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, onUpdateTime, onComplete])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimeLeft((todo.remainingTime || 25) * 60)
    setIsRunning(false)
  }

  const progress = ((todo.remainingTime || 25) * 60 - timeLeft) / ((todo.remainingTime || 25) * 60) * 100

  return (
    <div className="active-todo-card">
      <div className="active-todo-header">
        <div className="active-todo-title">
          <span className={`priority-dot priority-${todo.priority}`}></span>
          <span>{todo.text}</span>
        </div>
        <div className="header-actions">
          <button className="move-back-btn" onClick={onMoveBack}>返回</button>
          <button className="complete-btn" onClick={onComplete}>完成</button>
        </div>
      </div>

      <div className="active-todo-timer">
        {timerStyle === 'digital' ? (
          <div className="digital-timer-compact">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="time-slider-wrapper">
              <input type="range" className="time-slider" min="1" max="120" value={Math.ceil(timeLeft / 60)}
                onChange={(e) => { const mins = parseInt(e.target.value); setTimeLeft(mins * 60); onUpdateTime(mins) }}
                disabled={isRunning} />
              <span className="slider-value">{Math.ceil(timeLeft / 60)}分钟</span>
            </div>
          </div>
        ) : (
          <div className="circular-timer-compact">
            <svg viewBox="0 0 100 100" className="circular-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,149,0,0.2)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ff9500" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)" />
            </svg>
            <div className="circular-time-display">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      <div className="active-todo-controls">
        <button className="control-btn primary" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <><PauseIcon size={16} /><span>暂停</span></> : <><PlayIcon size={16} /><span>开始</span></>}
        </button>
        <button className="control-btn" onClick={resetTimer}><ResetIcon size={16} /></button>
        <button className={`style-btn ${timerStyle === 'digital' ? 'active' : ''}`} onClick={() => setTimerStyle(timerStyle === 'digital' ? 'circular' : 'digital')}>
          {timerStyle === 'digital' ? '数字' : '圆形'}
        </button>
      </div>

      <div className="active-todo-info">
        <span className="info-item">已专注：{((todo.duration || 25) - (todo.remainingTime || 25))} 分钟</span>
        <span className="info-item">剩余：{todo.remainingTime || 25} 分钟</span>
        {todo.dueDate && <span className="info-item">截止：{new Date(todo.dueDate).toLocaleDateString('zh-CN')}</span>}
      </div>
    </div>
  )
}

// 热力图 - 简洁规整设计
function HeatmapTab() {
  const [viewMode, setViewMode] = useState('year')
  const [sessions] = useState(() => JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]'))
  const [hoverData, setHoverData] = useState(null)

  const generateHeatmapData = () => {
    const data = {}
    const now = new Date()
    
    if (viewMode === 'year') {
      for (let m = 0; m < 12; m++) {
        for (let d = 0; d < 31; d++) {
          const date = new Date(now.getFullYear(), m, d + 1)
          const dateStr = date.toISOString().split('T')[0]
          if (date <= now) {
            const daySessions = sessions.filter(s => {
              const sDate = new Date(s.completedAt).toISOString().split('T')[0]
              return sDate === dateStr && s.mode === 'work'
            })
            data[dateStr] = { count: daySessions.length, totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0) }
          }
        }
      }
    } else if (viewMode === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const daySessions = sessions.filter(s => {
          const sDate = new Date(s.completedAt).toISOString().split('T')[0]
          return sDate === dateStr && s.mode === 'work'
        })
        data[dateStr] = { count: daySessions.length, totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0) }
      }
    } else if (viewMode === 'day') {
      const today = now.toISOString().split('T')[0]
      for (let h = 0; h < 24; h++) {
        const hourKey = `${today}-${h.toString().padStart(2, '0')}`
        const hourSessions = sessions.filter(s => {
          const sDate = new Date(s.completedAt)
          const sDateStr = sDate.toISOString().split('T')[0]
          return sDateStr === today && sDate.getHours() === h && s.mode === 'work'
        })
        data[hourKey] = { count: hourSessions.length, totalDuration: hourSessions.reduce((sum, s) => sum + (s.duration || 0), 0) }
      }
    }
    return data
  }

  const heatmapData = generateHeatmapData()
  const maxCount = Math.max(...Object.values(heatmapData).map(d => d.count), 1)

  const getColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.03)'
    const intensity = count / maxCount
    if (intensity > 0.75) return 'rgba(255,149,0,0.9)'
    if (intensity > 0.5) return 'rgba(255,149,0,0.6)'
    if (intensity > 0.25) return 'rgba(255,149,0,0.4)'
    return 'rgba(255,149,0,0.2)'
  }

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60)
    return m > 0 ? `${m}分钟` : '< 1 分钟'
  }

  return (
    <div className="heatmap-section">
      <div className="heatmap-header">
        <h3>专注热力图</h3>
        <div className="heatmap-legend">
          <span>少</span>
          <div className="legend-boxes">
            <div className="legend-cell" style={{ background: 'rgba(255,149,0,0.2)' }}></div>
            <div className="legend-cell" style={{ background: 'rgba(255,149,0,0.4)' }}></div>
            <div className="legend-cell" style={{ background: 'rgba(255,149,0,0.6)' }}></div>
            <div className="legend-cell" style={{ background: 'rgba(255,149,0,0.9)' }}></div>
          </div>
          <span>多</span>
        </div>
      </div>

      <div className="heatmap-controls">
        <button className={`view-btn ${viewMode === 'year' ? 'active' : ''}`} onClick={() => setViewMode('year')}>年</button>
        <button className={`view-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>月</button>
        <button className={`view-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>日</button>
      </div>

      <div className="heatmap-container">
        {viewMode === 'year' && (
          <div className="heatmap-grid year-grid">
            {Array.from({ length: 12 }).map((_, month) => (
              <div key={month} className="heatmap-month-row">
                <div className="month-label">{month + 1}月</div>
                <div className="heatmap-days-row">
                  {Array.from({ length: 31 }).map((_, day) => {
                    const date = new Date(new Date().getFullYear(), month, day + 1)
                    const dateStr = date.toISOString().split('T')[0]
                    const cellData = heatmapData[dateStr] || { count: 0 }
                    const isFuture = date > new Date()
                    return (
                      <div key={day} className={`heatmap-cell ${cellData.count > 0 ? 'has-data' : ''} ${isFuture ? 'future' : ''}`}
                        style={{ background: isFuture ? 'rgba(255,255,255,0.02)' : getColor(cellData.count) }}
                        onMouseEnter={() => !isFuture && setHoverData({ date: dateStr, ...cellData })}
                        onMouseLeave={() => setHoverData(null)} />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'month' && (
          <div className="heatmap-grid month-grid">
            {Array.from({ length: 31 }).map((_, day) => {
              const date = new Date(new Date().getFullYear(), new Date().getMonth(), day + 1)
              const dateStr = date.toISOString().split('T')[0]
              const cellData = heatmapData[dateStr] || { count: 0 }
              const isFuture = date > new Date()
              return (
                <div key={day} className={`heatmap-cell large ${cellData.count > 0 ? 'has-data' : ''} ${isFuture ? 'future' : ''}`}
                  style={{ background: isFuture ? 'rgba(255,255,255,0.02)' : getColor(cellData.count) }}
                  onMouseEnter={() => !isFuture && setHoverData({ date: dateStr, ...cellData })}
                  onMouseLeave={() => setHoverData(null)}>
                  <span className="cell-day">{day + 1}</span>
                </div>
              )
            })}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="heatmap-grid day-grid">
            {Array.from({ length: 24 }).map((_, hour) => {
              const today = new Date().toISOString().split('T')[0]
              const hourKey = `${today}-${hour.toString().padStart(2, '0')}`
              const cellData = heatmapData[hourKey] || { count: 0 }
              return (
                <div key={hour} className={`heatmap-cell hour-cell ${cellData.count > 0 ? 'has-data' : ''}`}
                  style={{ background: getColor(cellData.count) }}
                  onMouseEnter={() => setHoverData({ hour: `${hour}:00`, ...cellData })}
                  onMouseLeave={() => setHoverData(null)}>
                  <span className="cell-hour">{hour}</span>
                </div>
              )
            })}
          </div>
        )}

        {hoverData && (
          <div className="heatmap-tooltip">
            {hoverData.date && <div className="tooltip-date">{hoverData.date}</div>}
            {hoverData.hour && <div className="tooltip-hour">{hoverData.hour}</div>}
            <div className="tooltip-stats">
              <div>{hoverData.count} 个番茄</div>
              <div>{formatDuration(hoverData.totalDuration || 0)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsTab() {
  const [sessions] = useState(() => JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]'))
  const today = new Date().toISOString().split('T')[0]
  const todayCount = sessions.filter(s => s.completedAt.startsWith(today) && s.mode === 'work').length
  const weekCount = sessions.filter(s => {
    const date = new Date(s.completedAt)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= weekAgo && s.mode === 'work'
  }).length
  const totalCount = sessions.filter(s => s.mode === 'work').length

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{todayCount}</div>
          <div className="stat-label">今日专注</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{weekCount}</div>
          <div className="stat-label">本周专注</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">总计专注</div>
        </div>
      </div>
    </div>
  )
}
