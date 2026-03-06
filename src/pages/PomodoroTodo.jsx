import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, CalendarIcon } from '../components/icons/SiteIcons'

/**
 * 番茄钟待办 v3.0
 * 左右分栏布局：
 * - 左侧：待办清单（可拖拽到右侧）
 * - 右侧：专注中（当前正在进行的任务）
 */
export default function PomodoroTodo() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('timer')

  return (
    <div className="pomodoro-page">
      <Header />
      
      <main className="pomodoro-main">
        <div className="pomodoro-header">
          <h1 className="pomodoro-title">
            <ClockIcon size={32} color="#ff9500" />
            <span>番茄专注</span>
          </h1>
          <p className="pomodoro-subtitle">POMODORO FOCUS SYSTEM</p>
        </div>

        {/* 标签页导航 */}
        <div className="pomodoro-tabs">
          <button 
            className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <ClockIcon size={18} />
            <span>专注</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            <CalendarIcon size={18} />
            <span>热力图</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <ChartIcon size={18} />
            <span>统计</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="pomodoro-content">
          {activeTab === 'timer' && <TimerView />}
          {activeTab === 'heatmap' && <HeatmapTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </main>
    </div>
  )
}

// 专注视图 - 左右分栏
function TimerView() {
  const [activeTodos, setActiveTodos] = useState(() => {
    const saved = localStorage.getItem('pomodoro_active_todos')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('pomodoro_active_todos', JSON.stringify(activeTodos))
  }, [activeTodos])

  const moveToActive = (todo) => {
    if (!activeTodos.find(t => t.id === todo.id)) {
      setActiveTodos([...activeTodos, { ...todo, startedAt: new Date().toISOString() }])
    }
  }

  const removeFromActive = (todoId) => {
    setActiveTodos(activeTodos.filter(t => t.id !== todoId))
  }

  return (
    <div className="timer-view">
      {/* 左侧：待办清单 */}
      <div className="todo-column">
        <div className="column-header">
          <h3>
            <CheckIcon size={18} />
            <span>待办清单</span>
          </h3>
          <span className="column-count">{activeTodos.length} 个进行中</span>
        </div>
        <TodosList 
          activeTodos={activeTodos}
          onMoveToActive={moveToActive}
        />
      </div>

      {/* 右侧：专注中 */}
      <div className="focus-column">
        <div className="column-header">
          <h3>
            <ClockIcon size={18} />
            <span>专注中</span>
          </h3>
          {activeTodos.length > 0 && (
            <button className="clear-all-btn" onClick={() => setActiveTodos([])}>
              全部完成
            </button>
          )}
        </div>
        
        {activeTodos.length === 0 ? (
          <div className="empty-focus">
            <p>💭 从左侧拖拽待办到这里开始专注</p>
            <p className="empty-hint">或者点击待办旁边的 ➤ 按钮</p>
          </div>
        ) : (
          <div className="active-todos-list">
            {activeTodos.map(todo => (
              <ActiveTodoCard 
                key={todo.id} 
                todo={todo} 
                onRemove={() => removeFromActive(todo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 待办列表组件
function TodosList({ activeTodos, onMoveToActive }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('pomodoro_todos')
    return saved ? JSON.parse(saved) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority,
      pomodoros: 0,
      createdAt: new Date().toISOString()
    }
    
    setTodos([...todos, todo])
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(t => !t.completed)

  return (
    <div className="todos-list-container">
      <form className="add-todo-form" onSubmit={addTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="添加新任务..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
        <button type="submit" className="add-btn">
          <PlusIcon size={18} />
        </button>
      </form>

      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">暂无待办</div>
        ) : (
          filteredTodos.map(todo => {
            const isActive = activeTodos.find(t => t.id === todo.id)
            return (
              <div 
                key={todo.id} 
                className={`todo-item ${isActive ? 'active' : ''}`}
              >
                <div className="todo-content">
                  <span className="todo-text">{todo.text}</span>
                  <span className={`priority-badge priority-${todo.priority}`}>
                    {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <div className="todo-actions">
                  {isActive ? (
                    <span className="active-tag">专注中</span>
                  ) : (
                    <button 
                      className="move-btn" 
                      onClick={() => onMoveToActive(todo)}
                      title="开始专注"
                    >
                      ➤
                    </button>
                  )}
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// 专注中的待办卡片
function ActiveTodoCard({ todo, onRemove }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerStyle, setTimerStyle] = useState('digital')
  const [customTime, setCustomTime] = useState(25)

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimeLeft(customTime * 60)
    setIsRunning(false)
  }

  const progress = ((customTime * 60 - timeLeft) / (customTime * 60)) * 100

  return (
    <div className="active-todo-card">
      <div className="active-todo-header">
        <div className="active-todo-title">
          <span className={`priority-dot priority-${todo.priority}`}></span>
          <span>{todo.text}</span>
        </div>
        <button className="complete-btn" onClick={onRemove}>
          ✓ 完成
        </button>
      </div>

      <div className="active-todo-timer">
        {timerStyle === 'digital' ? (
          <div className="digital-timer-compact">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <input
              type="range"
              className="time-slider"
              min="1"
              max="120"
              value={customTime}
              onChange={(e) => {
                const mins = parseInt(e.target.value)
                setCustomTime(mins)
                setTimeLeft(mins * 60)
              }}
              disabled={isRunning}
              style={{ '--slider-color': '#ff9500' }}
            />
          </div>
        ) : (
          <div className="circular-timer-compact">
            <svg viewBox="0 0 100 100" className="circular-svg">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,149,0,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#ff9500"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="circular-time-display">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      <div className="active-todo-controls">
        <button
          className="control-btn primary"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <><PauseIcon size={16} /><span>暂停</span></> : <><PlayIcon size={16} /><span>开始</span></>}
        </button>
        <button className="control-btn" onClick={resetTimer}>
          <ResetIcon size={16} />
        </button>
        <button
          className={`style-btn ${timerStyle === 'digital' ? 'active' : ''}`}
          onClick={() => setTimerStyle(timerStyle === 'digital' ? 'circular' : 'digital')}
        >
          {timerStyle === 'digital' ? '数字' : '圆形'}
        </button>
      </div>

      <div className="active-todo-stats">
        <span>🍅 {todo.pomodoros} 个番茄</span>
        <span>⏱️ 总计 {Math.floor((todo.pomodoros * 25))} 分钟</span>
      </div>
    </div>
  )
}

// 热力图组件
function HeatmapTab() {
  const [viewMode, setViewMode] = useState('year')
  const [sessions] = useState(() => {
    const saved = localStorage.getItem('pomodoro_sessions')
    return saved ? JSON.parse(saved) : []
  })
  const [hoverData, setHoverData] = useState(null)

  const generateHeatmapData = () => {
    const data = {}
    const now = new Date()
    
    if (viewMode === 'year') {
      for (let m = 0; m < 12; m++) {
        for (let d = 1; d <= 31; d++) {
          const date = new Date(now.getFullYear(), m, d)
          if (date.getMonth() === m && date <= now) {
            const dateStr = date.toISOString().split('T')[0]
            const daySessions = sessions.filter(s => {
              const sDate = new Date(s.completedAt).toISOString().split('T')[0]
              return sDate === dateStr && s.mode === 'work'
            })
            data[dateStr] = {
              count: daySessions.length,
              totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
            }
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
        data[dateStr] = {
          count: daySessions.length,
          totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        }
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
        data[hourKey] = {
          count: hourSessions.length,
          totalDuration: hourSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        }
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
              <div key={month} className="heatmap-month">
                <div className="month-label">{month + 1}月</div>
                <div className="heatmap-days">
                  {Array.from({ length: 31 }).map((_, day) => {
                    const date = new Date(new Date().getFullYear(), month, day + 1)
                    const dateStr = date.toISOString().split('T')[0]
                    const cellData = heatmapData[dateStr] || { count: 0 }
                    return (
                      <div
                        key={day}
                        className={`heatmap-cell ${cellData.count > 0 ? 'has-data' : ''}`}
                        style={{ background: getColor(cellData.count) }}
                        onMouseEnter={() => setHoverData({ date: dateStr, ...cellData })}
                        onMouseLeave={() => setHoverData(null)}
                      />
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
              return (
                <div
                  key={day}
                  className={`heatmap-cell large ${cellData.count > 0 ? 'has-data' : ''}`}
                  style={{ background: getColor(cellData.count) }}
                  onMouseEnter={() => setHoverData({ date: dateStr, ...cellData })}
                  onMouseLeave={() => setHoverData(null)}
                >
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
                <div
                  key={hour}
                  className={`heatmap-cell hour-cell ${cellData.count > 0 ? 'has-data' : ''}`}
                  style={{ background: getColor(cellData.count) }}
                  onMouseEnter={() => setHoverData({ hour: `${hour}:00`, ...cellData })}
                  onMouseLeave={() => setHoverData(null)}
                >
                  <span className="cell-hour">{hour}</span>
                </div>
              )
            })}
          </div>
        )}

        {hoverData && (
          <div className="heatmap-tooltip">
            {hoverData.date && <div className="tooltip-date">📅 {hoverData.date}</div>}
            {hoverData.hour && <div className="tooltip-hour">⏰ {hoverData.hour}</div>}
            <div className="tooltip-stats">
              <div>🍅 {hoverData.count} 个番茄</div>
              <div>⏱️ {formatDuration(hoverData.totalDuration || 0)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 统计组件
function StatsTab() {
  const [sessions] = useState(() => {
    const saved = localStorage.getItem('pomodoro_sessions')
    return saved ? JSON.parse(saved) : []
  })

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
