import { useEffect, useRef, useState, useCallback } from 'react'
import * as PIXI from 'pixi.js'
import 'pixi-live2d-display'
import '../styles/Live2DBongoCat.css'

/**
 * Live2D Bongo Cat - 使用 PIXI.js + pixi-live2d-display
 * 响应键盘和鼠标输入，驱动 Live2D 模型动画
 */

// Live2D 模型路径
const MODEL_PATH = '/assets/bongocat/models/standard/cat.model3.json'

// 模型参数 ID（来自 BongoCat 项目）
const PARAM_LEFT_HAND = 'CatParamLeftHandDown'
const PARAM_RIGHT_HAND = 'CatParamRightHandDown'
const PARAM_MOUSE_X = 'ParamMouseX'
const PARAM_MOUSE_Y = 'ParamMouseY'
const PARAM_ANGLE_X = 'ParamAngleX'
const PARAM_ANGLE_Y = 'ParamAngleY'
const PARAM_EYE_BALL_X = 'ParamEyeBallX'
const PARAM_EYE_BALL_Y = 'ParamEyeBallY'

export default function Live2DBongoCat() {
  const containerRef = useRef(null)
  const appRef = useRef(null)
  const modelRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(true)
  const [facingLeft, setFacingLeft] = useState(false)
  const scaleRef = useRef(0.3)

  // 初始化 PIXI.js + Live2D 模型
  useEffect(() => {
    if (!containerRef.current) return

    const app = new PIXI.Application({
      width: 400,
      height: 400,
      transparent: true,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    })
    appRef.current = app

    containerRef.current.appendChild(app.view)

    async function loadModel() {
      try {
        // 注册 Live2D 模型到 PIXI
        const model = await PIXI.live2d.Live2DModel.from(MODEL_PATH, {
          autoInteract: false, // 我们自己处理交互
        })

        modelRef.current = model

        // 设置模型位置和缩放
        const scale = scaleRef.current
        model.scale.set(scale)
        model.x = 200 - (model.width * scale) / 2
        model.y = 200 - (model.height * scale) / 2
        model.anchor.set(0.5)

        app.stage.addChild(model)

        // 模型就绪
        setLoaded(true)
      } catch (err) {
        console.error('Live2D 模型加载失败:', err)
        setError(err.message)
      }
    }

    loadModel()

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

    const model = modelRef.current
    // 键盘按下 → 左手敲键盘
    model.setParameterValue(PARAM_LEFT_HAND, 1)
  }, [])

  const handleKeyUp = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValue(PARAM_LEFT_HAND, 0)
  }, [])

  // 鼠标监听 - 驱动右手
  const handleMouseDown = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValue(PARAM_RIGHT_HAND, 1)
  }, [])

  const handleMouseUp = useCallback((e) => {
    if (!modelRef.current) return
    modelRef.current.setParameterValue(PARAM_RIGHT_HAND, 0)
  }, [])

  // 鼠标移动 - 驱动眼睛和头部跟随
  const handleMouseMove = useCallback((e) => {
    if (!modelRef.current) return

    const model = modelRef.current
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    // 计算鼠标相对于模型的位置 (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)

    model.setParameterValue(PARAM_MOUSE_X, x)
    model.setParameterValue(PARAM_MOUSE_Y, y)
    model.setParameterValue(PARAM_ANGLE_X, x)
    model.setParameterValue(PARAM_ANGLE_Y, y)
    model.setParameterValue(PARAM_EYE_BALL_X, x)
    model.setParameterValue(PARAM_EYE_BALL_Y, y)
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
    setFacingLeft(f => !f)
  }

  // 双击隐藏/显示
  const handleDoubleClick = () => {
    setVisible(v => !v)
  }

  if (error) {
    return (
      <div
        className="bongo-cat-error"
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        title="Live2D 加载失败，双击隐藏"
      >
        <div className="bongo-cat-error-text">
          加载失败: {error}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`live2d-bongo-cat ${!visible ? 'hidden' : ''} ${facingLeft ? 'facing-left' : ''}`}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      title="右键切换朝向 | 双击隐藏/显示 | Live2D Bongo Cat"
    >
      <div ref={containerRef} className="live2d-bongo-cat-container" />
      {!loaded && !error && (
        <div className="bongo-cat-loading">加载中...</div>
      )}
    </div>
  )
}
