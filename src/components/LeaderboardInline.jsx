import { useState, useEffect } from 'react'
import { TrophyIcon, MedalIcon, RankIcon } from '../components/icons/SiteIcons'
import '../styles/LeaderboardInline.css'

/**
 * 内嵌式游戏排行榜组件（报纸排版风格）
 * @param {string} gameId - 游戏 ID (snake, tetris, pacman, etc.)
 * @param {string} gameName - 游戏名称
 */
export default function LeaderboardInline({ gameId, gameName }) {
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

  // 获取奖牌图标
  const getMedalIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return null
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
    <div className="leaderboard-inline">
      {/* 报头 */}
      <div className="leaderboard-inline-header">
        <div className="leaderboard-icon">
          <TrophyIcon size={28} color="#000000" />
        </div>
        <div className="leaderboard-title-block">
          <h3>排行榜</h3>
          <p className="leaderboard-subtitle">LEADERBOARD · TAPE FUTURISM</p>
        </div>
        <div className="leaderboard-status">
          <RankIcon size={20} color="#000000" />
        </div>
      </div>

      {/* 用户排名卡片 */}
      {userRank && (
        <div className="user-rank-inline">
          <div className="user-rank-number">#{userRank.rank}</div>
          <div className="user-rank-score">{userRank.score.toLocaleString()} 分</div>
          <div className="user-rank-total">共 {userRank.total} 位玩家</div>
        </div>
      )}

      {/* 排行榜列表 */}
      <div className="leaderboard-inline-content">
        {loading ? (
          <div className="loading-inline">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <p>数据加载中...</p>
          </div>
        ) : error ? (
          <div className="error-inline">
            <p>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="empty-inline">
            <MedalIcon size={40} color="#666" />
            <p>暂无排行榜数据</p>
            <p className="empty-hint">成为第一个上榜的玩家！</p>
          </div>
        ) : (
          <div className="leaderboard-inline-list">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.userId} 
                className={`leaderboard-inline-item ${entry.userId === userRank?.userId ? 'current-user' : ''}`}
              >
                <div className="inline-rank">
                  {getMedalIcon(index) || (
                    <span className="inline-rank-number">{String(index + 1).padStart(2, '0')}</span>
                  )}
                </div>
                
                <div className="inline-player">
                  <span className="inline-player-name">{entry.username}</span>
                  <span className="inline-player-date">{formatDate(entry.timestamp)}</span>
                </div>
                
                <div className="inline-score">{entry.score.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 报尾装饰 */}
      <div className="leaderboard-inline-footer">
        <span>TOP PLAYERS</span>
        <span>◆</span>
        <span>TAPE STYLE</span>
      </div>
    </div>
  )
}
