/**
 * Bongo Cat 键盘可视化
 * 渲染完整键盘布局 + 按键高亮
 */
import { useEffect, useState, useCallback, useRef } from 'react'

const KEY_BASE = '/assets/bongocat/models/keyboard/resources'

// 按键图片映射：event.code → 图片文件名
const KEY_IMAGE_MAP = {
  Escape: 'Escape', Backquote: 'BackQuote', Digit1: 'Num1', Digit2: 'Num2',
  Digit3: 'Num3', Digit4: 'Num4', Digit5: 'Num5', Digit6: 'Num6',
  Digit7: 'Num7', Digit8: 'Num8', Digit9: 'Num9', Digit0: 'Num0',
  Minus: 'Minus', Equal: 'Equal', Backspace: 'Backspace',
  Tab: 'Tab', KeyQ: 'KeyQ', KeyW: 'KeyW', KeyE: 'KeyE', KeyR: 'KeyR',
  KeyT: 'KeyT', KeyY: 'KeyY', KeyU: 'KeyU', KeyI: 'KeyI', KeyO: 'KeyO',
  KeyP: 'KeyP', BracketLeft: 'BracketLeft', BracketRight: 'BracketRight',
  Backslash: 'Backslash', CapsLock: 'CapsLock', KeyA: 'KeyA', KeyS: 'KeyS',
  KeyD: 'KeyD', KeyF: 'KeyF', KeyG: 'KeyG', KeyH: 'KeyH', KeyJ: 'KeyJ',
  KeyK: 'KeyK', KeyL: 'KeyL', Semicolon: 'Semicolon', Quote: 'Quote',
  Enter: 'Return', ShiftLeft: 'ShiftLeft', ShiftRight: 'ShiftRight',
  KeyZ: 'KeyZ', KeyX: 'KeyX', KeyC: 'KeyC', KeyV: 'KeyV', KeyB: 'KeyB',
  KeyN: 'KeyN', KeyM: 'KeyM', Comma: 'Comma', Period: 'Period',
  Slash: 'Slash', Space: 'Space', ControlLeft: 'ControlLeft',
  ControlRight: 'ControlRight', AltLeft: 'Alt', AltRight: 'AltGr',
  MetaLeft: 'Meta', MetaRight: 'Meta', Delete: 'Delete',
  ArrowUp: 'UpArrow', ArrowDown: 'DownArrow', ArrowLeft: 'LeftArrow',
  ArrowRight: 'RightArrow',
}

// 判断按键属于左手还是右手
function getSide(code) {
  const leftKeys = ['Escape','Backquote','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','Backspace','Tab','KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI','KeyO','KeyP','BracketLeft','BracketRight','Backslash','CapsLock','KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','Enter','ShiftLeft','KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma','Period','Slash','Space','ControlLeft','AltLeft','MetaLeft']
  return leftKeys.includes(code) ? 'left' : 'right'
}

function getKeyImg(code) {
  const name = KEY_IMAGE_MAP[code]
  if (!name) return null
  const side = getSide(code)
  return `${KEY_BASE}/${side}-keys/${name}.png`
}

export default function KeyboardOverlay({ pressedKeys }) {
  const keys = Object.keys(KEY_IMAGE_MAP)
  
  return (
    <div className="bongo-keyboard-overlay">
      <div className="bongo-keyboard-inner">
        {keys.map((code) => {
          const src = getKeyImg(code)
          if (!src) return null
          const isPressed = pressedKeys.has(code)
          return (
            <div
              key={code}
              className={`bongo-key ${isPressed ? 'bongo-key-pressed' : ''}`}
              data-code={code}
            >
              <img src={src} alt={code} draggable={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
