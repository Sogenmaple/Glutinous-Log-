import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { ToolIcon } from '../components/icons/SiteIcons'
import '../styles/Calculator.css'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState([])

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('calculator_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load history')
      }
    }
  }, [])

  // 保存历史记录
  useEffect(() => {
    localStorage.setItem('calculator_history', JSON.stringify(history.slice(0, 20)))
  }, [history])

  // 输入数字
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  // 输入小数点
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  // 清除
  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  // 清除当前输入
  const clearEntry = () => {
    setDisplay('0')
  }

  // 正负号切换
  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }

  // 百分比
  const inputPercent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  // 执行运算
  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      setPreviousValue(newValue)
      setDisplay(String(newValue))

      // 添加到历史记录
      if (operation && !waitingForOperand) {
        addToHistory(currentValue, operation, inputValue, newValue)
      }
    }

    setWaitingForOperand(true)
    setOperation(nextOperator)
  }

  // 计算
  const calculate = (left, right, op) => {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '×': return left * right
      case '÷': return left / right
      case '=': return right
      default: return right
    }
  }

  // 添加到历史记录
  const addToHistory = (left, op, right, result) => {
    const expression = `${left} ${op} ${right} = ${result}`
    setHistory(prev => [expression, ...prev].slice(0, 20))
  }

  // 等于
  const handleEquals = () => {
    if (!operation || previousValue === null) return

    const inputValue = parseFloat(display)
    const result = calculate(previousValue, inputValue, operation)
    
    addToHistory(previousValue, operation, inputValue, result)
    
    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  // 平方根
  const sqrt = () => {
    const value = parseFloat(display)
    const result = Math.sqrt(value)
    setDisplay(String(result))
    setWaitingForOperand(true)
    addToHistory(value, '√', '', result)
  }

  // 平方
  const square = () => {
    const value = parseFloat(display)
    const result = value * value
    setDisplay(String(result))
    setWaitingForOperand(true)
    addToHistory(value, '²', '', result)
  }

  // 倒数
  const reciprocal = () => {
    const value = parseFloat(display)
    const result = 1 / value
    setDisplay(String(result))
    setWaitingForOperand(true)
    addToHistory(value, '1/x', '', result)
  }

  // 清除历史记录
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('calculator_history')
  }

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key)
      } else if (e.key === '.') {
        inputDot()
      } else if (e.key === '+') {
        performOperation('+')
      } else if (e.key === '-') {
        performOperation('-')
      } else if (e.key === '*') {
        performOperation('×')
      } else if (e.key === '/') {
        e.preventDefault()
        performOperation('÷')
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals()
      } else if (e.key === 'Escape') {
        clear()
      } else if (e.key === 'Backspace') {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay('0')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, previousValue, operation, waitingForOperand])

  return (
    <div className="calculator-page">
      <Header />
      
      <div className="calculator-container">
        {/* 标题 */}
        <div className="calculator-header">
          <h1 className="calculator-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">计算器</span>
          </h1>
          <p className="calculator-subtitle">CALCULATOR - 科学计算器</p>
        </div>

        {/* 计算器主体 */}
        <div className="calculator-wrapper">
          {/* 计算器 */}
          <div className="calculator">
            {/* 显示屏 */}
            <div className="calculator-display">
              <div className="display-expression">
                {previousValue !== null ? `${previousValue} ${operation || ''}` : ''}
              </div>
              <div className="display-value">{display}</div>
            </div>

            {/* 功能键区 */}
            <div className="calculator-keypad">
              {/* 第一行 */}
              <button className="btn btn-function" onClick={clear}>AC</button>
              <button className="btn btn-function" onClick={clearEntry}>CE</button>
              <button className="btn btn-function" onClick={inputPercent}>%</button>
              <button className="btn btn-operator" onClick={() => performOperation('÷')}>÷</button>

              {/* 第二行 */}
              <button className="btn btn-function" onClick={sqrt}>√</button>
              <button className="btn btn-function" onClick={square}>x²</button>
              <button className="btn btn-function" onClick={reciprocal}>1/x</button>
              <button className="btn btn-operator" onClick={() => performOperation('×')}>×</button>

              {/* 数字区 */}
              <button className="btn btn-number" onClick={() => inputDigit('7')}>7</button>
              <button className="btn btn-number" onClick={() => inputDigit('8')}>8</button>
              <button className="btn btn-number" onClick={() => inputDigit('9')}>9</button>
              <button className="btn btn-operator" onClick={() => performOperation('-')}>-</button>

              <button className="btn btn-number" onClick={() => inputDigit('4')}>4</button>
              <button className="btn btn-number" onClick={() => inputDigit('5')}>5</button>
              <button className="btn btn-number" onClick={() => inputDigit('6')}>6</button>
              <button className="btn btn-operator" onClick={() => performOperation('+')}>+</button>

              <button className="btn btn-number" onClick={() => inputDigit('1')}>1</button>
              <button className="btn btn-number" onClick={() => inputDigit('2')}>2</button>
              <button className="btn btn-number" onClick={() => inputDigit('3')}>3</button>
              <button className="btn btn-equals" onClick={handleEquals}>=</button>

              {/* 最后一行 */}
              <button className="btn btn-number btn-zero" onClick={() => inputDigit('0')}>0</button>
              <button className="btn btn-number" onClick={inputDot}>.</button>
              <button className="btn btn-function" onClick={toggleSign}>±</button>
            </div>
          </div>

          {/* 历史记录 */}
          <div className="calculator-history">
            <div className="history-header">
              <h3>📜 历史记录</h3>
              <button className="clear-history-btn" onClick={clearHistory}>清空</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="history-empty">暂无计算记录</p>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="history-item">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 键盘提示 */}
        <div className="keyboard-hints">
          <p>⌨️ 支持键盘输入：数字 0-9 | + - * / | Enter 计算 | Esc 清除 | Backspace 删除</p>
        </div>
      </div>
    </div>
  )
}
