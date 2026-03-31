/**
 * 网站图标 - 复古像素风格矢量图标
 * 统一风格：简洁几何 + 像素感
 */

// 奖杯图标
export function TrophyIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8h16v2H16V8z" fill={color}/>
      <path d="M14 10h4v8c0 3-2 6-6 6H8v-4h2V10h4z" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M30 10h4v10h2v4h-4c-4 0-6-3-6-6v-8h4z" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="18" y="10" width="12" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M20 28h8v4h-8v-4z" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M16 36h16v4H16v-4z" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="18" r="3" stroke={color} strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

// 奖牌图标
export function MedalIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="24" cy="24" r="2" fill={color}/>
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 10l6 6M32 32l6 6M10 38l6-6M32 16l6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 排名图标
export function RankIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="10" width="6" height="10" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="9" y="6" width="6" height="14" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="15" y="14" width="6" height="6" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M6 10V6M12 6V4M18 14v-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 关闭图标
export function CloseIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 炸弹/地雷图标
export function BombIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="26" r="12" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="26" r="4" fill={color} opacity="0.5"/>
      <path d="M24 14V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 6l-3 3M24 6l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="22" r="1.5" fill={color}/>
      <circle cx="20" cy="22" r="1.5" fill={color}/>
      <circle cx="24" cy="30" r="1.5" fill={color}/>
    </svg>
  )
}

// 计算器图标
export function CalculatorIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="6" width="28" height="36" rx="3" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="14" y="10" width="20" height="8" rx="1" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="17" cy="24" r="1.5" fill={color}/>
      <circle cx="24" cy="24" r="1.5" fill={color}/>
      <circle cx="31" cy="24" r="1.5" fill={color}/>
      <circle cx="17" cy="30" r="1.5" fill={color}/>
      <circle cx="24" cy="30" r="1.5" fill={color}/>
      <circle cx="31" cy="30" r="1.5" fill={color}/>
      <circle cx="17" cy="36" r="1.5" fill={color}/>
      <circle cx="24" cy="36" r="1.5" fill={color}/>
      <circle cx="31" cy="36" r="1.5" fill={color}/>
    </svg>
  )
}

// 旗帜图标
export function FlagIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3v18M5 4h10l-2 4 2 4H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 地雷图标
export function MineIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="2" fill={color}/>
      <path d="M12 7V4M12 20v-3M7 12H4M20 12h-3M6.3 6.3l-2-2M19.7 19.7l-2-2M6.3 17.7l-2 2M19.7 4.3l-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 时钟图标
export function TimerIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2"/>
      <path d="M12 8v5l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 2v2M12 20v2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 刷新图标
export function RefreshIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12a8 8 0 10-2.34 5.66M20 12v-6m0 6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 卷轴图标
export function ScrollIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4h8a4 4 0 014 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a4 4 0 014-4z" stroke={color} strokeWidth="2"/>
      <path d="M8 4v16M8 4h8" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

// 键盘图标
export function KeyboardIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M7 9h.01M11 9h.01M15 9h.01M7 13h.01M11 13h.01M15 13h.01M7 17h10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 灯泡图标
export function LightbulbIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3a7 7 0 015 12c-1.5 1.5-2 2.5-2 4h-6c0-1.5-.5-2.5-2-4a7 7 0 015-12z" stroke={color} strokeWidth="2"/>
      <path d="M9 21h6M12 17v2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 小鸟图标
export function BirdIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="14" rx="8" ry="6" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="16" cy="12" r="2" fill={color}/>
      <path d="M20 14l3-2-3-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10l-3-3M10 8l-2-4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 恐龙图标
export function DinosaurIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8h2a2 2 0 012 2v2a2 2 0 01-2 2h-2V8z" stroke={color} strokeWidth="2"/>
      <path d="M6 16V8a4 4 0 014-4h6v12H6z" stroke={color} strokeWidth="2"/>
      <circle cx="14" cy="10" r="1" fill={color}/>
      <path d="M8 16v4M12 16v4M16 16v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 12l4 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 蛇图标
export function SnakeIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10z" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="20" cy="22" r="2" fill={color} opacity="0.6"/>
      <circle cx="28" cy="22" r="2" fill={color} opacity="0.6"/>
      <path d="M22 28c0 2 2 4 4 4s4-2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 24c-2 0-4-2-4-4s2-4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M40 24c2 0 4-2 4-4s-2-4-4-4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 吃豆人图标
