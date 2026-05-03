import { useRef, useState, useEffect, useCallback } from 'react'
import '../styles/Live2DBongoCat.css'

// 新 standard 模型
const MODEL_PATH = '/assets/bongocat/models/standard-new/cat.model3.json'
// 键盘背景图（从新 standard 模型取）
const KEYBOARD_BG = '/assets/bongocat/models/standard-new/resources/background.png'
// 按键贴图目录（新 standard 模型）
const LEFT_KEY_BASE = '/assets/bongocat/models/standard-new/resources/left-keys'
// 新 standard 没有 right-keys，箭头键沿用 keyboard 模型
const RIGHT_KEY_BASE = '/assets/bongocat/models/keyboard/resources/right-keys'

// bongo-cat-next 原版鼠标跟踪范围（参照原版 _use-core.ts）
const MOUSE_RANGE_X = 100
const MOUSE_RANGE_Y = 100

// 猫的人设
const CAT_NAME = '汤圆三号机'
const CAT_GREETINGS = [
  '嗨～我是{NAME}！欢迎来到汤圆的小窝，今天过得怎么样呀？',
  '喵呜～{NAME}在这里等你哦！有什么想聊的吗？',
  '呼噜呼噜～你好呀！我是管理这个小窝的{NAME}～',
  '呀！你终于来啦～{NAME}等了你好久了呢！',
  '嘿嘿～今天也是元气满满的一天！{NAME}给你加油哦！',
]
const CAT_CLICK_REPLIES = [
  '喵？找我有事吗～',
  '嘿嘿，戳我干嘛呀～',
  '唔…我在听呢，你说～',
  '汤圆三号机，随时待命！',
  '喵呜～你摸到我啦！',
  '哎呀～别戳别戳～好啦好啦我在呢～',
  '嗯嗯！{NAME}在这里哦！',
  '有什么我可以帮你的吗～',
]

// 按键映射
const KEY_CODE_MAP = {
  Escape:'Escape', Backquote:'BackQuote',
  Digit1:'Num1',Digit2:'Num2',Digit3:'Num3',Digit4:'Num4',Digit5:'Num5',
  Digit6:'Num6',Digit7:'Num7',Digit8:'Num8',Digit9:'Num9',Digit0:'Num0',
  Minus:'Minus', Equal:'Equal', Backspace:'Backspace',
  Tab:'Tab',
  KeyQ:'KeyQ',KeyW:'KeyW',KeyE:'KeyE',KeyR:'KeyR',KeyT:'KeyT',
  KeyY:'KeyY',KeyU:'KeyU',KeyI:'KeyI',KeyO:'KeyO',KeyP:'KeyP',
  BracketLeft:'BracketLeft',BracketRight:'BracketRight',Backslash:'Backslash',
  CapsLock:'CapsLock',
  KeyA:'KeyA',KeyS:'KeyS',KeyD:'KeyD',KeyF:'KeyF',KeyG:'KeyG',
  KeyH:'KeyH',KeyJ:'KeyJ',KeyK:'KeyK',KeyL:'KeyL',
  Semicolon:'Semicolon',Quote:'Quote',Enter:'Return',
  ShiftLeft:'ShiftLeft',ShiftRight:'ShiftRight',
  KeyZ:'KeyZ',KeyX:'KeyX',KeyC:'KeyC',KeyV:'KeyV',KeyB:'KeyB',
  KeyN:'KeyN',KeyM:'KeyM',Comma:'Comma',Period:'Period',Slash:'Slash',
  Space:'Space',
  ControlLeft:'ControlLeft',ControlRight:'ControlRight',
  AltLeft:'Alt',AltRight:'AltGr',
  MetaLeft:'Meta',MetaRight:'Meta',
  ArrowUp:'UpArrow',ArrowDown:'DownArrow',ArrowLeft:'LeftArrow',ArrowRight:'RightArrow',
  F1:'Fn',F2:'Fn',F3:'Fn',F4:'Fn',F5:'Fn',F6:'Fn',F7:'Fn',F8:'Fn',F9:'Fn',F10:'Fn',F11:'Fn',F12:'Fn',
  Delete:'Delete',Fn:'Fn',
}

