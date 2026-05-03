import { useEffect, useRef, useState, useCallback } from 'react'
import '../styles/Live2DBongoCat.css'

// Live2D 模型路径（键盘版）
const MODEL_PATH = '/assets/bongocat/models/keyboard/cat.model3.json'

export default function Live2DBongoCat() {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const modelRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(true)

  // 动态加载 PIXI + easy-live2d
  useEffect(() => {
    let cancelled = false
    let cleanupFns = []

    async function init() {
      try {
        if (!containerRef.current) return

        // 动态导入（避免打包冲突）
        const { Application, Ticker } = await import('pixi.js')
        const { Live2DSprite } = await import('easy-live2d')

        if (cancelled) return

        // 创建 PIXI Application
        const app = new Application()
        appRef.current = app

        await app.init({
          width: 512,
          height: 512,
          backgroundAlpha: 0,
          antialias: true,
        })

        if (!containerRef.current || cancelled) return

        // 添加 canvas
        if (app.canvas && app.canvas.parentNode !== containerRef.current) {
          containerRef.current.appendChild(app.canvas)
        }

        // 创建 Live2DSprite
        const model = new Live2DSprite({
          modelPath: MODEL_PATH,
          ticker: Ticker.shared,
        })

        modelRef.current = model
        app.stage.addChild(model)

        // 等待加载完成
        await model.ready

        if (cancelled) return

        // 缩放和定位
        const scale = 0.5
        model.scale.set(scale)
        model.x = 256
        model.y = 256

        setLoaded(true)
      } catch (err) {
        console.error('Live2D 初始化失败:', err)
        if (!cancelled) {
          setError(err.message || String(err))
        }
      }
    }

    init()

    return () => {
      cancelled = true
      cleanupFns.forEach(fn => fn())
      if (modelRef.current) {
        modelRef.current.destroy()
        modelRef.current = null
      }
      if (appRef.current) {
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [])

  // 键盘/鼠标交互
  const handleKeyDown = useCallback((e) => {
    if (!modelRef.current || e.repeat) return
    try { modelRef.current.setParameterValueById('CatParamLeftHandDown', 1) } catch {}
  }, [])

  const handleKeyUp = useCallback((e) => {
    if (!modelRef.current) return
    try { modelRef.current.setParameterValueById('CatParamLeftHandDown', 0) } catch {}
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (!modelRef.current) return
    // 键盘版模型：右手 = 鼠标点击
    try { modelRef.current.setParameterValueById('CatParamRightHandDown', 1) } catch {}
  }, [])

  const handleMouseUp = useCallback((e) => {
    if (!modelRef.current) return
    try { modelRef.current.setParameterValueById('CatParamRightHandDown', 0) } catch {}
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!modelRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

    // 键盘版模型：使用角度参数跟随鼠标
    const params = [
      ['ParamAngleX', x], ['ParamAngleY', y],
      ['ParamEyeBallX', x], ['ParamEyeBallY', y]
    ]
    for (const [id, val] of params) {
      try { modelRef.current.setParameterValueById(id, val) } catch {}
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove])

  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible(v => !v)
  }

  if (error) {
    return (
      <div className="bongo-cat-error" onContextMenu={handleContextMenu}>
        <div className="bongo-cat-error-text">加载失败: {error}</div>
      </div>
    )
  }

  return (
    <div
      className={`live2d-bongo-cat ${!visible ? 'hidden' : ''}`}
      onContextMenu={handleContextMenu}
      title="右键隐藏/显示"
    >
      <div ref={containerRef} className="live2d-bongo-cat-container" />
      {!loaded && !error && <div className="bongo-cat-loading">加载中...</div>}
    </div>
  )
}
