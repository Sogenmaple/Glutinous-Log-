import { useEffect, useRef, useState, useCallback } from 'react'
import { Application } from 'pixi.js'
import { Live2DSprite, Config, Priority } from 'easy-live2d'
import '../styles/Live2DBongoCat.css'

// Live2D 模型路径
const MODEL_PATH = '/assets/bongocat/models/standard/cat.model3.json'

export default function Live2DBongoCat() {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const modelRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(true)
  const scaleRef = useRef(0.3)

  // 初始化 PIXI.js + Live2D 模型
  useEffect(() => {
    if (!containerRef.current) return

    const app = new Application()
    appRef.current = app

    app.init({
      view: undefined,
      width: 400,
      height: 400,
      backgroundAlpha: 0,
      antialias: true,
    }).then(() => {
      if (containerRef.current) {
        containerRef.current.appendChild(app.view)
      }

      // 加载 Live2D 模型
      Live2DSprite.load(MODEL_PATH).then(model => {
        modelRef.current = model
        app.stage.addChild(model)

        model.once('ready', () => {
          const scale = scaleRef.current
          model.scale.set(scale)
          model.position.set(200, 200)
          model.anchor.set(0.5)
          setLoaded(true)
        })
      }).catch(err => {
        console.error('Live2D 模型加载失败:', err)
        setError(err.message)
      })
    }).catch(err => {
      console.error('PIXI 初始化失败:', err)
      setError(err.message)
    })

    return () => {
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

  // 键盘监听 - 驱动左手
  const handleKeyDown = useCallback((e) => {
    if (!modelRef.current || e.repeat) return
    modelRef.current.setParameterValueById('CatParamLeftHandDown', 1)
  }, [])

  const handleKeyUp = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValueById('CatParamLeftHandDown', 0)
  }, [])

  // 鼠标监听 - 驱动右手
  const handleMouseDown = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValueById('CatParamRightHandDown', 1)
  }, [])

  const handleMouseUp = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValueById('CatParamRightHandDown', 0)
  }, [])

  // 鼠标移动 - 驱动眼睛和头部跟随
  const handleMouseMove = useCallback((e) => {
    if (!modelRef.current || !containerRef.current) return

    const model = modelRef.current
    const rect = containerRef.current.getBoundingClientRect()

    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

    model.setParameterValueById('ParamMouseX', x)
    model.setParameterValueById('ParamMouseY', y)
    model.setParameterValueById('ParamAngleX', x)
    model.setParameterValueById('ParamAngleY', y)
    model.setParameterValueById('ParamEyeBallX', x)
    model.setParameterValueById('ParamEyeBallY', y)
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

  // 右键切换朝向
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible(v => !v)
  }

  if (error) {
    return (
      <div
        className="bongo-cat-error"
        onContextMenu={handleContextMenu}
        title="Live2D 加载失败"
      >
        <div className="bongo-cat-error-text">
          加载失败: {error}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`live2d-bongo-cat ${!visible ? 'hidden' : ''}`}
      onContextMenu={handleContextMenu}
      title="右键隐藏/显示 | Live2D Bongo Cat"
    >
      <div ref={containerRef} className="live2d-bongo-cat-container" />
      {!loaded && !error && (
        <div className="bongo-cat-loading">加载中...</div>
      )}
    </div>
  )
}