function getKeyPath(code) {
  const name = KEY_CODE_MAP[code]
  if (!name) return null
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(code)) {
    return `${RIGHT_KEY_BASE}/${name}.png`
  }
  return `${LEFT_KEY_BASE}/${name}.png`
}

const LEFT_KEYS = new Set(Object.keys(KEY_CODE_MAP).filter(k => !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)))
const RIGHT_KEYS = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatMessage(template, name) {
  return template.replace(/\{NAME\}/g, name)
}

export default function Live2DBongoCat({ onReply }) {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const modelRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(true)
  // 修复1: 改用 {code: true} 对象而不是 Set，避免相同路径的按键冲突
  const [pressedKeys, setPressedKeys] = useState({})

  // 对话气泡相关状态
  const [bubbleText, setBubbleText] = useState('')
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const bubbleTimerRef = useRef(null)
  const catRef = useRef(null)
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 })

  // 加载 Live2D 模型
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        if (!containerRef.current) return
        const { Application, Ticker } = await import('pixi.js')
        const { Live2DSprite } = await import('easy-live2d')
        if (cancelled) return
        const app = new Application()
        appRef.current = app
        await app.init({ width: 612, height: 354, backgroundAlpha:0, antialias:true })
        if (!containerRef.current || cancelled) return
        containerRef.current.appendChild(app.canvas)
        const model = new Live2DSprite({ modelPath:MODEL_PATH, ticker:Ticker.shared })
        modelRef.current = model
        app.stage.addChild(model)
        await model.ready
        if (cancelled) return
        setLoaded(true)
      } catch (err) {
        if (!cancelled) setError(err.message || String(err))
      }
    }
    init()
    return () => {
      cancelled = true
      if (modelRef.current) { modelRef.current.destroy(); modelRef.current = null }
      if (appRef.current) { appRef.current.destroy(true); appRef.current = null }
    }
  }, [])

  // 更新模型手部参数
  const updateModel = useCallback((hasLeft, hasRight) => {
    if (!modelRef.current) return
    try { modelRef.current.setParameterValueById('CatParamLeftHandDown', hasLeft ? 1 : 0) } catch {}
    try { modelRef.current.setParameterValueById('ParamMouseLeftDown', hasRight ? 1 : 0) } catch {}
  }, [])

  // 键盘事件（修复1: 使用对象代替Set，每个按键code独立追踪）
  useEffect(() => {
    const onDown = (e) => {
      if (e.repeat) return
      setPressedKeys(prev => {
        const n = { ...prev, [e.code]: true }
        const hasLeft = Object.keys(n).some(c => LEFT_KEYS.has(c))
        const hasRight = Object.keys(n).some(c => RIGHT_KEYS.has(c))
        updateModel(hasLeft, hasRight)
        return n
      })
    }
    const onUp = (e) => {
      setPressedKeys(prev => {
        const n = { ...prev }
        delete n[e.code]
        const hasLeft = Object.keys(n).some(c => LEFT_KEYS.has(c))
        const hasRight = Object.keys(n).some(c => RIGHT_KEYS.has(c))
        updateModel(hasLeft, hasRight)
        return n
      })
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [updateModel])

  // 鼠标事件（修复2: 区分左键/右键点击）
  useEffect(() => {
    const onDown = (e) => {
      if (!modelRef.current) return
      if (e.button === 2) {
        try { modelRef.current.setParameterValueById('ParamMouseRightDown', 1) } catch {}
      } else if (e.button === 0) {
        try { modelRef.current.setParameterValueById('ParamMouseLeftDown', 1) } catch {}
      }
    }
    const onUp = (e) => {
      if (!modelRef.current) return
      if (e.button === 2) {
        try { modelRef.current.setParameterValueById('ParamMouseRightDown', 0) } catch {}
      } else if (e.button === 0) {
        try { modelRef.current.setParameterValueById('ParamMouseLeftDown', 0) } catch {}
      }
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp) }
  }, [])

  // 鼠标跟随：参照 bongo-cat-next 原版 _use-core.ts 实现
  useEffect(() => {
    const onMove = (e) => {
      if (!modelRef.current) return
      const mx = ((e.clientX / window.innerWidth) * 2 - 1) * MOUSE_RANGE_X
      const my = ((e.clientY / window.innerHeight) * -2 + 1) * MOUSE_RANGE_Y
      try { modelRef.current.setParameterValueById('ParamMouseX', mx) } catch {}
      try { modelRef.current.setParameterValueById('ParamMouseY', my) } catch {}
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * -2 + 1
      try { modelRef.current.setParameterValueById('ParamAngleX', nx * 30) } catch {}
      try { modelRef.current.setParameterValueById('ParamAngleY', ny * 30) } catch {}
      try { modelRef.current.setParameterValueById('ParamEyeBallX', nx) } catch {}
      try { modelRef.current.setParameterValueById('ParamEyeBallY', ny) } catch {}
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleContextMenu = (e) => { e.preventDefault(); e.stopPropagation(); setVisible(v => !v) }

  // ============ 对话气泡功能 ============

  // 显示气泡（3秒后自动消失）
  const showBubble = useCallback((text) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    setBubbleText(text)
    setBubbleVisible(true)
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleVisible(false)
      setBubbleText('')
    }, 3000)
  }, [])

  // 刷新页面时自动打招呼
  useEffect(() => {
    if (!loaded) return
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const username = user.displayName || user.username || '旅行者'
      const greeting = formatMessage(pickRandom(CAT_GREETINGS), CAT_NAME)
      // 稍微延迟，让模型先加载完
      const timer = setTimeout(() => showBubble(greeting.replace('你好呀', username + '你好呀').replace('你终于来啦', username + '你终于来啦')), 1500)
      return () => clearTimeout(timer)
    } catch {}
  }, [loaded, showBubble])

  // 接收外部回复（来自任务栏输入框）
  useEffect(() => {
    if (!onReply) return
    const cleanup = onReply((text) => {
      showBubble(text)
    })
    return cleanup
  }, [onReply, showBubble])

  // 猫点击处理（区分拖拽和点击）
  const handleCatMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    const rect = catRef.current.getBoundingClientRect()
    dragRef.current = {
      dragging: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    const onMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragRef.current.dragging = true
      }
    }
    const onMouseUp = (e) => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      // 如果不是拖拽，则视为点击
      if (!dragRef.current.dragging) {
        const reply = formatMessage(pickRandom(CAT_CLICK_REPLIES), CAT_NAME)
        showBubble(reply)
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [showBubble])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    }
  }, [])

  // 修复1: 使用 Object.keys 遍历每个按键code，确保每个按键独立显示
  const activeKeyCodes = Object.keys(pressedKeys)
  const activeKeyElements = activeKeyCodes.map(code => {
    const path = getKeyPath(code)
    if (!path) return null
    return (
      <img
        key={code}
        className="bongo-key-overlay"
        src={path}
        alt=""
        draggable={false}
      />
    )
  }).filter(Boolean)

  return (
    <div className={`live2d-bongo-cat ${!visible ? 'hidden' : ''}`} onContextMenu={handleContextMenu} title="右键隐藏/显示">
      {/* 对话气泡 */}
      {bubbleVisible && bubbleText && (
        <div className={`bongo-speech-bubble ${bubbleVisible ? 'show' : ''}`}>
          <div className="bubble-text">{bubbleText}</div>
          <div className="bubble-tail"></div>
        </div>
      )}

      <div className="bongo-keyboard-wrapper" ref={catRef} onMouseDown={handleCatMouseDown}>
        <img className="bongo-keyboard-bg" src={KEYBOARD_BG} alt="" draggable={false} />
        <div ref={containerRef} className="live2d-bongo-cat-container" />
        {activeKeyElements}
      </div>
      {!loaded && !error && <div className="bongo-cat-loading">加载中...</div>}
    </div>
  )
}
