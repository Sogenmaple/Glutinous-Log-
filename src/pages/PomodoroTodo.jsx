import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, CalendarIcon, FireIcon, SaveIcon, LoadIcon, AddIcon, RemoveIcon, DragIcon, RepeatDailyIcon, RepeatWeeklyIcon, RepeatMonthlyIcon, CheckIcon } from '../components/icons/SiteIcons'

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
          <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
            <CalendarIcon size={18} /><span>时间轴</span>
          </button>
          <button className={`tab-btn ${activeTab === 'checkin' ? 'active' : ''}`} onClick={() => setActiveTab('checkin')}>
            <FireIcon size={18} /><span>打卡</span>
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <ChartIcon size={18} /><span>统计</span>
          </button>
        </div>

        <div className="pomodoro-content">
          {activeTab === 'timer' && <TimerView />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'checkin' && <CheckinView />}
          {activeTab === 'stats' && <StatsView />}
        </div>
      </main>
    </div>
  )
}

// 专注视图
function TimerView() {
  const [activeTodos, setActiveTodos] = useState(() => {
    const saved = localStorage.getItem('pomodoro_active_todos')
    return saved ? JSON.parse(saved) : []
  })
  const [todayDuration, setTodayDuration] = useState(0)

  useEffect(() => {
    const updateTodayDuration = () => {
      const sessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')
      const today = new Date().toISOString().split('T')[0]
      const todaySessions = sessions.filter(s => s.completedAt.startsWith(today) && s.mode === 'work')
      const total = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
      setTodayDuration(total)
    }
    
    updateTodayDuration()
    
    const handleSessionUpdate = () => updateTodayDuration()
    window.addEventListener('sessions-updated', handleSessionUpdate)
    return () => window.removeEventListener('sessions-updated', handleSessionUpdate)
  }, [])

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

  const completeActiveTodo = (todoId, activeTodos, setActiveTodos) => {
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
        window.dispatchEvent(new CustomEvent('sessions-updated'))
      }

      if (todo.repeat && todo.repeat !== 'none') {
        const checkins = JSON.parse(localStorage.getItem('pomodoro_checkins') || '[]')
        const today = new Date().toISOString().split('T')[0]
        const existingCheckin = checkins.find(c => c.habitId === todo.id && c.date === today)
        
        if (!existingCheckin && todo.isHabit) {
          checkins.push({
            id: Date.now(),
            habitId: todo.id,
            habitText: todo.text,
            date: today,
            completedAt: new Date().toISOString(),
            duration: completedTime,
            type: 'auto'
          })
          localStorage.setItem('pomodoro_checkins', JSON.stringify(checkins))
          window.dispatchEvent(new CustomEvent('checkins-updated'))
        }

        const habits = JSON.parse(localStorage.getItem('pomodoro_habits') || '[]')
        habits.forEach(habit => {
          if (habit.id === todo.id) {
            habit.lastCompleted = today
            habit.totalCompletions = (habit.totalCompletions || 0) + 1
          }
        })
        localStorage.setItem('pomodoro_habits', JSON.stringify(habits))
        window.dispatchEvent(new CustomEvent('habits-updated'))

        if (todo.repeat !== 'none') {
          const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
          todos.push({ ...todo, duration: todo.duration || 25, remainingTime: todo.duration || 25 })
          localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
          window.dispatchEvent(new CustomEvent('todos-updated'))
        }
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
          <div className="today-duration">
            <span>今日专注</span>
            <span className="duration-value">{Math.floor(todayDuration / 60)} 分钟</span>
          </div>
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
                onComplete={() => completeActiveTodo(todo.id, activeTodos, setActiveTodos)}
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [config, setConfig] = useState({ priority: 'medium', dueDate: '', duration: 25, repeat: 'none', unit: '', isHabit: false })

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
      repeat: 'none',
      unit: '',
      isHabit: false,
      createdAt: new Date().toISOString()
    }])
    setNewTodo('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    setShowDeleteConfirm(null)
  }

  const confirmDelete = (id) => setShowDeleteConfirm(id)

  const saveConfig = () => {
    if (!showConfig) return
    setTodos(todos.map(todo => todo.id === showConfig ? {
      ...todo,
      priority: config.priority,
      dueDate: config.dueDate || null,
      duration: config.duration,
      repeat: config.repeat,
      unit: config.unit || null,
      isHabit: config.isHabit
    } : todo))
    setShowConfig(null)
  }

  const openConfig = (todo) => {
    setConfig({ 
      priority: todo.priority || 'medium', 
      dueDate: todo.dueDate || '', 
      duration: todo.duration || 25,
      repeat: todo.repeat || 'none',
      unit: todo.unit || '',
      isHabit: todo.isHabit || false
    })
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
          filteredTodos.map((todo, index) => (
            <div key={`${todo.id}-${index}`} className="todo-item" draggable onDragStart={(e) => handleDragStart(e, todo)}>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <div className="todo-indicators">
                  <span className={`priority-dot priority-${todo.priority}`} title={`优先级：${todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}`}></span>
                  {todo.repeat && todo.repeat !== 'none' && (
                    <span className="repeat-icon-vector" title={`重复：${todo.repeat === 'daily' ? '每日' : todo.repeat === 'weekly' ? '每周' : '每月'}`}>
                      {todo.repeat === 'daily' && <RepeatDailyIcon size={14} />}
                      {todo.repeat === 'weekly' && <RepeatWeeklyIcon size={14} />}
                      {todo.repeat === 'monthly' && <RepeatMonthlyIcon size={14} />}
                    </span>
                  )}
                </div>
              </div>
              <div className="todo-actions-hidden">
                <button className="action-btn-icon" onClick={() => openConfig(todo)} title="配置">⚙</button>
                <button className="action-btn-icon move" onClick={() => onMoveToActive(todo)} title="移到专注">➤</button>
                <button className="action-btn-icon delete" onClick={() => confirmDelete(todo.id)} title="删除">×</button>
              </div>

              {showConfig === todo.id && (
                <div className="config-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="config-content">
                    <h4>配置待办</h4>
                    <div className="config-field">
                      <label>优先级</label>
                      <div className="custom-select">
                        <select value={config.priority} onChange={(e) => setConfig({ ...config, priority: e.target.value })}>
                          <option value="low">低</option>
                          <option value="medium">中</option>
                          <option value="high">高</option>
                        </select>
                      </div>
                    </div>
                    <div className="config-field">
                      <label>截止日期</label>
                      <input type="date" value={config.dueDate} onChange={(e) => setConfig({ ...config, dueDate: e.target.value })} className="config-input" />
                    </div>
                    <div className="config-field">
                      <label>持续时间：{config.duration} 分钟</label>
                      <input type="range" min="5" max="180" step="5" value={config.duration} onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })} className="config-slider" />
                    </div>
                    <div className="config-field">
                      <label>重复类型</label>
                      <div className="custom-select">
                        <select value={config.repeat} onChange={(e) => setConfig({ ...config, repeat: e.target.value })}>
                          <option value="none">一次性</option>
                          <option value="daily">每日</option>
                          <option value="weekly">每周</option>
                          <option value="monthly">每月</option>
                        </select>
                      </div>
                    </div>
                    {config.repeat !== 'none' && (
                      <>
                        <div className="config-field">
                          <label>单位/量词（可选）</label>
                          <input type="text" placeholder="如：个、次、页、小时" value={config.unit} onChange={(e) => setConfig({ ...config, unit: e.target.value })} className="config-input" />
                        </div>
                        <div className="config-field checkbox-field">
                          <input type="checkbox" id="isHabit" checked={config.isHabit} onChange={(e) => setConfig({ ...config, isHabit: e.target.checked })} />
                          <label htmlFor="isHabit">这是习惯打卡任务</label>
                        </div>
                      </>
                    )}
                    <div className="config-actions">
                      <button className="cancel-btn" onClick={() => setShowConfig(null)}>取消</button>
                      <button className="delete-btn-config" onClick={() => { setShowConfig(null); confirmDelete(todo.id) }}>删除</button>
                      <button className="save-btn" onClick={saveConfig}>保存</button>
                    </div>
                  </div>
                </div>
              )}

              {showDeleteConfirm === todo.id && (
                <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
                  <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                    <p>确定要删除这个待办吗？</p>
                    <div className="delete-confirm-actions">
                      <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>取消</button>
                      <button className="delete-confirm-btn" onClick={() => deleteTodo(todo.id)}>删除</button>
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
    setTimeLeft((todo.remainingTime || 25) * 60)
  }, [todo.remainingTime])

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
  }, [isRunning, onUpdateTime, onComplete])

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
          {todo.repeat && todo.repeat !== 'none' && (
            <span className="repeat-tag">{todo.repeat === 'daily' ? '每日' : todo.repeat === 'weekly' ? '每周' : '每月'}</span>
          )}
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
        {todo.unit && <span className="info-item">单位：{todo.unit}</span>}
      </div>
    </div>
  )
}

