// 矢量图标组件 - 替代 emoji

export function ProjectIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

export function DevlogIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export function TechIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="6" y1="8" x2="6" y2="8" strokeWidth="2" />
      <line x1="10" y1="8" x2="10" y2="8" strokeWidth="2" />
    </svg>
  )
}

export function DesignIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="7.5" cy="8.5" r="2.5" />
      <circle cx="10.5" cy="12.5" r="2.5" />
      <circle cx="8.5" cy="16.5" r="2.5" />
      <circle cx="14.5" cy="15.5" r="2.5" />
    </svg>
  )
}

export function LifeIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}

export function getTypeIcon(type, size = 24, className = '') {
  switch (type) {
    case 'project': return <ProjectIcon size={size} className={className} />
    case 'devlog': return <DevlogIcon size={size} className={className} />
    case 'tech': return <TechIcon size={size} className={className} />
    case 'design': return <DesignIcon size={size} className={className} />
    case 'life': return <LifeIcon size={size} className={className} />
    default: return <ProjectIcon size={size} className={className} />
  }
}
