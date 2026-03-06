import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, CalendarIcon, FireIcon, SaveIcon, LoadIcon, AddIcon, DragIcon, CheckIcon, RepeatDailyIcon, RepeatWeeklyIcon, RepeatMonthlyIcon } from '../components/icons/SiteIcons'

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

// 专注视图 v8.0
function TimerView() {
  const [activeTodos, setActiveTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pomodoro_active_todos') || '[]') } catch { return [] }
  })
  const [todayDuration, setTodayDuration] = useState(0)
  const [showConfig, setShowConfig] = useState(null)
  const [config, setConfig] = useState({ priority: 'medium', dueDate: '', duration: 25, repeat: 'none', unit: '', isHabit: false })

  useEffect(() => {
    const updateTodayDuration = () => {
      try {
        const sessions = JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')
        const today = new Date().toISOString().split('T')[0]
        const todaySessions = sessions.filter(s => s.completedAt.startsWith(today) && s.mode === 'work')
        const total = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        setTodayDuration(total)
      } catch { setTodayDuration(0) }
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
    try {
      const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
      localStorage.setItem('pomodoro_todos', JSON.stringify(todos.filter(t => t.id !== todoId)))
      window.dispatchEvent(new CustomEvent('todos-updated'))
    } catch {}
  }

  const moveToActive = (todo) => {
    if (!activeTodos.find(t => t.id === todo.id)) {
      const activeTodo = { ...todo, startedAt: new Date().toISOString(), remainingTime: todo.duration || 25 }
      setActiveTodos([...activeTodos, activeTodo])
      removeFromTodos(todo.id)
    }
  }

  const moveBackToTodos = (todo) => {
    try {
      const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
      localStorage.setItem('pomodoro_todos', JSON.stringify([...todos, { ...todo, duration: todo.remainingTime }]))
      window.dispatchEvent(new CustomEvent('todos-updated'))
      setActiveTodos(activeTodos.filter(t => t.id !== todo.id))
    } catch {}
  }

  const completeActiveTodo = (todoId) => {
    const todo = activeTodos.find(t => t.id === todoId)
    if (!todo) return
    
    try {
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

      if (todo.isHabit) {
        const checkins = JSON.parse(localStorage.getItem('pomodoro_checkins') || '[]')
        const today = new Date().toISOString().split('T')[0]
        const existingCheckin = checkins.find(c => c.habitId === todo.id && c.date === today)
        
        if (!existingCheckin) {
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

        if (todo.repeat && todo.repeat !== 'none') {
          const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
          todos.push({ ...todo, duration: todo.duration || 25, remainingTime: todo.duration || 25 })
          localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
          window.dispatchEvent(new CustomEvent('todos-updated'))
        }
      }
    } catch {}
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
    <div className="timer-view-v8">
      <div className="todo-column-v8">
        <div className="column-header-v8">
          <h3>待办清单</h3>
          <span className="column-count-v8">拖到右侧开始专注</span>
        </div>
        <TodosListV8 onMoveToActive={moveToActive} />
      </div>

      <div 
        className={`focus-column-v8 ${activeTodos.length === 0 ? 'drop-zone-v8' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="column-header-v8">
          <h3>专注中</h3>
          <div className="today-duration-v8">
            <span>今日专注</span>
            <span className="duration-value-v8">{Math.floor(todayDuration / 60)} 分钟</span>
          </div>
        </div>
        
        {activeTodos.length === 0 ? (
          <div className="empty-focus-v8">
            <div className="drop-hint-v8">
              <div className="drop-icon-v8">⬆</div>
              <p>将待办事项拖拽到这里</p>
              <p className="drop-sub-v8">开始专注计时</p>
            </div>
          </div>
        ) : (
          <div className="active-todos-list-v8">
            {activeTodos.map(todo => (
              <ActiveTodoCardV8 
                key={todo.id} 
                todo={todo}
                onMoveBack={() => moveBackToTodos(todo)}
                onComplete={() => completeActiveTodo(todo.id)}
                onUpdateTime={(newTime) => updateActiveTodoTime(todo.id, newTime)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TodosListV8({ onMoveToActive }) {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pomodoro_todos') || '[]') } catch { return [] }
  })
  const [newTodo, setNewTodo] = useState('')
  const [showConfig, setShowConfig] = useState(null)
  const [config, setConfig] = useState({ priority: 'medium', dueDate: '', duration: 25, repeat: 'none', unit: '', isHabit: false })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    const handleUpdate = () => {
      try { setTodos(JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')) } catch {}
    }
    window.addEventListener('todos-updated', handleUpdate)
    return () => window.removeEventListener('todos-updated', handleUpdate)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('pomodoro_todos', JSON.stringify(todos)) } catch {}
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

  const getRepeatIcon = (repeat) => {
    if (repeat === 'daily') return <RepeatDailyIcon size={14} />
    if (repeat === 'weekly') return <RepeatWeeklyIcon size={14} />
    if (repeat === 'monthly') return <RepeatMonthlyIcon size={14} />
    return null
  }

  const filteredTodos = todos.filter(t => !t.completed)

  return (
    <div className="todos-list-container-v8">
      <form className="add-todo-form-v8" onSubmit={addTodo}>
        <input type="text" className="todo-input-v8" placeholder="添加新任务..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button type="submit" className="add-btn-v8"><PlusIcon size={18} /></button>
      </form>

      <div className="todos-list-v8">
        {filteredTodos.length === 0 ? (
          <div className="empty-state-v8">暂无待办</div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item-v8" draggable onDragStart={(e) => handleDragStart(e, todo)}>
              <div className="todo-content-v8">
                <span className={`priority-dot-v8 priority-${todo.priority}`}></span>
                <span className="todo-text-v8">{todo.text}</span>
                {todo.repeat && todo.repeat !== 'none' && (
                  <span className="repeat-icon-v8">{getRepeatIcon(todo.repeat)}</span>
                )}
              </div>
              <div className="todo-actions-v8">
                <button className="config-btn-v8" onClick={() => openConfig(todo)}>⚙</button>
                <button className="delete-btn-v8" onClick={() => setShowDeleteConfirm(todo.id)}>
                  <TrashIcon size={14} />
                </button>
              </div>

              {showConfig === todo.id && (
                <div className="config-modal-v8" onClick={(e) => e.stopPropagation()}>
                  <div className="config-content-v8">
                    <h4>配置待办</h4>
                    <div className="config-field-v8">
                      <label>优先级</label>
                      <div className="priority-selector-v8">
                        {['low', 'medium', 'high'].map(p => (
                          <button 
                            key={p}
                            className={`priority-dot-selector-v8 priority-${p} ${config.priority === p ? 'selected' : ''}`}
                            onClick={() => setConfig({ ...config, priority: p })}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="config-field-v8">
                      <label>截止日期</label>
                      <input type="date" value={config.dueDate} onChange={(e) => setConfig({ ...config, dueDate: e.target.value })} className="config-input-v8" />
                    </div>
                    <div className="config-field-v8">
                      <label>持续时间：{config.duration} 分钟</label>
                      <input type="range" min="5" max="180" step="5" value={config.duration} onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })} className="config-slider-v8" />
                    </div>
                    <div className="config-field-v8">
                      <label>重复类型</label>
                      <div className="repeat-selector-v8">
                        <button className={`repeat-option-v8 ${config.repeat === 'none' ? 'selected' : ''}`} onClick={() => setConfig({ ...config, repeat: 'none' })}>无</button>
                        <button className={`repeat-option-v8 ${config.repeat === 'daily' ? 'selected' : ''}`} onClick={() => setConfig({ ...config, repeat: 'daily' })}><RepeatDailyIcon size={16} /></button>
                        <button className={`repeat-option-v8 ${config.repeat === 'weekly' ? 'selected' : ''}`} onClick={() => setConfig({ ...config, repeat: 'weekly' })}><RepeatWeeklyIcon size={16} /></button>
                        <button className={`repeat-option-v8 ${config.repeat === 'monthly' ? 'selected' : ''}`} onClick={() => setConfig({ ...config, repeat: 'monthly' })}><RepeatMonthlyIcon size={16} /></button>
                      </div>
                    </div>
                    {config.repeat !== 'none' && (
                      <>
                        <div className="config-field-v8">
                          <label>单位/量词（可选）</label>
                          <input type="text" placeholder="如：个、次、页、小时" value={config.unit} onChange={(e) => setConfig({ ...config, unit: e.target.value })} className="config-input-v8" />
                        </div>
                        <div className="config-field-v8 checkbox-field-v8">
                          <input type="checkbox" id="isHabit-v8" checked={config.isHabit} onChange={(e) => setConfig({ ...config, isHabit: e.target.checked })} />
                          <label htmlFor="isHabit-v8">这是习惯打卡任务</label>
                        </div>
                      </>
                    )}
                    <div className="config-actions-v8">
                      <button className="cancel-btn-v8" onClick={() => setShowConfig(null)}>取消</button>
                      <button className="save-btn-v8" onClick={saveConfig}>保存</button>
                    </div>
                  </div>
                </div>
              )}

              {showDeleteConfirm === todo.id && (
                <div className="delete-confirm-v8" onClick={(e) => e.stopPropagation()}>
                  <p>确定删除此待办？</p>
                  <div className="delete-confirm-actions-v8">
                    <button className="cancel-btn-v8" onClick={() => setShowDeleteConfirm(null)}>取消</button>
                    <button className="delete-confirm-btn-v8" onClick={() => deleteTodo(todo.id)}>删除</button>
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

function ActiveTodoCardV8({ todo, onMoveBack, onComplete, onUpdateTime }) {
  const [timeLeft, setTimeLeft] = useState((todo.remainingTime || 25) * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [timerStyle, setTimerStyle] = useState('digital')
  const [showConfig, setShowConfig] = useState(false)

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
    <div className="active-todo-card-v8">
      <div className="active-todo-header-v8">
        <div className="active-todo-title-v8">
          <span className={`priority-dot-v8 priority-${todo.priority}`}></span>
          <span>{todo.text}</span>
        </div>
        <button className="config-toggle-btn-v8" onClick={() => setShowConfig(!showConfig)}>⚙</button>
      </div>

      {showConfig && (
        <div className="active-todo-config-v8">
          <button className="move-back-btn-v8" onClick={onMoveBack}>返回待办</button>
        </div>
      )}

      <div className="active-todo-timer-v8">
        {timerStyle === 'digital' ? (
          <div className="digital-timer-compact-v8">
            <div className="time-display-v8">{formatTime(timeLeft)}</div>
            <div className="time-slider-wrapper-v8">
              <input type="range" className="time-slider-v8" min="1" max="120" value={Math.ceil(timeLeft / 60)}
                onChange={(e) => { const mins = parseInt(e.target.value); setTimeLeft(mins * 60); onUpdateTime(mins) }}
                disabled={isRunning} />
              <span className="slider-value-v8">{Math.ceil(timeLeft / 60)}分钟</span>
            </div>
          </div>
        ) : (
          <div className="circular-timer-compact-v8">
            <svg viewBox="0 0 100 100" className="circular-svg-v8">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,149,0,0.2)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ff9500" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)" />
            </svg>
            <div className="circular-time-display-v8">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      <div className="active-todo-controls-v8">
        <button className="control-btn-v8 primary" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <><PauseIcon size={16} /><span>暂停</span></> : <><PlayIcon size={16} /><span>开始</span></>}
        </button>
        <button className="control-btn-v8" onClick={resetTimer}><ResetIcon size={16} /></button>
        <button className="style-btn-v8" onClick={() => setTimerStyle(timerStyle === 'digital' ? 'circular' : 'digital')}>
          {timerStyle === 'digital' ? '数字' : '圆形'}
        </button>
        <button className="complete-btn-v8" onClick={onComplete}>完成</button>
      </div>
    </div>
  )
}

// 时间轴视图 v8.0
function TimelineView() {
  const safeParse = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error(`解析 ${key} 失败:`, e)
      return defaultValue
    }
  }

  const [todos] = useState(() => safeParse('pomodoro_todos', []))
  const [tracks, setTracks] = useState(() => safeParse('pomodoro_timeline_tracks', [
    {id:1,name:""}, {id:2,name:""}, {id:3,name:""}
  ]))
  const [timelineItems, setTimelineItems] = useState(() => safeParse('pomodoro_timeline_items', []))
  const [presets, setPresets] = useState(() => safeParse('pomodoro_timeline_presets', []))
  const [showPresets, setShowPresets] = useState(false)
  const [draggedTodo, setDraggedTodo] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    try { localStorage.setItem('pomodoro_timeline_tracks', JSON.stringify(tracks)) } catch {}
  }, [tracks])

  useEffect(() => {
    try { localStorage.setItem('pomodoro_timeline_items', JSON.stringify(timelineItems)) } catch {}
  }, [timelineItems])

  const handleDragStart = (e, todo) => {
    setDraggedTodo(todo)
    e.dataTransfer.setData('todo', JSON.stringify(todo))
  }

  const handleDropOnTrack = (e, trackId, hour) => {
    e.preventDefault()
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
        color: todo.priority === 'high' ? '#ff453a' : todo.priority === 'medium' ? '#ff9500' : '#06b6d4'
      }
      const updated = [...timelineItems, newItem]
      setTimelineItems(updated)
      try { localStorage.setItem('pomodoro_timeline_items', JSON.stringify(updated)) } catch {}
    }
    setDraggedTodo(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
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

  const deleteItem = (itemId) => {
    setShowDeleteConfirm(itemId)
  }

  const confirmDeleteItem = () => {
    const updated = timelineItems.filter(item => item.id !== showDeleteConfirm)
    setTimelineItems(updated)
    setShowDeleteConfirm(null)
  }

  const moveItemBack = (item) => {
    const updated = timelineItems.filter(i => i.id !== item.id)
    setTimelineItems(updated)
  }

  const executeItem = (item) => {
    try {
      const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
      const todo = todos.find(t => t.id === item.todoId)
      if (todo) {
        const activeTodos = JSON.parse(localStorage.getItem('pomodoro_active_todos') || '[]')
        const activeTodo = { ...todo, startedAt: new Date().toISOString(), remainingTime: item.duration * 60 }
        localStorage.setItem('pomodoro_active_todos', JSON.stringify([...activeTodos, activeTodo]))
        window.location.hash = '#/special/pomodoro'
      }
    } catch {}
  }

  const savePreset = () => {
    const presetName = prompt('请输入预设名称：')
    if (presetName) {
      const newPreset = {
        id: Date.now(),
        name: presetName,
        tracks: tracks.filter(t => t.id > 3),
        items: timelineItems
      }
      const updated = [...presets, newPreset]
      setPresets(updated)
      try { localStorage.setItem('pomodoro_timeline_presets', JSON.stringify(updated)) } catch {}
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
      try { localStorage.setItem('pomodoro_timeline_presets', JSON.stringify(updated)) } catch {}
    }
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="timeline-view-v8">
      <div className="timeline-toolbar-v8">
        <div className="timeline-title-group-v8">
          <h3>时间轴规划</h3>
        </div>
        <div className="timeline-toolbar-actions-v8">
          <button className="toolbar-btn-v8" onClick={() => setTracks([...tracks, {id:Date.now(),name:""}])}>
            <AddIcon size={16} />
          </button>
          <button className="toolbar-btn-v8" onClick={() => setShowPresets(!showPresets)}>
            <LoadIcon size={16} />
          </button>
          <button className="toolbar-btn-v8 primary" onClick={savePreset}>
            <SaveIcon size={16} />
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="presets-panel-v8">
          <div className="presets-header-v8">
            <h4>保存的预设</h4>
            <button className="close-btn-v8" onClick={() => setShowPresets(false)}>×</button>
          </div>
          {presets.length === 0 ? (
            <div className="empty-presets-v8">暂无保存的预设</div>
          ) : (
            <div className="presets-list-v8">
              {presets.map(preset => (
                <div key={preset.id} className="preset-item-v8">
                  <span className="preset-name-v8">{preset.name}</span>
                  <div className="preset-actions-v8">
                    <button className="load-preset-btn-v8" onClick={() => loadPreset(preset)}>加载</button>
                    <button className="delete-preset-btn-v8" onClick={() => deletePreset(preset.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="timeline-content-v8">
        <div className="todo-sidebar-v8">
          <h4>待办事项</h4>
          <div className="todo-drag-list-v8">
            {todos.filter(t => !t.completed).map(todo => (
              <div 
                key={todo.id} 
                className="todo-drag-item-v8"
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
              >
                <DragIcon size={14} />
                <span className="todo-drag-text-v8">{todo.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-tracks-container-v8">
          <div className="timeline-header-row-v8">
            <div className="track-label-column-v8"></div>
            <div className="hours-header-v8">
              {hours.map(hour => (
                <div key={hour} className="hour-label-v8">{hour.toString().padStart(2, '0')}</div>
              ))}
            </div>
          </div>

          {tracks.map(track => (
            <div key={track.id} className="timeline-track-v8">
              <div className="track-label-v8">
                <span className="track-indicator-v8"></span>
              </div>
              <div className="track-content-v8" onDragOver={handleDragOver}>
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    className="hour-cell-v8"
                    onDrop={(e) => handleDropOnTrack(e, track.id, hour)}
                  />
                ))}
                {timelineItems.filter(item => item.trackId === track.id).map(item => (
                  <div 
                    key={item.id}
                    className="timeline-block-v8"
                    style={{ 
                      backgroundColor: item.color + '20',
                      borderLeft: `3px solid ${item.color}`,
                      left: `${(item.startHour / 24) * 100}%`,
                      width: `${(item.duration / 24) * 100}%`
                    }}
                  >
                    <div className="timeline-block-content-v8">
                      <span className="timeline-block-text-v8">{item.todoText}</span>
                    </div>
                    <div className="timeline-block-resize-v8 timeline-block-resize-left-v8"
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
                    <div className="timeline-block-resize-v8 timeline-block-resize-right-v8"
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
                    <div className="timeline-block-actions-v8">
                      <button className="execute-block-btn-v8" onClick={() => executeItem(item)}>执行</button>
                      <button className="move-back-block-btn-v8" onClick={() => moveItemBack(item)}>放回</button>
                      <button className="delete-block-btn-v8" onClick={() => deleteItem(item.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay-v8" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-modal-v8" onClick={(e) => e.stopPropagation()}>
            <p>确定删除此时间块？</p>
            <div className="delete-confirm-actions-v8">
              <button className="cancel-btn-v8" onClick={() => setShowDeleteConfirm(null)}>取消</button>
              <button className="delete-confirm-btn-v8" onClick={confirmDeleteItem}>删除</button>
            </div>
          </div>
        </div>
      )}

      <div className="timeline-help-v8">
        <p>提示：将左侧待办拖到轨道上 · 拖动两端调整时间 · 拖动块切换时间 · 点击执行开始专注</p>
      </div>
    </div>
  )
}

// 打卡视图 v8.0
function CheckinView() {
  const safeParse = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error(`解析 ${key} 失败:`, e)
      return defaultValue
    }
  }

  const [habits, setHabits] = useState(() => safeParse('pomodoro_habits', []))
  const [checkins, setCheckins] = useState(() => safeParse('pomodoro_checkins', []))
  const [newHabit, setNewHabit] = useState('')
  const [habitConfig, setHabitConfig] = useState({ repeat: 'daily', unit: '', needFocus: true })

  useEffect(() => {
    const handleCheckinsUpdate = () => setCheckins(safeParse('pomodoro_checkins', []))
    const handleHabitsUpdate = () => setHabits(safeParse('pomodoro_habits', []))
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
      try {
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
      } catch {}
    }
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id))
    try {
      const todos = JSON.parse(localStorage.getItem('pomodoro_todos') || '[]')
      localStorage.setItem('pomodoro_todos', JSON.stringify(todos.filter(t => t.id !== id)))
      window.dispatchEvent(new CustomEvent('todos-updated'))
    } catch {}
  }

  const manualCheckin = (habit) => {
    try {
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
    } catch {}
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

  const getRepeatIcon = (repeat) => {
    if (repeat === 'daily') return <RepeatDailyIcon size={14} />
    if (repeat === 'weekly') return <RepeatWeeklyIcon size={14} />
    if (repeat === 'monthly') return <RepeatMonthlyIcon size={14} />
    return null
  }

  return (
    <div className="checkin-view-v8">
      <div className="checkin-header-v8">
        <h3>习惯打卡</h3>
        <p className="checkin-subtitle-v8">记录每日坚持，培养长期习惯</p>
      </div>

      <form className="add-habit-form-v8" onSubmit={addHabit}>
        <input 
          type="text" 
          className="habit-input-v8" 
          placeholder="添加新习惯（如：背单词、阅读、运动）..." 
          value={newHabit} 
          onChange={(e) => setNewHabit(e.target.value)} 
        />
        <div className="repeat-selector-v8 compact">
          <button className={`repeat-option-v8 ${habitConfig.repeat === 'daily' ? 'selected' : ''}`} onClick={() => setHabitConfig({ ...habitConfig, repeat: 'daily' })}><RepeatDailyIcon size={14} /></button>
          <button className={`repeat-option-v8 ${habitConfig.repeat === 'weekly' ? 'selected' : ''}`} onClick={() => setHabitConfig({ ...habitConfig, repeat: 'weekly' })}><RepeatWeeklyIcon size={14} /></button>
          <button className={`repeat-option-v8 ${habitConfig.repeat === 'monthly' ? 'selected' : ''}`} onClick={() => setHabitConfig({ ...habitConfig, repeat: 'monthly' })}><RepeatMonthlyIcon size={14} /></button>
        </div>
        <input 
          type="text" 
          className="habit-unit-input-v8" 
          placeholder="单位" 
          value={habitConfig.unit}
          onChange={(e) => setHabitConfig({ ...habitConfig, unit: e.target.value })}
        />
        <label className="habit-checkbox-v8">
          <input 
            type="checkbox"
            checked={habitConfig.needFocus}
            onChange={(e) => setHabitConfig({ ...habitConfig, needFocus: e.target.checked })}
          />
          <span>需专注</span>
        </label>
        <button type="submit" className="add-habit-btn-v8"><PlusIcon size={18} /></button>
      </form>

      <div className="today-summary-v8">
        <h4>今日打卡</h4>
        <p>{todayCheckins.length} 项已完成</p>
      </div>

      <div className="habits-list-v8">
        {habits.length === 0 ? (
          <div className="empty-habits-v8">
            <p>暂无习惯</p>
            <p className="empty-habits-hint-v8">添加一个习惯开始打卡</p>
          </div>
        ) : (
          habits.map(habit => {
            const completedToday = getCompletedToday(habit.id)
            const streak = getStreak(habit.id)
            return (
              <div key={habit.id} className={`habit-card-v8 ${completedToday ? 'completed' : ''}`}>
                <div className="habit-info-v8">
                  <div className="habit-text-v8">{habit.text}</div>
                  <div className="habit-meta-v8">
                    <span className="repeat-icon-v8">{getRepeatIcon(habit.repeat)}</span>
                    {habit.unit && <span className="habit-unit-v8">{habit.unit}</span>}
                    <span className="habit-type-v8">{habit.needFocus ? '需专注' : '手动'}</span>
                  </div>
                </div>
                <div className="habit-stats-v8">
                  <div className="streak-badge-v8">
                    <FireIcon size={14} /> {streak} 天
                  </div>
                  <div className="total-badge-v8">
                    <CheckIcon size={14} /> {habit.totalCompletions || 0} 次
                  </div>
                </div>
                <div className="habit-actions-v8">
                  {!completedToday && !habit.needFocus && (
                    <button className="manual-checkin-btn-v8" onClick={() => manualCheckin(habit)}>打卡</button>
                  )}
                  {completedToday ? (
                    <span className="completed-tag-v8">已完成</span>
                  ) : (
                    <span className="pending-tag-v8">未完成</span>
                  )}
                  <button className="delete-habit-btn-v8" onClick={() => deleteHabit(habit.id)}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {checkins.length > 0 && (
        <div className="recent-checkins-v8">
          <h4>最近打卡记录</h4>
          <div className="checkins-list-v8">
            {checkins.slice(-10).reverse().map(checkin => (
              <div key={checkin.id} className="checkin-item-v8">
                <span className="checkin-text-v8">{checkin.habitText}</span>
                <span className="checkin-date-v8">{new Date(checkin.date).toLocaleDateString('zh-CN')}</span>
                {checkin.duration && <span className="checkin-duration-v8">{checkin.duration} 分钟</span>}
                <span className="checkin-type-v8">{checkin.type === 'manual' ? '手动' : '自动'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 统计视图 v8.0
function StatsView() {
  const [viewType, setViewType] = useState('daily')
  const [chartType, setChartType] = useState('bar')
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]') } catch { return [] }
  })
  const [hoveredHour, setHoveredHour] = useState(null)

  useEffect(() => {
    const handleUpdate = () => {
      try { setSessions(JSON.parse(localStorage.getItem('pomodoro_sessions') || '[]')) } catch {}
    }
    window.addEventListener('sessions-updated', handleUpdate)
    return () => window.removeEventListener('sessions-updated', handleUpdate)
  }, [])

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
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      for (let i = 0; i < 7; i++) byDay[dayNames[i]] = 0
      weekSessions.forEach(s => {
        const day = dayNames[new Date(s.completedAt).getDay()]
        byDay[day] = (byDay[day] || 0) + (s.duration || 0)
      })
      return { 
        data: Object.values(byDay), 
        labels: Object.keys(byDay),
        details: {},
        total: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        count: weekSessions.length
      }
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthSessions = sessions.filter(s => new Date(s.completedAt) >= monthStart && s.mode === 'work')
      const byDay = {}
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      for (let d = 1; d <= daysInMonth; d++) byDay[d] = 0
      monthSessions.forEach(s => {
        const day = new Date(s.completedAt).getDate()
        byDay[day] = (byDay[day] || 0) + (s.duration || 0)
      })
      return { 
        data: Object.values(byDay), 
        labels: Object.keys(byDay).map(k => `${k}日`),
        details: {},
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
    <div className="stats-view-v8">
      <div className="stats-header-v8">
        <h3>数据统计</h3>
        <div className="stats-controls-v8">
          <div className="custom-select-v8">
            <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
              <option value="daily">今日</option>
              <option value="weekly">本周</option>
              <option value="monthly">本月</option>
            </select>
          </div>
          <div className="custom-select-v8">
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">柱状图</option>
              <option value="line">折线图</option>
            </select>
          </div>
        </div>
      </div>

      <div className="stats-summary-v8">
        <div className="summary-card-v8">
          <div className="summary-value-v8">{Math.floor(totalDuration / 60)}</div>
          <div className="summary-label-v8">总专注时长（分钟）</div>
        </div>
        <div className="summary-card-v8">
          <div className="summary-value-v8">{totalCount}</div>
          <div className="summary-label-v8">专注次数</div>
        </div>
      </div>

      <div className="stats-chart-container-v8">
        {filtered.data.length === 0 || totalDuration === 0 ? (
          <div className="empty-chart-v8">
            <p>暂无数据</p>
            <p className="empty-chart-hint-v8">开始专注后这里会显示统计图表</p>
          </div>
        ) : (
          <>
            {chartType === 'bar' && (
              <div className="bar-chart-v8">
                {filtered.data.map((value, i) => (
                  <div 
                    key={i} 
                    className="bar-item-v8"
                    onMouseEnter={() => viewType === 'daily' && filtered.details[i]?.length > 0 && setHoveredHour(i)}
                    onMouseLeave={() => setHoveredHour(null)}
                  >
                    <div 
                      className="bar-fill-v8" 
                      style={{ height: `${(value / maxValue) * 100}%` }}
                    ></div>
                    <div className="bar-label-v8">{filtered.labels[i]}</div>
                    <div className="bar-value-v8">{Math.floor(value / 60)}m</div>
                    
                    {hoveredHour === i && filtered.details[i]?.length > 0 && (
                      <div className="bar-tooltip-v8">
                        {filtered.details[i].map(s => (
                          <div key={s.id} className="tooltip-item-v8">
                            <span className="tooltip-text-v8">{s.todoText}</span>
                            <span className="tooltip-duration-v8">{Math.floor(s.duration / 60)}分钟</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {chartType === 'line' && (
              <div className="line-chart-v8">
                <svg viewBox="0 0 400 200" className="line-svg-v8">
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
                <div className="line-labels-v8">
                  {filtered.labels.map((label, i) => (
                    <div key={i} className="line-label-v8">{label}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