// 时间轴视图 - v8.0 风格统一
function TimelineView() {
  const [todos] = useState(() => JSON.parse(localStorage.getItem('pomodoro_todos') || '[]'))
  const [tracks, setTracks] = useState(() => {
    const saved = localStorage.getItem('pomodoro_timeline_tracks')
    return saved ? JSON.parse(saved) : [{id:1,name:""}, {id:2,name:""}, {id:3,name:""}]
  })
  const [timelineItems, setTimelineItems] = useState(() => JSON.parse(localStorage.getItem('pomodoro_timeline_items') || '[]'))
  const [presets, setPresets] = useState(() => JSON.parse(localStorage.getItem('pomodoro_timeline_presets') || '[]'))
  const [showPresets, setShowPresets] = useState(false)
  const [draggedTodo, setDraggedTodo] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    localStorage.setItem('pomodoro_timeline_tracks', JSON.stringify(tracks))
  }, [tracks])

  useEffect(() => {
    localStorage.setItem('pomodoro_timeline_items', JSON.stringify(timelineItems))
  }, [timelineItems])

  const [draggedBlock, setDraggedBlock] = useState(null)

  const handleDragStart = (e, todo) => {
    setDraggedTodo(todo)
    e.dataTransfer.setData('todo', JSON.stringify(todo))
    e.dataTransfer.setData('type', 'todo')
  }

  const handleBlockDragStart = (e, item) => {
    setDraggedBlock(item)
    e.dataTransfer.setData('block', JSON.stringify(item))
    e.dataTransfer.setData('type', 'block')
  }

  const handleDropOnTrack = (e, trackId, hour) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('type')
    
    if (type === 'todo') {
      const todoData = e.dataTransfer.getData('todo')
      if (todoData) {
        const todo = JSON.parse(todoData)
        const newItem = {
          id: Date.now(),
          todoId: todo.id,
          todoText: todo.text,
          trackId,
          startHour: hour,
          duration: 2,
          color: todo.priority === 'high' ? '#ff453a' : todo.priority === 'medium' ? '#ff9500' : '#06b6d4',
          priority: todo.priority || 'medium',
          repeat: todo.repeat || 'none'
        }
        const updated = [...timelineItems, newItem]
        setTimelineItems(updated)
        localStorage.setItem('pomodoro_timeline_items', JSON.stringify(updated))
      }
    } else if (type === 'block') {
      const blockData = e.dataTransfer.getData('block')
      if (blockData) {
        const block = JSON.parse(blockData)
        if (block.id !== draggedBlock?.id) return
        const updated = timelineItems.map(item => 
          item.id === block.id ? { ...item, trackId, startHour: hour } : item
        )
        setTimelineItems(updated)
        localStorage.setItem('pomodoro_timeline_items', JSON.stringify(updated))
      }
    }
    setDraggedTodo(null)
    setDraggedBlock(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDropOnSidebar = (e) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('type')
    if (type === 'block') {
      const blockData = e.dataTransfer.getData('block')
      if (blockData) {
        const block = JSON.parse(blockData)
        const updated = timelineItems.filter(item => item.id !== block.id)
        setTimelineItems(updated)
        localStorage.setItem('pomodoro_timeline_items', JSON.stringify(updated))
      }
      setDraggedBlock(null)
    }
  }

  const resizeItem = (itemId, trackId, newStart, newDuration) => {
    const updated = timelineItems.map(item => {
      if (item.id === itemId) {
        return { ...item, startHour: Math.max(0, Math.min(23, newStart)), duration: Math.max(1, Math.min(24 - newStart, newDuration)) }
      }
      return item
    })
    setTimelineItems(updated)
  }

  const moveItemBack = (item) => {
    const updated = timelineItems.filter(i => i.id !== item.id)
    setTimelineItems(updated)
  }

  const executeItem = (item) => {
    const todo = todos.find(t => t.id === item.todoId)
    if (todo) {
      const activeTodos = JSON.parse(localStorage.getItem('pomodoro_active_todos') || '[]')
      const activeTodo = { ...todo, startedAt: new Date().toISOString(), remainingTime: item.duration * 60 }
      localStorage.setItem('pomodoro_active_todos', JSON.stringify([...activeTodos, activeTodo]))
      window.location.hash = '#/special/pomodoro'
    }
  }

  const savePreset = () => {
    const presetName = prompt('请输入预设名称：')
    if (presetName) {
      const newPreset = {
        id: Date.now(),
        name: presetName,
        tracks: tracks.filter(t => t.id !== 1),
        items: timelineItems
      }
      const updated = [...presets, newPreset]
      setPresets(updated)
      localStorage.setItem('pomodoro_timeline_presets', JSON.stringify(updated))
    }
  }

  const loadPreset = (preset) => {
    if (confirm(`加载预设"${preset.name}"？这将覆盖当前时间轴。`)) {
      setTracks([{id:1,name:""}, {id:2,name:""}, {id:3,name:""}, ...preset.tracks])
      setTimelineItems(preset.items)
      setShowPresets(false)
    }
  }

  const deletePreset = (presetId) => {
    if (confirm('确定删除此预设？')) {
      const updated = presets.filter(p => p.id !== presetId)
      setPresets(updated)
      localStorage.setItem('pomodoro_timeline_presets', JSON.stringify(updated))
    }
  }

  const addTrack = () => {
    setTracks([...tracks, {id:Date.now(),name:""}])
  }

  const removeTrack = (trackId) => {
    setShowDeleteConfirm({type:'track', id:trackId})
  }

  const confirmRemoveTrack = () => {
    if (!showDeleteConfirm) return
    const trackId = showDeleteConfirm.id
    if (tracks.length <= 3) {
      alert('至少保留 3 条轨道')
      return
    }
    setTracks(tracks.filter(t => t.id !== trackId))
    setTimelineItems(timelineItems.filter(i => i.trackId !== trackId))
    setShowDeleteConfirm(null)
  }

  const deleteItem = (itemId) => {
    setShowDeleteConfirm({type:'item', id:itemId})
  }

  const confirmDeleteItem = () => {
    if (!showDeleteConfirm) return
    const itemId = showDeleteConfirm.id
    const updated = timelineItems.filter(item => item.id !== itemId)
    setTimelineItems(updated)
    setShowDeleteConfirm(null)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="timeline-view">
      <div className="timeline-toolbar">
        <div className="timeline-title-group">
          <h3>时间轴规划</h3>
        </div>
        <div className="timeline-toolbar-actions">
          <button className="toolbar-btn-icon" onClick={addTrack} title="添加轨道"><AddIcon size={16} /></button>
          <button className="toolbar-btn-icon" onClick={() => setShowPresets(!showPresets)} title="预设">
            <LoadIcon size={16} />
          </button>
          <button className="toolbar-btn-icon primary" onClick={savePreset} title="保存预设">
            <SaveIcon size={16} />
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="presets-panel">
          <div className="presets-header">
            <h4>保存的预设</h4>
            <button className="close-btn" onClick={() => setShowPresets(false)}>×</button>
          </div>
          {presets.length === 0 ? (
            <div className="empty-presets">暂无保存的预设</div>
          ) : (
            <div className="presets-list">
              {presets.map(preset => (
                <div key={preset.id} className="preset-item">
                  <span className="preset-name">{preset.name}</span>
                  <div className="preset-actions">
                    <button className="load-preset-btn" onClick={() => loadPreset(preset)}>加载</button>
                    <button className="delete-preset-btn" onClick={() => deletePreset(preset.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="timeline-content">
        <div className="todo-sidebar" onDragOver={handleDragOver} onDrop={(e) => handleDropOnSidebar(e)}>
          <h4>待办事项</h4>
          <div className="todo-drag-list">
            {todos.filter(t => !t.completed).map((todo, index) => (
              <div 
                key={`${todo.id}-${index}`} 
                className="todo-drag-item"
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
              >
                <DragIcon size={14} />
                <span className="todo-drag-text">{todo.text}</span>
                <span className="todo-drag-duration">{todo.duration}分钟</span>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-tracks-container">
          <div className="timeline-header-row">
            <div className="track-label-column"></div>
            <div className="hours-header">
              {hours.map(hour => (
                <div key={hour} className="hour-label">{hour.toString().padStart(2, '0')}</div>
              ))}
            </div>
          </div>

          {tracks.map(track => (
            <div key={track.id} className="timeline-track">
              <div className="track-label">
                <span className="track-indicator"></span>
                <button className="remove-track-btn-hidden" onClick={() => removeTrack(track.id)}>×</button>
              </div>
              <div className="track-content" onDragOver={handleDragOver}>
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    className="hour-cell"
                    onDrop={(e) => handleDropOnTrack(e, track.id, hour)}
                  />
                ))}
                {timelineItems.filter(item => item.trackId === track.id).map(item => (
                  <div 
                    key={item.id}
                    className="timeline-block"
                    draggable
                    onDragStart={(e) => handleBlockDragStart(e, item)}
                    style={{ 
                      backgroundColor: item.color + '30',
                      borderLeft: `3px solid ${item.color}`,
                      left: `${(item.startHour / 24) * 100}%`,
                      width: `${(item.duration / 24) * 100}%`
                    }}
                  >
                    <div className="timeline-block-indicators">
                      <span className={`priority-dot priority-${item.priority}`}></span>
                      {item.repeat && item.repeat !== 'none' && (
                        <span className="repeat-icon">
                          {item.repeat === 'daily' && <RepeatDailyIcon size={12} />}
                          {item.repeat === 'weekly' && <RepeatWeeklyIcon size={12} />}
                          {item.repeat === 'monthly' && <RepeatMonthlyIcon size={12} />}
                        </span>
                      )}
                    </div>
                    <div className="timeline-block-text">{item.todoText}</div>
                    <div className="timeline-block-resize timeline-block-resize-left"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const startX = e.clientX
                        const originalStart = item.startHour
                        const handleMouseMove = (moveEvent) => {
                          const diff = Math.round((moveEvent.clientX - startX) / 30)
                          const newStart = Math.max(0, Math.min(item.startHour + item.duration - 1, originalStart + diff))
                          const newDuration = item.duration + (originalStart - newStart)
                          resizeItem(item.id, track.id, newStart, newDuration)
                        }
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove)
                          document.removeEventListener('mouseup', handleMouseUp)
                        }
                        document.addEventListener('mousemove', handleMouseMove)
                        document.addEventListener('mouseup', handleMouseUp)
                      }}
                    />
                    <div className="timeline-block-resize timeline-block-resize-right"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const startX = e.clientX
                        const originalDuration = item.duration
                        const handleMouseMove = (moveEvent) => {
                          const diff = Math.round((moveEvent.clientX - startX) / 30)
                          resizeItem(item.id, track.id, item.startHour, Math.max(1, originalDuration + diff))
                        }
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove)
                          document.removeEventListener('mouseup', handleMouseUp)
                        }
                        document.addEventListener('mousemove', handleMouseMove)
                        document.addEventListener('mouseup', handleMouseUp)
                      }}
                    />
                    <div className="timeline-block-actions-hidden">
                      <button className="execute-block-btn-hidden" onClick={() => executeItem(item)}>执行</button>
                      <button className="move-back-block-btn-hidden" onClick={() => moveItemBack(item)}>放回</button>
                      <button className="delete-block-btn-hidden" onClick={() => deleteItem(item.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="timeline-help">
        <p>提示：将左侧待办拖到轨道上 · 拖动两端调整时间 · 拖动块切换时间 · 点击执行开始专注</p>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p>{showDeleteConfirm.type === 'track' ? '确定删除此轨道？' : '确定删除此时间块？'}</p>
            <div className="delete-confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>取消</button>
              <button className="delete-confirm-btn" onClick={showDeleteConfirm.type === 'track' ? confirmRemoveTrack : confirmDeleteItem}>删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 打卡视图
function CheckinView() {
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('pomodoro_habits') || '[]'))
  const [checkins, setCheckins] = useState(() => JSON.parse(localStorage.getItem('pomodoro_checkins') || '[]'))
  const [newHabit, setNewHabit] = useState('')
  const [habitConfig, setHabitConfig] = useState({ repeat: 'daily', unit: '', needFocus: true })

  useEffect(() => {
    const handleCheckinsUpdate = () => setCheckins(JSON.parse(localStorage.getItem('pomodoro_checkins') || '[]'))
    const handleHabitsUpdate = () => setHabits(JSON.parse(localStorage.getItem('pomodoro_habits') || '[]'))
    window.addEventListener('checkins-updated', handleCheckinsUpdate)
    window.addEventListener('habits-updated', handleHabitsUpdate)
    return () => {
      window.removeEventListener('checkins-updated', handleCheckinsUpdate)
      window.removeEventListener('habits-updated', handleHabitsUpdate)
    }
  }, [])

  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    const habit = {
      id: Date.now(),
      text: newHabit.trim(),
      repeat: habitConfig.repeat,
      unit: habitConfig.unit || '',
      needFocus: habitConfig.needFocus,
      createdAt: new Date().toISOString(),
      totalCompletions: 0,
      lastCompleted: null
    }
    setHabits([...habits, habit])
    setNewHabit('')
    
    if (habitConfig.needFocus) {
      const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
      todos.push({
        id: habit.id,
        text: habit.text,
        completed: false,
        priority: 'medium',
        duration: 25,
        repeat: habit.repeat,
        unit: habit.unit,
        isHabit: true,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
      window.dispatchEvent(new CustomEvent('todos-updated'))
    }
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id))
    const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
    localStorage.setItem('pomodoro_todos', JSON.stringify(todos.filter(t => t.id !== id)))
    window.dispatchEvent(new CustomEvent('todos-updated'))
  }

  const manualCheckin = (habit) => {
    const checkins = JSON.parse(localStorage.getItem('pomodoro_checkins') || '[]')
    const today = new Date().toISOString().split('T')[0]
    const existingCheckin = checkins.find(c => c.habitId === habit.id && c.date === today)
    
    if (!existingCheckin) {
      checkins.push({
        id: Date.now(),
        habitId: habit.id,
        habitText: habit.text,
        date: today,
        completedAt: new Date().toISOString(),
        duration: 0,
        type: 'manual'
      })
      localStorage.setItem('pomodoro_checkins', JSON.stringify(checkins))
      window.dispatchEvent(new CustomEvent('checkins-updated'))
      
      const habits = JSON.parse(localStorage.getItem('pomodoro_habits') || '[]')
      habits.forEach(h => {
        if (h.id === habit.id) {
          h.lastCompleted = today
          h.totalCompletions = (h.totalCompletions || 0) + 1
        }
      })
      localStorage.setItem('pomodoro_habits', JSON.stringify(habits))
      window.dispatchEvent(new CustomEvent('habits-updated'))
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayCheckins = checkins.filter(c => c.date === today)

  const getStreak = (habitId) => {
    const habitCheckins = checkins.filter(c => c.habitId === habitId).sort((a, b) => new Date(b.date) - new Date(a.date))
    if (habitCheckins.length === 0) return 0
    
    let streak = 1
    let currentDate = new Date(habitCheckins[0].date)
    
    for (let i = 1; i < habitCheckins.length; i++) {
      const prevDate = new Date(habitCheckins[i].date)
      const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        streak++
        currentDate = prevDate
      } else if (diffDays > 1) {
        break
      }
    }
    
    return streak
  }

  const getCompletedToday = (habitId) => {
    return checkins.some(c => c.habitId === habitId && c.date === today)
  }

  return (
    <div className="checkin-view">
      <div className="checkin-header">
        <h3>习惯打卡</h3>
        <p className="checkin-subtitle">记录每日坚持，培养长期习惯</p>
      </div>

      <form className="add-habit-form" onSubmit={addHabit}>
        <input 
          type="text" 
          className="habit-input" 
          placeholder="添加新习惯（如：背单词、阅读、运动）..." 
          value={newHabit} 
          onChange={(e) => setNewHabit(e.target.value)} 
        />
        <div className="custom-select">
          <select 
            value={habitConfig.repeat}
            onChange={(e) => setHabitConfig({ ...habitConfig, repeat: e.target.value })}
          >
            <option value="daily">每日</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>
        <input 
          type="text" 
          className="habit-unit-input" 
          placeholder="单位（如：个、页）" 
          value={habitConfig.unit}
          onChange={(e) => setHabitConfig({ ...habitConfig, unit: e.target.value })}
        />
        <label className="habit-checkbox">
          <input 
            type="checkbox"
            checked={habitConfig.needFocus}
            onChange={(e) => setHabitConfig({ ...habitConfig, needFocus: e.target.checked })}
          />
          <span>需要专注</span>
        </label>
        <button type="submit" className="add-habit-btn"><PlusIcon size={18} /></button>
      </form>

      <div className="today-summary">
        <h4>今日打卡</h4>
        <p>{todayCheckins.length} 项已完成</p>
      </div>

      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-habits">
            <p>暂无习惯</p>
            <p className="empty-habits-hint">添加一个习惯开始打卡</p>
          </div>
        ) : (
          habits.map((habit, index) => {
            const completedToday = getCompletedToday(habit.id)
            const streak = getStreak(habit.id)
            return (
              <div key={`${habit.id}-${index}`} className={`habit-card ${completedToday ? 'completed' : ''}`}>
                <div className="habit-info">
                  <div className="habit-text">{habit.text}</div>
                  <div className="habit-meta">
                    <span className="habit-repeat">
                      {habit.repeat === 'daily' ? '每日' : habit.repeat === 'weekly' ? '每周' : '每月'}
                    </span>
                    {habit.unit && <span className="habit-unit">{habit.unit}</span>}
                    <span className="habit-type">{habit.needFocus ? '需专注' : '手动打卡'}</span>
                  </div>
                </div>
                <div className="habit-stats">
                  <div className="streak-badge">
                    <FireIcon size={14} /> {streak} 天
                  </div>
                  <div className="total-badge">
                    <CheckIcon size={14} /> {habit.totalCompletions || 0} 次
                  </div>
                </div>
                <div className="habit-actions">
                  {!completedToday && !habit.needFocus && (
                    <button className="manual-checkin-btn" onClick={() => manualCheckin(habit)}>打卡</button>
                  )}
                  {completedToday ? (
                    <span className="completed-tag">已完成</span>
                  ) : (
                    <span className="pending-tag">未完成</span>
                  )}
                  <button className="delete-habit-btn" onClick={() => deleteHabit(habit.id)}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {checkins.length > 0 && (
        <div className="recent-checkins">
          <h4>最近打卡记录</h4>
          <div className="checkins-list">
            {checkins.slice(-10).reverse().map(checkin => (
              <div key={checkin.id} className="checkin-item">
                <span className="checkin-text">{checkin.habitText}</span>
                <span className="checkin-date">{new Date(checkin.date).toLocaleDateString('zh-CN')}</span>
                {checkin.duration && <span className="checkin-duration">{checkin.duration} 分钟</span>}
                <span className="checkin-type">{checkin.type === 'manual' ? '手动' : '自动'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 统计视图
function StatsView() {
  const [viewType, setViewType] = useState('daily')
  const [chartType, setChartType] = useState('bar')
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]'))

  useEffect(() => {
    const handleUpdate = () => setSessions(JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]'))
    window.addEventListener('sessions-updated', handleUpdate)
    return () => window.removeEventListener('sessions-updated', handleUpdate)
  }, [])

  const [hoveredHour, setHoveredHour] = useState(null)

  const getFilteredData = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    if (viewType === 'daily') {
      const daySessions = sessions.filter(s => s.completedAt.startsWith(today) && s.mode === 'work')
      const byHour = {}
      const byHourDetails = {}
      for (let h = 0; h < 24; h++) { byHour[h] = 0; byHourDetails[h] = [] }
      daySessions.forEach(s => {
        const hour = new Date(s.completedAt).getHours()
        byHour[hour] = (byHour[hour] || 0) + (s.duration || 0)
        byHourDetails[hour].push(s)
      })
      return { 
        data: Object.values(byHour), 
        labels: Object.keys(byHour).map(k => `${k}:00`),
        details: byHourDetails,
        total: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        count: daySessions.length
      }
    } else if (viewType === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const weekSessions = sessions.filter(s => new Date(s.completedAt) >= weekAgo && s.mode === 'work')
      const byDay = {}
      const byDayDetails = {}
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      for (let i = 0; i < 7; i++) { byDay[dayNames[i]] = 0; byDayDetails[dayNames[i]] = [] }
      weekSessions.forEach(s => {
        const day = dayNames[new Date(s.completedAt).getDay()]
        byDay[day] = (byDay[day] || 0) + (s.duration || 0)
        byDayDetails[day].push(s)
      })
      return { 
        data: Object.values(byDay), 
        labels: Object.keys(byDay),
        details: byDayDetails,
        total: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        count: weekSessions.length
      }
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthSessions = sessions.filter(s => new Date(s.completedAt) >= monthStart && s.mode === 'work')
      const byDay = {}
      const byDayDetails = {}
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      for (let d = 1; d <= daysInMonth; d++) { byDay[d] = 0; byDayDetails[d] = [] }
      monthSessions.forEach(s => {
        const day = new Date(s.completedAt).getDate()
        byDay[day] = (byDay[day] || 0) + (s.duration || 0)
        byDayDetails[day].push(s)
      })
      return { 
        data: Object.values(byDay), 
        labels: Object.keys(byDay).map(k => `${k}日`),
        details: byDayDetails,
        total: monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        count: monthSessions.length
      }
    }
  }

  const filtered = getFilteredData()
  const maxValue = Math.max(...filtered.data, 1)
  const totalDuration = filtered.total || 0
  const totalCount = filtered.count || 0

  return (
    <div className="stats-view">
      <div className="stats-header">
        <h3>数据统计</h3>
        <div className="stats-controls">
          <div className="custom-select">
            <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
              <option value="daily">今日</option>
              <option value="weekly">本周</option>
              <option value="monthly">本月</option>
            </select>
          </div>
          <div className="custom-select">
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">柱状图</option>
              <option value="line">折线图</option>
              <option value="pie">扇形图</option>
            </select>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <div className="summary-value">{Math.floor(totalDuration / 60)}</div>
          <div className="summary-label">总专注时长（分钟）</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{totalCount}</div>
          <div className="summary-label">专注次数</div>
        </div>
      </div>

      <div className="stats-chart-container">
        {filtered.data.length === 0 || totalDuration === 0 ? (
          <div className="empty-chart">
            <p>暂无数据</p>
            <p className="empty-chart-hint">开始专注后这里会显示统计图表</p>
          </div>
        ) : (
          <>
            {chartType === 'bar' && (
              <div className="bar-chart">
                {filtered.data.map((value, i) => (
                  <div 
                    key={i} 
                    className="bar-item"
                    onMouseEnter={() => setHoveredHour(i)}
                    onMouseLeave={() => setHoveredHour(null)}
                  >
                    <div 
                      className="bar-fill" 
                      style={{ height: `${(value / maxValue) * 100}%` }}
                    ></div>
                    <div className="bar-label">{filtered.labels[i]}</div>
                    <div className="bar-value">{Math.floor(value / 60)}m</div>
                    {hoveredHour === i && filtered.details && filtered.details[i] && filtered.details[i].length > 0 && (
                      <div className="bar-tooltip">
                        {filtered.details[i].map((session, idx) => (
                          <div key={idx} className="tooltip-item">
                            <span className="tooltip-text">{session.todoText || '专注'}</span>
                            <span className="tooltip-duration">{Math.floor((session.duration || 0) / 60)}分钟</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {chartType === 'line' && (
              <div className="line-chart">
                <svg viewBox="0 0 400 200" className="line-svg">
                  <polyline
                    fill="none"
                    stroke="#ff9500"
                    strokeWidth="2"
                    points={filtered.data.map((value, i) => {
                      const x = (i / (filtered.data.length - 1 || 1)) * 380 + 10
                      const y = 190 - (value / maxValue) * 160
                      return `${x},${y}`
                    }).join(' ')}
                  />
                  {filtered.data.map((value, i) => {
                    const x = (i / (filtered.data.length - 1 || 1)) * 380 + 10
                    const y = 190 - (value / maxValue) * 160
                    return (
                      <circle key={i} cx={x} cy={y} r="4" fill="#ff9500" />
                    )
                  })}
                </svg>
                <div className="line-labels">
                  {filtered.labels.map((label, i) => (
                    <div key={i} className="line-label">{label}</div>
                  ))}
                </div>
              </div>
            )}

            {chartType === 'pie' && totalDuration > 0 && (
              <div className="pie-chart">
                <svg viewBox="0 0 100 100" className="pie-svg">
                  {filtered.data.filter(v => v > 0).map((value, i, arr) => {
                    const validValues = arr.filter(v => v > 0)
                    const total = validValues.reduce((sum, v) => sum + v, 0)
                    const percentage = value / total
                    const startAngle = validValues.slice(0, i).reduce((sum, v) => sum + (v / total) * 360, 0)
                    const endAngle = startAngle + percentage * 360
                    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)
                    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)
                    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)
                    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)
                    const largeArc = percentage > 0.5 ? 1 : 0
                    const colors = ['#ff9500', '#06b6d4', '#8b5cf6', '#22c55e', '#ff453a', '#f59e0b']
                    const actualIndex = filtered.data.indexOf(value)
                    return (
                      <path
                        key={actualIndex}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[actualIndex % colors.length]}
                      />
                    )
                  })}
                </svg>
                <div className="pie-legend">
                  {filtered.data.filter((value, i) => value > 0).map((value, i) => {
                    const colors = ['#ff9500', '#06b6d4', '#8b5cf6', '#22c55e', '#ff453a', '#f59e0b']
                    const actualIndex = filtered.data.indexOf(value)
                    return (
                      <div key={actualIndex} className="legend-item">
                        <div className="legend-color" style={{ background: colors[actualIndex % colors.length] }}></div>
                        <span>{filtered.labels[actualIndex]}: {Math.floor(value / 60)}m</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