export function PacmanIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M24 24l14-10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 24l14 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="3" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 游戏手柄图标
export function GameIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="32" height="16" rx="3" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="16" cy="24" r="2" fill={color}/>
      <circle cx="36" cy="20" r="2" fill={color}/>
      <circle cx="40" cy="24" r="2" fill={color}/>
      <circle cx="36" cy="28" r="2" fill={color}/>
      <line x1="14" y1="24" x2="18" y2="24" stroke={color} strokeWidth="1.5"/>
      <line x1="16" y1="22" x2="16" y2="26" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

// 书本/文章图标
export function BookIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="24" height="28" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="18" y1="18" x2="30" y2="18" stroke={color} strokeWidth="1.5"/>
      <line x1="18" y1="24" x2="30" y2="24" stroke={color} strokeWidth="1.5"/>
      <line x1="18" y1="30" x2="26" y2="30" stroke={color} strokeWidth="1.5"/>
      <path d="M12 14h24" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

// 用户图标
export function UserIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="6" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="16" r="3" fill={color} opacity="0.5"/>
    </svg>
  )
}

// 首页/房子图标
export function HomeIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8L8 20v20h32V20L24 8z" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="20" y="28" width="8" height="12" stroke={color} strokeWidth="1.5" fill="none"/>
      <line x1="16" y1="24" x2="16" y2="40" stroke={color} strokeWidth="1.5"/>
      <line x1="32" y1="24" x2="32" y2="40" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}

// 汤圆图标（抽象化）
export function TangyuanIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="26" r="12" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="26" r="6" fill={color} opacity="0.3"/>
      <path d="M24 10v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="8" r="2" fill={color}/>
      <path d="M20 14c0 0-2-2-4-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 14c0 0 2-2 4-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 星星图标
