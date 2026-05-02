import { useState, useEffect, useRef } from 'react'
import '../styles/BongoCat.css'

/**
 * Bongo Cat - 桌面宠物
 * 响应键盘和鼠标输入，做出对应动作
 * 黑白漫画风格
 */

export default function BongoCat() {
  const [action, setAction] = useState('idle') // idle | keyboard | mouse | both
  const keyboardTimerRef = useRef(null)
  const mouseTimerRef = useRef(null)
  const [facing, setFacing] = useState('right') // right | left

  // 键盘监听
  useEffect(() => {
    const onKeyDown = () => {
      clearTimeout(keyboardTimerRef.current)
      setAction(prev => (prev === 'mouse' ? 'both' : 'keyboard'))
      keyboardTimerRef.current = setTimeout(() => {
        setAction(prev => (prev === 'both' ? 'mouse' : 'idle'))
      }, 300)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(keyboardTimerRef.current)
    }
  }, [])

  // 鼠标监听
  useEffect(() => {
    const onMouseDown = () => {
      clearTimeout(mouseTimerRef.current)
      setAction(prev => (prev === 'keyboard' ? 'both' : 'mouse'))
      mouseTimerRef.current = setTimeout(() => {
        setAction(prev => (prev === 'both' ? 'keyboard' : 'idle'))
      }, 300)
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      clearTimeout(mouseTimerRef.current)
    }
  }, [])

  // 右键切换朝向
  const onContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFacing(f => f === 'right' ? 'left' : 'right')
  }

  const isKeyboard = action === 'keyboard' || action === 'both'
  const isMouse = action === 'mouse' || action === 'both'

  return (
    <div
      className={`bongo-cat ${facing === 'left' ? 'facing-left' : ''}`}
      onContextMenu={onContextMenu}
      title="右键切换朝向 | Bongo Cat"
    >
      <svg viewBox="0 0 200 180" className="bongo-cat-svg">
        {/* 身体 */}
        <g className="cat-body">
          {/* 尾巴 - 摆动动画 */}
          <g className="cat-tail">
            <path
              d={facing === 'right' ? 'M45 130 Q20 120 15 90 Q12 75 20 70' : 'M155 130 Q180 120 185 90 Q188 75 180 70'}
              stroke="#1a1a1a"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* 身体主体 */}
          <ellipse
            cx="100"
            cy="120"
            rx="45"
            ry="35"
            fill="#1a1a1a"
            stroke="#fff"
            strokeWidth="2"
          />

          {/* 头部 */}
          <g className="cat-head">
            <ellipse
              cx="100"
              cy="80"
              rx="35"
              ry="30"
              fill="#1a1a1a"
              stroke="#fff"
              strokeWidth="2"
            />

            {/* 左耳朵 */}
            <polygon
              points={facing === 'right' ? '75,58 65,30 88,52' : '75,58 65,30 88,52'}
              fill="#1a1a1a"
              stroke="#fff"
              strokeWidth="2"
            />
            <polygon
              points={facing === 'right' ? '77,55 70,36 85,52' : '77,55 70,36 85,52'}
              fill="#fff"
              opacity="0.3"
            />

            {/* 右耳朵 */}
            <polygon
              points={facing === 'right' ? '125,58 135,30 112,52' : '125,58 135,30 112,52'}
              fill="#1a1a1a"
              stroke="#fff"
              strokeWidth="2"
            />
            <polygon
              points={facing === 'right' ? '123,55 130,36 115,52' : '123,55 130,36 115,52'}
              fill="#fff"
              opacity="0.3"
            />

            {/* 眼睛 */}
            <g className="cat-eyes">
              {isKeyboard || isMouse ? (
                // 打字/点击时 - 眼睛眯起来
                <>
                  <ellipse cx="88" cy="78" rx="8" ry="2" fill="#fff" />
                  <ellipse cx="112" cy="78" rx="8" ry="2" fill="#fff" />
                </>
              ) : (
                // 空闲时 - 大眼睛
                <>
                  <circle cx="88" cy="78" r="7" fill="#fff" />
                  <circle cx="88" cy="78" r="4" fill="#1a1a1a" />
                  <circle cx="90" cy="76" r="1.5" fill="#fff" />

                  <circle cx="112" cy="78" r="7" fill="#fff" />
                  <circle cx="112" cy="78" r="4" fill="#1a1a1a" />
                  <circle cx="114" cy="76" r="1.5" fill="#fff" />
                </>
              )}
            </g>

            {/* 鼻子 */}
            <ellipse cx="100" cy="88" rx="3" ry="2" fill="#fff" />

            {/* 嘴巴 */}
            <path
              d="M95 92 Q100 96 105 92"
              stroke="#fff"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 胡须 */}
            <g className="cat-whiskers" stroke="#fff" strokeWidth="1" opacity="0.6">
              <line x1="70" y1="85" x2="55" y2="82" />
              <line x1="70" y1="90" x2="55" y2="92" />
              <line x1="130" y1="85" x2="145" y2="82" />
              <line x1="130" y1="90" x2="145" y2="92" />
            </g>
          </g>

          {/* 前爪 - 键盘动画 */}
          <g className={`cat-paw-left ${isKeyboard ? 'typing' : ''}`}>
            <ellipse
              cx={facing === 'right' ? '75' : '125'}
              cy="145"
              rx="10"
              ry="8"
              fill="#1a1a1a"
              stroke="#fff"
              strokeWidth="2"
            />
          </g>

          <g className={`cat-paw-right ${isMouse ? 'typing' : ''}`}>
            <ellipse
              cx={facing === 'right' ? '125' : '75'}
              cy="145"
              rx="10"
              ry="8"
              fill="#1a1a1a"
              stroke="#fff"
              strokeWidth="2"
            />
          </g>

          {/* 脚 */}
          <ellipse cx="75" cy="150" rx="12" ry="6" fill="#1a1a1a" stroke="#fff" strokeWidth="2" />
          <ellipse cx="125" cy="150" rx="12" ry="6" fill="#1a1a1a" stroke="#fff" strokeWidth="2" />
        </g>

        {/* 键盘（仅在打字时显示动画效果） */}
        {isKeyboard && (
          <g className="keyboard-effect">
            <rect x="60" y="155" width="80" height="15" rx="3" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="70" y1="160" x2="70" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="80" y1="160" x2="80" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="90" y1="160" x2="90" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="100" y1="160" x2="100" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="110" y1="160" x2="110" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="120" y1="160" x2="120" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <line x1="130" y1="160" x2="130" y2="165" stroke="#fff" strokeWidth="1" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  )
}
