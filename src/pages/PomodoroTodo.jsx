import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, PinIcon, CalendarIcon } from '../components/icons/SiteIcons'

/**
 * 番茄钟待办 v2.0
 * - 侧栏选择待办
 * - 年度/月/日热力图
 * - 数据持久化（localStorage，后续接数据库）
 * - 悬浮查看详情
 */
export default function PomodoroTodo() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('timer')
  const [selectedTodoId, setSelectedTodoId] = useState(null)

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

        <div className="pomodoro-layout">
          {/* 侧栏：待办清单 */}
          <aside className="pomodoro-sidebar">
            <div className="sidebar-header">
              <h3>
                <CheckIcon size={18} />
                <span>待办清单</span>
              </h3>
            </div>
            <TodosList 
              selectedTodoId={selectedTodoId} 
              onSelectTodo={setSelectedTodoId} 
            />
          </aside>

          {/* 主内容区 */}
          <div className="pomodoro-content-area">
            <div className="pomodoro-tabs">
              <button 
                className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
                onClick={() => setActiveTab('timer')}
              >
                <ClockIcon size={18} />
                <span>计时器</span>
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

            <div className="pomodoro-content">
              {activeTab === 'timer' && (
                <TimerTab 
                  selectedTodoId={selectedTodoId}
                  onSelectTodo={setSelectedTodoId}
                />
              )}
              {activeTab === 'heatmap' && <HeatmapTab />}
              {activeTab === 'stats' && <StatsTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// 待办列表组件
function TodosList({ selectedTodoId, onSelectTodo }) {
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
      completedAt: null,
      createdAt: new Date().toISOString()
    }
    
    setTodos([...todos, todo])
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null
      } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    if (selectedTodoId === id) onSelectTodo(null)
  }

  return (
    <div className="todos-list-container">
      <form className="add-todo-form" onSubmit={addTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="添加任务..."
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
        {todos.length === 0 ? (
          <div className="empty-state">暂无待办</div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} ${selectedTodoId === todo.id ? 'selected' : ''}`}
              onClick={() => onSelectTodo(todo.id)}
            >
              <button 
                className="todo-checkbox" 
                onClick={(e) => {
                  e.stopPropagation()
                  toggleTodo(todo.id)
                }}
              >
                {todo.completed && <CheckIcon size={14} />}
              </button>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span className={`priority-badge priority-${todo.priority}`}>
                  {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
              <button 
                className="delete-btn" 
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTodo(todo.id)
                }}
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// 计时器组件
function TimerTab({ selectedTodoId, onSelectTodo }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [timerStyle, setTimerStyle] = useState('digital')
  const [customTime, setCustomTime] = useState(25) // 分钟
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [pomodoros, setPomodoros] = useState(() => {
    const saved = localStorage.getItem('pomodoro_sessions')
    return saved ? JSON.parse(saved) : []
  })

  const modes = {
    work: { time: 25 * 60, label: '专注', color: '#ff9500' },
    shortBreak: { time: 5 * 60, label: '短休息', color: '#06b6d4' },
    longBreak: { time: 15 * 60, label: '长休息', color: '#39ff14' }
  }

  useEffect(() => {
    localStorage.setItem('pomodoro_sessions', JSON.stringify(pomodoros))
  }, [pomodoros])

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if (mode === 'work' || isCustomMode) {
              const session = {
                id: Date.now(),
                todoId: selectedTodoId,
                completedAt: new Date().toISOString(),
                duration: isCustomMode ? customTime * 60 : modes[mode].time,
                mode: isCustomMode ? 'custom' : 'work'
              }
              setPomodoros([...pomodoros, session])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, mode, selectedTodoId, isCustomMode, customTime])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    if (isCustomMode) {
      setTimeLeft(customTime * 60)
    } else {
      setTimeLeft(modes[mode].time)
    }
    setIsRunning(false)
  }

  const handleModeChange = (key) => {
    setMode(key)
    setTimeLeft(modes[key].time)
    setIsRunning(false)
    setIsCustomMode(false)
  }

  const handleCustomMode = () => {
    setIsCustomMode(true)
    setTimeLeft(customTime * 60)
    setIsRunning(false)
  }

  const handleTimeChange = (e) => {
    const minutes = parseInt(e.target.value)
    setCustomTime(minutes)
    setTimeLeft(minutes * 60)
  }

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100

  return (
    <div className="timer-section">
      <div className="timer-with-sidebar">
        <div className="timer-main">
          <div className="mode-selector">
            {Object.entries(modes).map(([key, value]) => (
              <button
                key={key}
                className={`mode-btn ${mode === key && !isCustomMode ? 'active' : ''}`}
                onClick={() => handleModeChange(key)}
                style={{ '--theme-color': value.color }}
              >
                {value.label}
              </button>
            ))}
            <button
              className={`mode-btn ${isCustomMode ? 'active' : ''}`}
              onClick={handleCustomMode}
              style={{ '--theme-color': '#a855f7' }}
            >
              自定义
            </button>
          </div>

          <div className="timer-display">
            {timerStyle === 'digital' ? (
              <div className="digital-timer">
                <div className="time-text">{formatTime(timeLeft)}</div>
                
                {/* 可拖拽的时间设置滑块 */}
                <div className="time-slider-container">
                  <input
                    type="range"
                    className="time-slider"
                    min="1"
                    max="120"
                    value={isCustomMode ? customTime : Math.round(timeLeft / 60)}
                    onChange={handleTimeChange}
                    disabled={isRunning}
                    style={{
                      '--slider-color': isCustomMode ? '#a855f7' : modes[mode].color
                    }}
                  />
                  <div className="slider-labels">
                    <span>1 分钟</span>
                    <span>{isCustomMode ? `${customTime} 分钟` : `${Math.round(timeLeft / 60)} 分钟`}</span>
                    <span>120 分钟</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="circular-timer">
                <svg viewBox="0 0 100 100" className="circular-svg">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={isCustomMode ? '#a855f7' : modes[mode].color} strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="circular-time">{formatTime(timeLeft)}</div>
              </div>
            )}
          </div>

          <div className="timer-controls">
            <button className="control-btn primary" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <><PauseIcon size={20} /><span>暂停</span></> : <><PlayIcon size={20} /><span>开始</span></>}
            </button>
            <button className="control-btn" onClick={resetTimer}>
              <ResetIcon size={20} /><span>重置</span>
            </button>
          </div>

          <div className="timer-settings">
            <div className="setting-group">
              <span className="setting-label">样式</span>
              <div className="setting-btns">
                <button className={timerStyle === 'digital' ? 'active' : ''} onClick={() => setTimerStyle('digital')}>数字</button>
                <button className={timerStyle === 'circular' ? 'active' : ''} onClick={() => setTimerStyle('circular')}>圆形</button>
              </div>
            </div>
          </div>
        </div>

        <div className="timer-sidebar">
          <h4 className="sidebar-title">专注的待办</h4>
          {selectedTodoId ? (
            <div className="selected-todo-info">
              <p>已选择待办 ID: {selectedTodoId}</p>
              <button className="clear-selection-btn" onClick={() => onSelectTodo(null)}>
                清除选择
              </button>
            </div>
          ) : (
            <p className="no-selection">请在左侧选择一个待办事项</p>
          )}
        </div>
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
  const [selectedDate, setSelectedDate] = useState(null)

  const generateHeatmapData = () => {
    const data = {}
    const now = new Date()
    
    if (viewMode === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1)
      for (let d = new Date(yearStart); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const daySessions = sessions.filter(s => {
          const sDate = new Date(s.completedAt).toISOString().split('T')[0]
          return sDate === dateStr
        })
        data[dateStr] = {
          count: daySessions.length,
          sessions: daySessions,
          totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        }
      }
    } else if (viewMode === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        const daySessions = sessions.filter(s => {
          const sDate = new Date(s.completedAt).toISOString().split('T')[0]
          return sDate === dateStr
        })
        data[dateStr] = {
          count: daySessions.length,
          sessions: daySessions,
          totalDuration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        }
      }
    } else if (viewMode === 'day') {
      const today = now.toISOString().split('T')[0]
      for (let h = 0; h < 24; h++) {
        const hourKey = `${today} ${h.toString().padStart(2, '0')}`
        const hourSessions = sessions.filter(s => {
          const sDate = new Date(s.completedAt)
          const sHour = sDate.getHours()
          const sDateStr = sDate.toISOString().split('T')[0]
          return sDateStr === today && sHour === h
        })
        data[hourKey] = {
          count: hourSessions.length,
          sessions: hourSessions,
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
    if (intensity > 0.5) return 'rgba(255,149,0,0.7)'
    if (intensity > 0.25) return 'rgba(255,149,0,0.5)'
    return 'rgba(255,149,0,0.3)'
  }

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) return `${h}小时${m}分钟`
    return `${m}分钟`
  }

  const getMonthName = (month) => {
    const months = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', 
                    '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']
    return months[month]
  }

  const getWeekdayName = (day) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    return weekdays[day]
  }

  return (
    <div className="heatmap-section">
      <div className="heatmap-header">
        <h3 className="heatmap-title">专注热力图</h3>
        <div className="heatmap-legend">
          <span className="legend-label">少</span>
          <div className="legend-colors">
            <div className="legend-box" style={{ background: 'rgba(255,149,0,0.2)' }}></div>
            <div className="legend-box" style={{ background: 'rgba(255,149,0,0.4)' }}></div>
            <div className="legend-box" style={{ background: 'rgba(255,149,0,0.7)' }}></div>
            <div className="legend-box" style={{ background: 'rgba(255,149,0,0.9)' }}></div>
          </div>
          <span className="legend-label">多</span>
        </div>
      </div>

      <div className="heatmap-controls">
        <button className={`view-btn ${viewMode === 'year' ? 'active' : ''}`} onClick={() => setViewMode('year')}>
          <CalendarIcon size={16} />
          <span>年度</span>
        </button>
        <button className={`view-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>
          <CalendarIcon size={16} />
          <span>月度</span>
        </button>
        <button className={`view-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>
          <ClockIcon size={16} />
          <span>每日</span>
        </button>
      </div>

      <div className="heatmap-container">
        {viewMode === 'year' && (
          <div className="heatmap-grid year-grid">
            {Array.from({ length: 12 }).map((_, month) => (
              <div key={month} className="heatmap-month">
                <div className="month-label">{getMonthName(month)}</div>
                <div className="heatmap-days">
                  {Array.from({ length: 31 }).map((_, day) => {
                    const date = new Date(new Date().getFullYear(), month, day + 1)
                    const dateStr = date.toISOString().split('T')[0]
                    const cellData = heatmapData[dateStr] || { count: 0, sessions: [] }
                    const weekday = date.getDay()
                    return (
                      <div
                        key={day}
                        className={`heatmap-cell ${cellData.count > 0 ? 'has-data' : ''}`}
                        style={{ background: getColor(cellData.count) }}
                        onMouseEnter={() => setHoverData({ 
                          date: dateStr, 
                          count: cellData.count,
                          duration: cellData.totalDuration
                        })}
                        onMouseLeave={() => setHoverData(null)}
                        onClick={() => setSelectedDate(cellData.count > 0 ? { date: dateStr, ...cellData } : null)}
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
              const cellData = heatmapData[dateStr] || { count: 0, sessions: [] }
              return (
                <div
                  key={day}
                  className={`heatmap-cell large ${cellData.count > 0 ? 'has-data' : ''}`}
                  style={{ background: getColor(cellData.count) }}
                  onMouseEnter={() => setHoverData({ 
                    date: dateStr, 
                    count: cellData.count,
                    duration: cellData.totalDuration
                  })}
                  onMouseLeave={() => setHoverData(null)}
                  onClick={() => setSelectedDate(cellData.count > 0 ? { date: dateStr, ...cellData } : null)}
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
              const hourKey = `${today} ${hour.toString().padStart(2, '0')}`
              const cellData = heatmapData[hourKey] || { count: 0, sessions: [] }
              return (
                <div
                  key={hour}
                  className={`heatmap-cell hour-cell ${cellData.count > 0 ? 'has-data' : ''}`}
                  style={{ background: getColor(cellData.count) }}
                  onMouseEnter={() => setHoverData({ 
                    hour: `${hour}:00-${hour + 1}:00`, 
                    count: cellData.count,
                    duration: cellData.totalDuration
                  })}
                  onMouseLeave={() => setHoverData(null)}
                >
                  <span className="cell-hour">{hour}</span>
                </div>
              )
            })}
          </div>
        )}

        {hoverData && (
          <div className="heatmap-tooltip hover-tooltip">
            {hoverData.date && <div className="tooltip-date">📅 {hoverData.date}</div>}
            {hoverData.hour && <div className="tooltip-hour">⏰ {hoverData.hour}</div>}
            <div className="tooltip-stats">
              <div>🍅 完成：{hoverData.count} 个番茄</div>
              <div>⏱️ 专注：{formatDuration(hoverData.duration || 0)}</div>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="heatmap-detail-panel">
            <div className="detail-header">
              <h4>📅 {selectedDate.date}</h4>
              <button className="close-btn" onClick={() => setSelectedDate(null)}>×</button>
            </div>
            <div className="detail-stats">
              <div className="detail-stat">
                <span className="stat-icon">🍅</span>
                <span className="stat-value">{selectedDate.count}</span>
                <span className="stat-label">个番茄</span>
              </div>
              <div className="detail-stat">
                <span className="stat-icon">⏱️</span>
                <span className="stat-value">{formatDuration(selectedDate.totalDuration)}</span>
                <span className="stat-label">总专注</span>
              </div>
            </div>
            {selectedDate.sessions && selectedDate.sessions.length > 0 && (
              <div className="detail-sessions">
                <h5>专注记录</h5>
                <div className="sessions-list">
                  {selectedDate.sessions.slice(0, 10).map((session, i) => (
                    <div key={i} className="session-item">
                      <span className="session-time">
                        {new Date(session.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="session-duration">
                        {Math.floor((session.duration || 0) / 60)}分钟
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