export function StarIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6l4.5 10.5L40 18l-8 7 2.5 11L24 31l-10.5 5L16 25 8 18l11.5-1.5L24 6z" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="24" r="4" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 箭头图标
export function ArrowIcon({ size = 24, color = 'currentColor', direction = 'right' }) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  }
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation[direction]}deg)` }}
    >
      <path d="M8 4l8 8-8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 菜单图标
export function MenuIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="4" y1="18" x2="20" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 搜索图标
export function SearchIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="16" y1="16" x2="20" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 工具图标
export function ToolIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 14l10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M34 34l-6-6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="10" y="10" width="8" height="8" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="30" y="30" width="8" height="8" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

// 方块图标（俄罗斯方块用）
export function BlockIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="14" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="26" y="8" width="14" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="8" y="26" width="14" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="26" y="26" width="14" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

// 时钟图标
export function ClockIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="24" y1="16" x2="24" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="30" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="2" fill={color}/>
    </svg>
  )
}

// 代码图标
export function CodeIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 16l-8 8 8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 16l8 8-8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="28" y1="12" x2="20" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 实验图标
export function ExperimentIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8v8l-6 10a6 6 0 006 9h16a6 6 0 006-9l-6-10V8" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="20" y1="8" x2="28" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="30" r="3" fill={color} opacity="0.5"/>
      <circle cx="20" cy="34" r="2" fill={color} opacity="0.3"/>
      <circle cx="28" cy="34" r="2" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 播放图标
export function PlayIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,5 19,12 8,19" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}

// 暂停图标
export function PauseIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="5" x2="8" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="5" x2="16" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 重置图标
export function ResetIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4v6h6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 20v-6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 10a8 8 0 00-14-4" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M4 14a8 8 0 0014 4" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

// 加号图标
export function PlusIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 勾选图标
export function CheckIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="5,12 10,17 19,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

// 删除图标
export function TrashIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,7 8,7 8,4 16,4 16,7 20,7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 7v12a2 2 0 002 2h8a2 2 0 002-2V7" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 统计图表图标
export function ChartIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="20" x2="20" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="6" y="14" width="3" height="6" fill={color} opacity="0.5"/>
      <rect x="11" y="10" width="3" height="10" fill={color} opacity="0.7"/>
      <rect x="16" y="6" width="3" height="14" fill={color}/>
    </svg>
  )
}

// 图钉图标（一次性）
export function PinIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3 6 5 2-5 2-3 10-3-10-5-2 5-2 3-6z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="10" r="2" fill={color} opacity="0.5"/>
    </svg>
  )
}

// 日历图标（每日）
export function CalendarIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="4" y1="9" x2="20" y2="9" stroke={color} strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 保存图标
export function SaveIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M17 21v-8H7v8" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M7 3v5h8" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

// 加载图标
export function LoadIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={color} strokeWidth="2" fill="none"/>
      <polyline points="17,8 12,3 7,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 添加图标
export function AddIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 移除图标
export function RemoveIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 拖拽图标
export function DragIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="5" r="1.5" fill={color}/>
      <circle cx="15" cy="5" r="1.5" fill={color}/>
      <circle cx="9" cy="12" r="1.5" fill={color}/>
      <circle cx="15" cy="12" r="1.5" fill={color}/>
      <circle cx="9" cy="19" r="1.5" fill={color}/>
      <circle cx="15" cy="19" r="1.5" fill={color}/>
    </svg>
  )
}

// 循环图标（长期）
export function RepeatIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 11V9a4 4 0 014-4h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 23l-4-4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13v2a4 4 0 01-4 4H3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 用户图标（登录用）
export function LoginIcon({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="8" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M10 40c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="16" r="4" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 锁图标
export function LockIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="11" width="16" height="9" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M8 11V7a4 4 0 118 0v4" stroke={color} strokeWidth="2"/>
      <circle cx="12" cy="15" r="2" fill={color} opacity="0.5"/>
    </svg>
  )
}

// 邮箱图标
export function MailIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M3 7l9 6 9-6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 火焰/打卡图标
export function FireIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2c0 3-3 5-3 8a5 5 0 0010 0c0-3-3-5-3-8 0 0-2 2-4 2s-4-2-4-2z" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 14c-1 0-2 1-2 2.5a2 2 0 004 0c0-1.5-1-2.5-2-2.5z" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 每日重复图标
export function RepeatDailyIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 12h8" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"/>
    </svg>
  )
}

// 每周重复图标
export function RepeatWeeklyIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M3 9h18" stroke={color} strokeWidth="2"/>
      <circle cx="8" cy="7" r="1" fill={color}/>
      <circle cx="12" cy="7" r="1" fill={color}/>
      <circle cx="16" cy="7" r="1" fill={color}/>
      <path d="M12 14v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 16h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 每月重复图标
export function RepeatMonthlyIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M3 9h18" stroke={color} strokeWidth="2"/>
      <circle cx="12" cy="15" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 13v4M10 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 解锁图标
export function UnlockIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M16 10V7a4 4 0 10-8 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="15" r="1.5" fill={color}/>
    </svg>
  )
}

// 设置图标
export function SettingsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 游戏手柄图标
export function GamepadIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="8" rx="4" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M8 12v-2M7 11h2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="11" r="1" fill={color}/>
      <circle cx="18" cy="13" r="1" fill={color}/>
    </svg>
  )
}

// 文章/博客图标
export function ArticleIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M8 7h8M8 11h8M8 15h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 信息图标
export function InfoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 10v6M12 7v.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// 番茄钟图标
export function TomatoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="14" r="7" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 7V4M12 4l-2 2M12 4l2 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="3" fill={color} opacity="0.3"/>
    </svg>
  )
}

// 管理员工具箱图标
export function AdminToolsIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M10 7V5a2 2 0 114 0v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 11h18" stroke={color} strokeWidth="2"/>
      <circle cx="8" cy="15" r="1.5" fill={color}/>
      <circle cx="16" cy="15" r="1.5" fill={color}/>
    </svg>
  )
}

// 返回图标
export function ReturnIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 14l-4-4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 20v-7a4 4 0 00-4-4H5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// GitHub 图标
export function GithubIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85v2.74c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" stroke={color} strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

// 视频图标 (Bilibili)
export function VideoIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M10 9l5 3-5 3V9z" fill={color}/>
      <circle cx="18" cy="9" r="1.5" fill={color}/>
      <circle cx="18" cy="15" r="1.5" fill={color}/>
    </svg>
  )
}

// 商店图标 (TapTap)
export function ShopIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l2-5h14l2 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 9v11a2 2 0 002 2h10a2 2 0 002-2V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9V6a3 3 0 016 0v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 聊天图标 (QQ)
export function ChatIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12c0 4.97-4.03 9-9 9-1.5 0-2.9-.4-4.1-1.1L3 21l1.1-4.9C3.4 14.9 3 13.5 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="9" cy="11" r="1.5" fill={color}/>
      <circle cx="15" cy="11" r="1.5" fill={color}/>
      <path d="M9 15s1.5 1 3 1 3-1 3-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// 闪烁图标
export function SparkleIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

// 眼睛图标（查看密码）
export function EyeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

// 眼睛关闭图标（隐藏密码）
export function EyeOffIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
