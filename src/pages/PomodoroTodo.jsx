import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon } from '../components/icons/SiteIcons'

/**
 * 番茄钟待办 - Pomodoro Todo
 * 复古赛博朋克风格的番茄工作法 + 待办清单
 */
export default function PomodoroTodo() {
  // 番茄钟状态
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 分钟
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // 'work' | 'shortBreak' | 'longBreak'
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0) // 总专注时间（秒）

  // 待办事项
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [activeTodoId, setActiveTodoId] = useState(null)
  const [priority, setPriority] = useState('medium') // 'low' | 'medium' | 'high'

  // 统计数据
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    total: 0,
    bestDay: { date: '', count: 0 }
  })

  const timerRef = useRef(null)
  const audioRef = useRef(null)

  // 模式配置
  const modes = {
    work: { time: 25 * 60, label: '专注时间', color: '#ff9500' },
    shortBreak: { time: 5 * 60, label: '短休息', color: '#06b6d4' },
    longBreak: { time: 15 * 60, label: '长休息', color: '#39ff14' }
  }

  // 加载本地存储
  useEffect(() => {
    const savedTodos = localStorage.getItem('pomodoro_todos')
    const savedStats = localStorage.getItem('pomodoro_stats')
    const savedTime = localStorage.getItem('pomodoro_timeLeft')
    const savedMode = localStorage.getItem('pomodoro_mode')
    const savedPomodoros = localStorage.getItem('pomodoro_completed')

    if (savedTodos) setTodos(JSON.parse(savedTodos))
    if (savedStats) setStats(JSON.parse(savedStats))
    if (savedTime) setTimeLeft(parseInt(savedTime))
    if (savedMode) setMode(savedMode)
    if (savedPomodoros) setCompletedPomodoros(parseInt(savedPomodoros))
  }, [])

  // 保存本地存储
  useEffect(() => {
    localStorage.setItem('pomodoro_todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats))
  }, [stats])

  useEffect(() => {
    localStorage.setItem('pomodoro_timeLeft', timeLeft.toString())
  }, [timeLeft])

  useEffect(() => {
    localStorage.setItem('pomodoro_mode', mode)
  }, [mode])

  useEffect(() => {
    localStorage.setItem('pomodoro_completed', completedPomodoros.toString())
  }, [completedPomodoros])

  // 计时器
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    // 播放提示音（可选）
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1
      setCompletedPomodoros(newCompleted)
      
      // 更新专注时间
      setTotalFocusTime(prev => prev + 25 * 60)
      
      // 更新统计数据
      const today = new Date().toISOString().split('T')[0]
      setStats(prev => {
        const updated = {
          ...prev,
          today: prev.today + 1,
          week: prev.week + 1,
          total: prev.total + 1
        }
        
        // 检查是否是最好的一天
        if (updated.today > updated.bestDay.count) {
          updated.bestDay = { date: today, count: updated.today }
        }
        
        return updated
      })
      
      // 每 4 个番茄钟后长休息
      if (newCompleted % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(modes.longBreak.time)
      } else {
        setMode('shortBreak')
        setTimeLeft(modes.shortBreak.time)
      }
    } else {
      setMode('work')
      setTimeLeft(modes.work.time)
    }
  }

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 进度百分比
  const getProgress = () => {
    const totalTime = modes[mode].time
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  // 切换模式
  const switchMode = (newMode) => {
    setMode(newMode)
    setTimeLeft(modes[newMode].time)
    setIsRunning(false)
  }

  // 待办事项操作
  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString()
    }

    setTodos([...todos, todo])
    setNewTodo('')
    setPriority('medium')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    if (activeTodoId === id) setActiveTodoId(null)
  }

  const setActiveTodo = (id) => {
    setActiveTodoId(activeTodoId === id ? null : id)
  }

  // 当前激活的待办
  const activeTodo = todos.find(t => t.id === activeTodoId)

  return (
    <>
      <Header />
      <main className="pomodoro-todo-page">
        {/* 隐藏音频元素 */}
        <audio ref={audioRef} src="/sounds/timer-complete.mp3" preload="auto" />

        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <ClockIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">番茄钟待办</span>
          </h1>
          <p className="page-subtitle">POMODORO TODO - 专注 · 效率 · 成就</p>
        </div>

        <div className="pomodoro-container">
          {/* 左侧：番茄钟 */}
          <div className="pomodoro-section">
            <div className="timer-display">
              {/* 模式选择 */}
              <div className="mode-selector">
                <button
                  className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
                  onClick={() => switchMode('work')}
                >
                  专注
                </button>
                <button
                  className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
                  onClick={() => switchMode('shortBreak')}
                >
                  短休息
                </button>
                <button
                  className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
                  onClick={() => switchMode('longBreak')}
                >
                  长休息
                </button>
              </div>

              {/* 时间显示 */}
              <div className="time-display" style={{ color: modes[mode].color }}>
                <span className="time-value">{formatTime(timeLeft)}</span>
              </div>

              {/* 进度条 */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${getProgress()}%`,
                    backgroundColor: modes[mode].color,
                    boxShadow: `0 0 20px ${modes[mode].color}`
                  }}
                ></div>
              </div>

              {/* 控制按钮 */}
              <div className="timer-controls">
                <button
                  className="control-btn primary"
                  onClick={() => setIsRunning(!isRunning)}
                  style={{ borderColor: modes[mode].color }}
                >
                  {isRunning ? (
                    <>
                      <PauseIcon size={20} color={modes[mode].color} />
                      <span>暂停</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon size={20} color={modes[mode].color} />
                      <span>开始</span>
                    </>
                  )}
                </button>

                <button
                  className="control-btn"
                  onClick={() => {
                    setTimeLeft(modes[mode].time)
                    setIsRunning(false)
                  }}
                >
                  <ResetIcon size={20} />
                  <span>重置</span>
                </button>

                <button
                  className="control-btn"
                  onClick={() => {
                    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
                      setTodos([])
                      setStats({ today: 0, week: 0, total: 0, bestDay: { date: '', count: 0 } })
                      setCompletedPomodoros(0)
                      setTotalFocusTime(0)
                      setTimeLeft(modes.work.time)
                      setMode('work')
                      setIsRunning(false)
                      localStorage.clear()
                    }
                  }}
                  title="清空所有数据"
                >
                  <TrashIcon size={20} />
                  <span>清空</span>
                </button>
              </div>

              {/* 完成统计 */}
              <div className="pomodoro-stats">
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">今日</span>
                    <span className="stat-value">{stats.today}</span>
                    <span className="stat-unit">个番茄钟</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">本周</span>
                    <span className="stat-value">{stats.week}</span>
                    <span className="stat-unit">个番茄钟</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">总计</span>
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-unit">个番茄钟</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">最佳记录</span>
                    <span className="stat-value">{stats.bestDay.count}</span>
                    <span className="stat-unit">{stats.bestDay.date || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：待办清单 */}
          <div className="todo-section">
            <div className="todo-container">
              <div className="todo-header">
                <h2 className="todo-title">待办事项</h2>
                <span className="todo-count">
                  {todos.filter(t => t.completed).length} / {todos.length}
                </span>
              </div>

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

              {/* 当前专注 */}
              {activeTodo && (
                <div className="active-todo-banner">
                  <span className="banner-label">当前专注</span>
                  <span className="banner-text">{activeTodo.text}</span>
                </div>
              )}

              {/* 待办列表标题栏 */}
              <div className="todo-list-header">
                <span className="list-title">待办清单</span>
                <button
                  className="export-btn"
                  onClick={() => {
                    const dataStr = JSON.stringify({ todos, stats, completedPomodoros }, null, 2)
                    const blob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  title="导出数据"
                >
                  <span>导出</span>
                </button>
              </div>

              {/* 待办列表 */}
              <div className="todo-list">
                {todos.length === 0 ? (
                  <div className="empty-state">
                    <p>暂无待办事项</p>
                    <p className="empty-hint">添加一个任务开始专注吧</p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`todo-item ${todo.completed ? 'completed' : ''} ${activeTodoId === todo.id ? 'active' : ''} priority-${todo.priority}`}
                    >
                      <div className="todo-content">
                        <button
                          className="todo-checkbox"
                          onClick={() => toggleTodo(todo.id)}
                        >
                          {todo.completed && <CheckIcon size={16} />}
                        </button>
                        <span className="todo-text">{todo.text}</span>
                        {todo.priority && (
                          <span className={`priority-badge priority-${todo.priority}`}>
                            {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                          </span>
                        )}
                      </div>
                      <div className="todo-actions">
                        <button
                          className="action-btn set-active"
                          onClick={() => setActiveTodo(todo.id)}
                          title="设为当前专注"
                        >
                          <PlayIcon size={14} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteTodo(todo.id)}
                          title="删除"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
