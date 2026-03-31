import { useState, useEffect } from 'react'
import { TrophyIcon, MedalIcon, RankIcon, UserIcon } from '../components/icons/SiteIcons'
import '../styles/LeaderboardSidebar.css'

/**
 * 侧边栏式游戏排行榜组件（报纸排版风格）
 * @param {string} gameId - 游戏 ID (snake, tetris, pacman, etc.)
 * @param {string} gameName - 游戏名称
 */
export default function LeaderboardSidebar({ gameId, gameName }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
    fetchUserRank()
  }, [gameId])

  // 获取排行榜数据
  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard/${gameId}?limit=5`)
      const result = await response.json()
      
      if (result.success) {
        setLeaderboard(result.data)
      } else {
        setError(result.error || '获取排行榜失败')
      }
    } catch (err) {
      setError('网络连接失败')
      console.error('获取排行榜错误:', err)
    } finally {
      setLoading(false)
    }
  }

  // 获取用户排名
  const fetchUserRank = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await fetch(`/api/leaderboard/${gameId}/rank`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setUserRank(result.data)
        }
      }
    } catch (err) {
      console.error('获取用户排名错误:', err)
    }
  }

  // 获取用户头像
  const getUserAvatar = (userId) => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const parsedUser = JSON.parse(user)
        if (parsedUser.id === userId) {
          return parsedUser.avatar || null
        }
      }
      return null
    } catch {
      return null
    }
  }

  // 获取当前用户 ID
  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const parsedUser = JSON.parse(user)
        return parsedUser.id
      }
      return null
    } catch {
      return null
    }
  }

  // 获取排名样式
  const getRankStyle = (index) => {
    if (index === 0) return 'rank-1'
    if (index === 1) return 'rank-2'
    if (index === 2) return 'rank-3'
    return 'rank-normal'
  }

  // 格式化时间
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="leaderboard-sidebar">
      {/* 报头 */}
      <div className="sidebar-header">
        <div className="header-icon">
          <TrophyIcon size={24} color="#000000" />
        </div>
        <div className="header-title">
          <h3>排行榜</h3>
          <p className="subtitle">TOP PLAYERS</p>
        </div>
      </div>

      {/* 用户排名卡片 */}
      {userRank && (
        <div className="user-rank-card">
          <div className="user-rank-header">
            {userRank.avatar ? (
              <img src={userRank.avatar} alt="avatar" className="user-avatar-small" />
            ) : (
              <div className="user-avatar-placeholder-small">
                <UserIcon size={16} color="#ffffff" />
              </div>
            )}
            <span>你的排名</span>
          </div>
          <div className="user-rank-content">
            <div className="rank-badge">
              <span className="rank-number">#{userRank.rank}</span>
            </div>
            <div className="rank-score">
              <span className="score-value">{userRank.score.toLocaleString()}</span>
              <span className="score-unit">分</span>
            </div>
          </div>
          <div className="rank-total">
            共 {userRank.total} 位玩家
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <div className="sidebar-divider"></div>

      {/* 排行榜标题 */}
      <div className="leaderboard-section-title">
        <RankIcon size={16} color="#000000" />
        <span>TOP 5</span>
      </div>

      {/* 排行榜列表 */}
      <div className="leaderboard-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-bars">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="loading-bar"></div>
              ))}
            </div>
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="empty-state">
            <MedalIcon size={32} color="#666" />
            <p>暂无数据</p>
            <p className="hint">成为第一位上榜玩家</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry, index) => {
              const currentUserId = getCurrentUserId()
              const isCurrentUser = entry.userId === currentUserId
              const avatar = entry.avatar || getUserAvatar(entry.userId)
              return (
                <div 
                  key={entry.userId} 
                  className={`leaderboard-item ${getRankStyle(index)} ${isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="item-rank">
                    <span className="rank-num">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="item-player">
                    {avatar ? (
                      <img src={avatar} alt="avatar" className="player-avatar" />
                    ) : (
                      <div className="player-avatar-placeholder">
                        <UserIcon size={16} color="#ffffff" />
                      </div>
                    )}
                    <div className="player-info">
                      <span className="player-name">{entry.username}</span>
                      <span className="player-time">{formatDate(entry.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="item-score">{entry.score.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 报尾 */}
      <div className="sidebar-footer">
        <span>TAPE FUTURISM</span>
        <span className="separator">◆</span>
        <span>LEADERBOARD</span>
      </div>
    </div>
  )
}
