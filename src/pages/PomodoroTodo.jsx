import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, PinIcon, CalendarIcon, RepeatIcon } from '../components/icons/SiteIcons'

/**
 * 番茄钟待办 - 重构版
 * 分页面设计：计时器 | 待办清单 | 统计数据
 */
export default function PomodoroTodo() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('timer') // 'timer' | 'todos' | 'stats'

  return (
    <div className="pomodoro-page">
      <Header />
      
      <main className="pomodoro-main">
        {/* 页面标题 */}
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
            <span>计时器</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            <CheckIcon size={18} />
            <span>待办清单</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <ChartIcon size={18} />
            <span>统计数据</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="pomodoro-content">
          {activeTab === 'timer' && <TimerTab />}
          {activeTab === 'todos' && <TodosTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </main>
    </div>
  )
}

// 计时器标签页
function TimerTab() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [timerStyle, setTimerStyle] = useState('digital')
  const [timerMode, setTimerMode] = useState('countdown')
  const [targetCount, setTargetCount] = useState(25)
  const [currentCount, setCurrentCount] = useState(0)

  const modes = {
    work: { time: 25 * 60, label: '专注', color: '#ff9500' },
    shortBreak: { time: 5 * 60, label: '短休息', color: '#06b6d4' },
    longBreak: { time: 15 * 60, label: '长休息', color: '#39ff14' }
  }

  useEffect(() => {
    let timer
    if (isRunning && timerMode !== 'count' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = timerMode === 'countdown' ? prev - 1 : prev + 1
          if (timerMode === 'countdown' && newTime === 0) {
            setIsRunning(false)
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timerMode, timeLeft])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimeLeft(modes[mode].time)
    setIsRunning(false)
    setCurrentCount(0)
  }

  const progress = timerMode === 'countdown' 
    ? ((modes[mode].time - timeLeft) / modes[mode].time) * 100
    : ((timeLeft % 3600) / 3600) * 100

  return (
    <div className="timer-section">
      {/* 模式选择 */}
      <div className="mode-selector">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            className={`mode-btn ${mode === key ? 'active' : ''}`}
            onClick={() => {
              setMode(key)
              setTimeLeft(value.time)
              setIsRunning(false)
            }}
            style={{ '--theme-color': value.color }}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* 计时器显示 */}
      <div className="timer-display">
        {timerStyle === 'digital' ? (
          <div className="digital-timer">
            <div className="time-text">{formatTime(timeLeft)}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <div className="circular-timer">
            <svg viewBox="0 0 100 100" className="circular-svg">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={modes[mode].color}
                strokeWidth="4"
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

      {/* 计时器控制 */}
      <div className="timer-controls">
        {timerMode === 'count' ? (
          <button
            className="control-btn count-btn"
            onClick={() => {
              setCurrentCount(prev => prev + 1)
              if (currentCount + 1 >= targetCount) {
                setIsRunning(false)
              }
            }}
          >
            <PlusIcon size={24} color="#ff9500" />
            <span>计数 +1</span>
          </button>
        ) : (
          <button
            className="control-btn primary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <><PauseIcon size={20} /><span>暂停</span></>
            ) : (
              <><PlayIcon size={20} /><span>开始</span></>
            )}
          </button>
        )}
        
        <button className="control-btn" onClick={resetTimer}>
          <ResetIcon size={20} />
          <span>重置</span>
        </button>
      </div>

      {/* 设置选项 */}
      <div className="timer-settings">
        <div className="setting-group">
          <span className="setting-label">样式</span>
          <div className="setting-btns">
            <button 
              className={timerStyle === 'digital' ? 'active' : ''}
              onClick={() => setTimerStyle('digital')}
            >
              数字
            </button>
            <button 
              className={timerStyle === 'circular' ? 'active' : ''}
              onClick={() => setTimerStyle('circular')}
            >
              圆形
            </button>
          </div>
        </div>

        <div className="setting-group">
          <span className="setting-label">模式</span>
          <div className="setting-btns">
            <button 
              className={timerMode === 'countdown' ? 'active' : ''}
              onClick={() => {
                setTimerMode('countdown')
                setTimeLeft(modes[mode].time)
              }}
            >
              倒计时
            </button>
            <button 
              className={timerMode === 'countup' ? 'active' : ''}
              onClick={() => {
                setTimerMode('countup')
                setTimeLeft(0)
              }}
            >
              正计时
            </button>
            <button 
              className={timerMode === 'count' ? 'active' : ''}
              onClick={() => setTimerMode('count')}
            >
              计数
            </button>
          </div>
        </div>

        {timerMode === 'count' && (
          <div className="setting-group">
            <span className="setting-label">目标次数</span>
            <input
              type="number"
              className="setting-input"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
              min="1"
              max="100"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// 待办清单标签页
function TodosTab() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('medium')
  const [todoFilter, setTodoFilter] = useState('all')

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority,
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

  const filteredTodos = todoFilter === 'all' 
    ? todos 
    : todos.filter(todo => {
        if (todoFilter === 'active') return !todo.completed
        if (todoFilter === 'completed') return todo.completed
        return true
      })

  return (
    <div className="todos-section">
      {/* 添加待办 */}
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
          <PlusIcon size={20} />
        </button>
      </form>

      {/* 筛选按钮 */}
      <div className="todo-filters">
        <button
          className={`filter-btn ${todoFilter === 'all' ? 'active' : ''}`}
          onClick={() => setTodoFilter('all')}
        >
          全部
        </button>
        <button
          className={`filter-btn ${todoFilter === 'active' ? 'active' : ''}`}
          onClick={() => setTodoFilter('active')}
        >
          进行中
        </button>
        <button
          className={`filter-btn ${todoFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setTodoFilter('completed')}
        >
          已完成
        </button>
      </div>

      {/* 待办列表 */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>暂无待办事项</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <button className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                {todo.completed && <CheckIcon size={16} />}
              </button>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span className={`priority-badge priority-${todo.priority}`}>
                  {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                <TrashIcon size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// 统计数据标签页
function StatsTab() {
  const [stats] = useState({
    today: 8,
    week: 42,
    total: 156,
    bestDay: { date: '2026-03-05', count: 12 }
  })

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.today}</div>
          <div className="stat-label">今日专注</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.week}</div>
          <div className="stat-label">本周专注</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总计专注</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bestDay.count}</div>
          <div className="stat-label">最佳记录</div>
          <div className="stat-sub">{stats.bestDay.date}</div>
        </div>
      </div>
    </div>
  )
}
