import { useRef, useState, useEffect, useCallback } from 'react'
import '../styles/Live2DBongoCat.css'

// keyboard 模型 + 键盘底图/覆盖层
const MODEL_PATH = '/assets/bongocat/models/keyboard/cat.model3.json'
const KEYBOARD_BG = '/assets/bongocat/models/keyboard/resources/background.png'
const KEYBOARD_COVER = '/assets/bongocat/models/keyboard/resources/cover.png'
const LEFT_KEY_BASE = '/assets/bongocat/models/keyboard/resources/left-keys'
const RIGHT_KEY_BASE = '/assets/bongocat/models/keyboard/resources/right-keys'
const OTHER_KEY_BASE = '/assets/bongocat/models/keyboard/resources/other-keys'

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

// 判断按键在哪个目录
function getKeyPath(code) {
  const name = KEY_CODE_MAP[code]
  if (!name) return null
  // 方向键在 right-keys
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(code)) {
    return `${RIGHT_KEY_BASE}/${name}.png`
  }
  return `${LEFT_KEY_BASE}/${name}.png`
}

const LEFT_KEYS = new Set(Object.keys(KEY_CODE_MAP).filter(k => !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)))
const RIGHT_KEYS = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])

export default function Live2DBongoCat() {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const modelRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(true)
  const [pressedKeys, setPressedKeys] = useState(new Set())

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
        await app.init({ width:512, height:512, backgroundAlpha:0, antialias:true })
        if (!containerRef.current || cancelled) return
        containerRef.current.appendChild(app.canvas)
        const model = new Live2DSprite({ modelPath:MODEL_PATH, ticker:Ticker.shared })
        modelRef.current = model
        app.stage.addChild(model)
        await model.ready
        if (cancelled) return
        model.scale.set(0.5)
        model.x = 256
        model.y = 256
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

  // 键盘事件
  useEffect(() => {
    const onDown = (e) => {
      if (e.repeat) return
      setPressedKeys(prev => {
        const n = new Set(prev); n.add(e.code)
        const hasLeft = [...n].some(c => LEFT_KEYS.has(c))
        const hasRight = [...n].some(c => RIGHT_KEYS.has(c))
        updateModel(hasLeft, hasRight)
        return n
      })
    }
    const onUp = (e) => {
      setPressedKeys(prev => {
        const n = new Set(prev); n.delete(e.code)
        const hasLeft = [...n].some(c => LEFT_KEYS.has(c))
        const hasRight = [...n].some(c => RIGHT_KEYS.has(c))
        updateModel(hasLeft, hasRight)
        return n
      })
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [updateModel])

  // 鼠标事件
  useEffect(() => {
    const onDown = () => { if (modelRef.current) try { modelRef.current.setParameterValueById('ParamMouseLeftDown',1) } catch {} }
    const onUp = () => { if (modelRef.current) try { modelRef.current.setParameterValueById('ParamMouseLeftDown',0) } catch {} }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp) }
  }, [])

  // 鼠标跟随
  useEffect(() => {
    const onMove = (e) => {
      if (!modelRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width/2) / (rect.width/2)
      const y = (e.clientY - rect.top - rect.height/2) / (rect.height/2)
      for (const [id,v] of [['ParamAngleX',x],['ParamAngleY',y],['ParamEyeBallX',x],['ParamEyeBallY',y]])
        try { modelRef.current.setParameterValueById(id,v) } catch {}
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleContextMenu = (e) => { e.preventDefault(); e.stopPropagation(); setVisible(v => !v) }

  if (error) return <div className="bongo-cat-error" onContextMenu={handleContextMenu}><div className="bongo-cat-error-text">加载失败: {error}</div></div>

  // 当前需要显示的按键图片
  const activeKeyPaths = [...pressedKeys].map(code => getKeyPath(code)).filter(Boolean)

  return (
    <div className={`live2d-bongo-cat ${!visible ? 'hidden' : ''}`} onContextMenu={handleContextMenu} title="右键隐藏/显示">
      {/* 键盘底图 — 在猫后面 */}
      <img className="bongo-keyboard-bg" src={KEYBOARD_BG} alt="" draggable={false} />
      <div ref={containerRef} className="live2d-bongo-cat-container" />
      {/* 按键贴图叠加层 — 按下时覆盖 */}
      {activeKeyPaths.map((path) => (
        <img
          key={path}
          className="bongo-key-overlay"
          src={path}
          alt=""
          draggable={false}
        />
      ))}
      {/* 覆盖层 — 在猫上面 */}
      <img className="bongo-keyboard-cover" src={KEYBOARD_COVER} alt="" draggable={false} />
      {!loaded && !error && <div className="bongo-cat-loading">加载中...</div>}
    </div>
  )
}
