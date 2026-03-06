import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ClockIcon, CheckIcon, PlusIcon, TrashIcon, PlayIcon, PauseIcon, ResetIcon, ChartIcon, PinIcon, CalendarIcon, RepeatIcon } from '../components/icons/SiteIcons'

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
  const [timerStyle, setTimerStyle] = useState('digital') // 'digital' | 'circular'
  const [timerMode, setTimerMode] = useState('countdown') // 'countdown' | 'countup' | 'count'
  const [targetCount, setTargetCount] = useState(25) // 目标计数（分钟或次数）
  const [currentCount, setCurrentCount] = useState(0) // 当前计数

  // 待办事项
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [activeTodoId, setActiveTodoId] = useState(null)
  const [priority, setPriority] = useState('medium') // 'low' | 'medium' | 'high'
  const [todoFocusMode, setTodoFocusMode] = useState('time') // 'time' | 'count'
  const [todoTargetTime, setTodoTargetTime] = useState(25) // 待办目标时间
  const [todoTargetCount, setTodoTargetCount] = useState(1) // 待办目标次数
  const [todoType, setTodoType] = useState('once') // 'once' | 'daily' | 'long'
  const [todoTimerMode, setTodoTimerMode] = useState('countdown') // 'countdown' | 'countup'

  // 统计数据
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    total: 0,
    bestDay: { date: '', count: 0 },
    dailyHistory: {} // 每日记录 { '2026-03-06': 8 }
  })

  // 倒计时
  const [countdown, setCountdown] = useState({
    year: 0,
    month: 0,
    day: 0
  })

  // 实时时间
  const [currentTime, setCurrentTime] = useState(new Date())

  // 待办筛选
  const [todoFilter, setTodoFilter] = useState('all') // 'all' | 'daily' | 'long' | 'once'

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
    const savedTimerStyle = localStorage.getItem('pomodoro_timerStyle')
    const savedTimerMode = localStorage.getItem('pomodoro_timerMode')
    const savedTargetCount = localStorage.getItem('pomodoro_targetCount')

    if (savedTodos) setTodos(JSON.parse(savedTodos))
    if (savedStats) setStats(JSON.parse(savedStats))
    if (savedTime) setTimeLeft(parseInt(savedTime))
    if (savedMode) setMode(savedMode)
    if (savedPomodoros) setCompletedPomodoros(parseInt(savedPomodoros))
    if (savedTimerStyle) setTimerStyle(savedTimerStyle)
    if (savedTimerMode) setTimerMode(savedTimerMode)
    if (savedTargetCount) setTargetCount(parseInt(savedTargetCount))
  }, [])

  // 实时时间更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      
      // 计算倒计时
      const now = new Date()
      const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      
      setCountdown({
        year: Math.floor((yearEnd - now) / 1000),
        month: Math.floor((monthEnd - now) / 1000),
        day: Math.floor((dayEnd - now) / 1000)
      })
    }, 1000)
    
    return () => clearInterval(timer)
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

  useEffect(() => {
    localStorage.setItem('pomodoro_timerStyle', timerStyle)
  }, [timerStyle])

  useEffect(() => {
    localStorage.setItem('pomodoro_timerMode', timerMode)
  }, [timerMode])

  useEffect(() => {
    localStorage.setItem('pomodoro_targetCount', targetCount.toString())
  }, [targetCount])

  // 计时器
  useEffect(() => {
    if (!isRunning) return

    timerRef.current = setInterval(() => {
      if (timerMode === 'countdown') {
        // 倒计时模式
        if (timeLeft > 0) {
          setTimeLeft(prev => prev - 1)
        } else {
          handleTimerComplete()
        }
      } else if (timerMode === 'countup') {
        // 正计时模式
        setTimeLeft(prev => prev + 1)
      } else if (timerMode === 'count') {
        // 计数模式（次数）
        setCurrentCount(prev => {
          if (prev >= targetCount) {
            handleTimerComplete()
            return prev
          }
          return prev + 1
        })
      }
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [isRunning, timerMode, timeLeft, currentCount, targetCount])

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
      const focusTime = timerMode === 'countup' ? timeLeft : 25 * 60
      setTotalFocusTime(prev => prev + focusTime)
      
      // 更新统计数据
      const today = new Date().toISOString().split('T')[0]
      setStats(prev => {
        const updated = {
          ...prev,
          today: prev.today + 1,
          week: prev.week + 1,
          total: prev.total + 1,
          dailyHistory: {
            ...prev.dailyHistory,
            [today]: (prev.dailyHistory[today] || 0) + 1
          }
        }
        
        // 检查是否是最好的一天
        if (updated.today > updated.bestDay.count) {
          updated.bestDay = { date: today, count: updated.today }
        }
        
        return updated
      })
      
      // 更新待办专注进度
      if (activeTodoId) {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === activeTodoId) {
            const newCompletedCount = todo.completedCount + 1
            return {
              ...todo,
              completedCount: newCompletedCount,
              completed: todo.focusMode === 'count' 
                ? newCompletedCount >= todo.targetCount 
                : todo.completed
            }
          }
          return todo
        }))
      }
      
      // 重置计数模式
      if (timerMode === 'count') {
        setCurrentCount(0)
      }
      
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
      setCurrentCount(0)
    }
  }

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 切换计时模式
  const switchTimerMode = (newMode) => {
    setTimerMode(newMode)
    setIsRunning(false)
    setCurrentCount(0)
    if (newMode === 'countdown') {
      setTimeLeft(targetCount * 60)
    } else if (newMode === 'countup') {
      setTimeLeft(0)
    } else if (newMode === 'count') {
      setCurrentCount(0)
    }
  }

  // 重置计时器
  const resetTimer = () => {
    if (timerMode === 'countdown') {
      setTimeLeft(targetCount * 60)
    } else if (timerMode === 'countup') {
      setTimeLeft(0)
    } else if (timerMode === 'count') {
      setCurrentCount(0)
    }
    setIsRunning(false)
  }

  // 格式化倒计时
  const formatCountdown = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}天 ${hours.toString().padStart(2, '0')}时 ${mins.toString().padStart(2, '0')}分 ${secs.toString().padStart(2, '0')}秒`
  }

  // 获取热力图数据（最近 42 天，6 周）
  const getHeatmapData = () => {
    const today = new Date()
    const days = []
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        count: stats.dailyHistory[dateStr] || 0,
        day: date.getDate(),
        month: date.getMonth() + 1
      })
    }
    return days
  }

  // 获取颜色强度
  const getHeatmapColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.05)'
    if (count <= 2) return 'rgba(255,149,0,0.3)'
    if (count <= 4) return 'rgba(255,149,0,0.5)'
    if (count <= 6) return 'rgba(255,149,0,0.7)'
    return 'rgba(255,149,0,0.9)'
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
      focusMode: todoFocusMode,
      targetTime: todoTargetTime,
      targetCount: todoTargetCount,
      completedCount: 0,
      type: todoType, // 'once' | 'daily' | 'long'
      timerMode: todoTimerMode, // 'countdown' | 'countup'
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
              {/* 计时样式选择 */}
              <div className="mode-selector">
                <button
                  className={`mode-btn ${timerStyle === 'digital' ? 'active' : ''}`}
                  onClick={() => setTimerStyle('digital')}
                >
                  数字
                </button>
                <button
                  className={`mode-btn ${timerStyle === 'circular' ? 'active' : ''}`}
                  onClick={() => setTimerStyle('circular')}
                >
                  圆形
                </button>
              </div>

              {/* 计时模式选择 */}
              <div className="mode-selector">
                <button
                  className={`mode-btn ${timerMode === 'countdown' ? 'active' : ''}`}
                  onClick={() => switchTimerMode('countdown')}
                >
                  倒计时
                </button>
                <button
                  className={`mode-btn ${timerMode === 'countup' ? 'active' : ''}`}
                  onClick={() => switchTimerMode('countup')}
                >
                  正计时
                </button>
                <button
                  className={`mode-btn ${timerMode === 'count' ? 'active' : ''}`}
                  onClick={() => switchTimerMode('count')}
                >
                  计数
                </button>
              </div>

              {/* 目标设置 */}
              {(timerMode === 'countdown' || timerMode === 'count') && (
                <div className="target-setting">
                  <label className="target-label">
                    {timerMode === 'countdown' ? '目标分钟' : '目标次数'}
                  </label>
                  <input
                    type="number"
                    className="target-input"
                    value={targetCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setTargetCount(val)
                      if (timerMode === 'countdown' && !isRunning) {
                        setTimeLeft(val * 60)
                      }
                    }}
                    min="1"
                    max="180"
                  />
                </div>
              )}

              {/* 时间显示 */}
              {timerStyle === 'digital' ? (
                <>
                  <div className="time-display" style={{ color: modes[mode].color }}>
                    <span className="time-value">
                      {timerMode === 'count' ? currentCount : formatTime(timeLeft)}
                    </span>
                    {timerMode === 'count' && <span className="count-unit">/ {targetCount}</span>}
                  </div>

                  {timerMode !== 'count' && (
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
                  )}
                </>
              ) : (
                <div className="circular-timer">
                  <svg viewBox="0 0 100 100" className="circular-svg">
                    {/* 背景圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    {/* 进度圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={modes[mode].color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={283}
                      strokeDashoffset={283 * (1 - (timerMode === 'count' ? currentCount / targetCount : getProgress() / 100))}
                      transform="rotate(-90 50 50)"
                      style={{
                        transition: 'stroke-dashoffset 0.3s ease',
                        filter: `drop-shadow(0 0 8px ${modes[mode].color})`
                      }}
                    />
                  </svg>
                  <div className="circular-display">
                    <span className="circular-time" style={{ color: modes[mode].color }}>
                      {timerMode === 'count' ? currentCount : formatTime(timeLeft)}
                    </span>
                    {timerMode === 'count' && (
                      <span className="circular-count">/ {targetCount}</span>
                    )}
                  </div>
                </div>
              )}

              {/* 控制按钮 */}
              <div className="timer-controls">
                {timerMode === 'count' ? (
                  <>
                    <button
                      className="control-btn primary count-btn"
                      onClick={() => {
                        setCurrentCount(prev => prev + 1)
                        if (currentCount + 1 >= targetCount) {
                          handleTimerComplete()
                        }
                      }}
                      style={{ borderColor: modes[mode].color }}
                    >
                      <PlusIcon size={24} color={modes[mode].color} />
                      <span>计数 +1</span>
                    </button>

                    <button
                      className="control-btn"
                      onClick={resetTimer}
                    >
                      <ResetIcon size={20} />
                      <span>重置</span>
                    </button>
                  </>
                ) : (
                  <>
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
                      onClick={resetTimer}
                    >
                      <ResetIcon size={20} />
                      <span>重置</span>
                    </button>
                  </>
                )}

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

              {/* 实时统计 */}
              <div className="realtime-stats">
                <div className="stat-row">
                  <span className="stat-label">今日专注</span>
                  <span className="stat-value-sm">{stats.today}</span>
                  <span className="stat-unit-sm">个番茄钟</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">本周专注</span>
                  <span className="stat-value-sm">{stats.week}</span>
                  <span className="stat-unit-sm">个番茄钟</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">总计专注</span>
                  <span className="stat-value-sm">{stats.total}</span>
                  <span className="stat-unit-sm">个番茄钟</span>
                </div>
              </div>

              {/* 倒计时区域 */}
              <div className="countdown-section">
                <div className="countdown-item">
                  <span className="countdown-label">距离新年</span>
                  <span className="countdown-value">{formatCountdown(countdown.year)}</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-label">距离下月</span>
                  <span className="countdown-value">{formatCountdown(countdown.month)}</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-label">距离明天</span>
                  <span className="countdown-value">{formatCountdown(countdown.day)}</span>
                </div>
              </div>

              {/* 热力图 */}
              <div className="heatmap-section">
                <div className="heatmap-header">
                  <span className="heatmap-title">专注热力图</span>
                  <span className="heatmap-legend">
                    <span className="legend-item">
                      <span className="legend-color" style={{ background: 'rgba(255,255,255,0.05)' }}></span>
                      <span>0</span>
                    </span>
                    <span className="legend-item">
                      <span className="legend-color" style={{ background: 'rgba(255,149,0,0.3)' }}></span>
                      <span>1-2</span>
                    </span>
                    <span className="legend-item">
                      <span className="legend-color" style={{ background: 'rgba(255,149,0,0.5)' }}></span>
                      <span>3-4</span>
                    </span>
                    <span className="legend-item">
                      <span className="legend-color" style={{ background: 'rgba(255,149,0,0.7)' }}></span>
                      <span>5-6</span>
                    </span>
                    <span className="legend-item">
                      <span className="legend-color" style={{ background: 'rgba(255,149,0,0.9)' }}></span>
                      <span>7+</span>
                    </span>
                  </span>
                </div>
                <div className="heatmap-grid">
                  {getHeatmapData().map((day, index) => (
                    <div
                      key={day.date}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getHeatmapColor(day.count),
                        border: '1px solid rgba(255,149,0,0.1)'
                      }}
                      title={`${day.date}: ${day.count}个番茄钟`}
                    ></div>
                  ))}
                </div>
                <div className="heatmap-months">
                  <span>1 月</span>
                  <span>2 月</span>
                  <span>3 月</span>
                  <span>4 月</span>
                  <span>5 月</span>
                  <span>6 月</span>
                  <span>7 月</span>
                  <span>8 月</span>
                  <span>9 月</span>
                  <span>10 月</span>
                  <span>11 月</span>
                  <span>12 月</span>
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
                <select
                  className="todo-type-select"
                  value={todoType}
                  onChange={(e) => setTodoType(e.target.value)}
                >
                  <option value="once">一次性</option>
                  <option value="daily">每日</option>
                  <option value="long">长期</option>
                </select>
                <select
                  className="focus-mode-select"
                  value={todoFocusMode}
                  onChange={(e) => setTodoFocusMode(e.target.value)}
                >
                  <option value="time">时间</option>
                  <option value="count">次数</option>
                </select>
                <select
                  className="timer-mode-select"
                  value={todoTimerMode}
                  onChange={(e) => setTodoTimerMode(e.target.value)}
                >
                  <option value="countdown">倒计时</option>
                  <option value="countup">正计时</option>
                </select>
                {todoFocusMode === 'time' ? (
                  <input
                    type="number"
                    className="todo-target-input"
                    value={todoTargetTime}
                    onChange={(e) => setTodoTargetTime(parseInt(e.target.value) || 25)}
                    min="1"
                    max="180"
                    placeholder="分钟"
                    title="目标专注时间（分钟）"
                  />
                ) : (
                  <input
                    type="number"
                    className="todo-target-input"
                    value={todoTargetCount}
                    onChange={(e) => setTodoTargetCount(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    placeholder="次数"
                    title="目标专注次数"
                  />
                )}
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
                <div className="todo-filters">
                  <button
                    className={`filter-btn ${!todoFilter || todoFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setTodoFilter('all')}
                  >
                    全部
                  </button>
                  <button
                    className={`filter-btn ${todoFilter === 'daily' ? 'active' : ''}`}
                    onClick={() => setTodoFilter('daily')}
                  >
                    每日
                  </button>
                  <button
                    className={`filter-btn ${todoFilter === 'long' ? 'active' : ''}`}
                    onClick={() => setTodoFilter('long')}
                  >
                    长期
                  </button>
                  <button
                    className={`filter-btn ${todoFilter === 'once' ? 'active' : ''}`}
                    onClick={() => setTodoFilter('once')}
                  >
                    一次
                  </button>
                </div>
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
                {todos.filter(todo => todoFilter === 'all' || todo.type === todoFilter).length === 0 ? (
                  <div className="empty-state">
                    <p>暂无待办事项</p>
                    <p className="empty-hint">添加一个任务开始专注吧</p>
                  </div>
                ) : (
                  todos.filter(todo => todoFilter === 'all' || todo.type === todoFilter).map((todo) => (
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
                        <div className="todo-text-wrapper">
                          <span className="todo-text">{todo.text}</span>
                          <div className="todo-meta">
                            {todo.priority && (
                              <span className={`priority-badge priority-${todo.priority}`}>
                                {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                              </span>
                            )}
                            {todo.type && (
                              <span className={`type-badge type-${todo.type}`}>
                                {todo.type === 'daily' ? (
                                  <><CalendarIcon size={12} /> 每日</>
                                ) : todo.type === 'long' ? (
                                  <><RepeatIcon size={12} /> 长期</>
                                ) : (
                                  <><PinIcon size={12} /> 一次</>
                                )}
                              </span>
                            )}
                            <span className="focus-mode-badge">
                              {todo.focusMode === 'time' ? `${todo.targetTime}分钟` : `${todo.targetCount}次`}
                            </span>
                            {todo.timerMode && (
                              <span className="timer-mode-badge">
                                {todo.timerMode === 'countdown' ? '⏳' : '⏱️'}
                              </span>
                            )}
                            {todo.completedCount > 0 && (
                              <span className="completed-count">
                                ✅ {todo.completedCount}/{todo.focusMode === 'time' ? todo.targetTime : todo.targetCount}
                              </span>
                            )}
                          </div>
                        </div>
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
