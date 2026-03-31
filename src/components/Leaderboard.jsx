import { useState, useEffect } from 'react'
import { TrophyIcon, MedalIcon, RankIcon, CloseIcon } from '../components/icons/SiteIcons'
import '../styles/Leaderboard.css'

/**
 * 游戏排行榜组件
 * @param {string} gameId - 游戏 ID (snake, tetris, pacman, etc.)
 * @param {string} gameName - 游戏名称
 * @param {function} onClose - 关闭回调
 */
export default function Leaderboard({ gameId, gameName, onClose }) {
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
      const response = await fetch(`/api/leaderboard/${gameId}?limit=10`)
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
    <div className="leaderboard-overlay" onClick={onClose}>
      <div className="leaderboard-container" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="leaderboard-header">
          <div className="leaderboard-title">
            <TrophyIcon size={32} color="#000000" />
            <h2>{gameName} - 排行榜</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon size={24} color="#000000" />
          </button>
        </div>

        {/* 用户排名卡片 */}
        {userRank && (
          <div className="user-rank-card">
            <div className="rank-info">
              <span className="rank-number">#{userRank.rank}</span>
              <span className="rank-label">你的排名</span>
            </div>
            <div className="score-info">
              <span className="score-value">{userRank.score.toLocaleString()}</span>
              <span className="score-label">分</span>
            </div>
            <div className="total-players">
              共 {userRank.total} 位玩家
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>加载中...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchLeaderboard}>重试</button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="empty-state">
              <MedalIcon size={48} color="#666" />
              <p>暂无排行榜数据</p>
              <p className="empty-hint">成为第一个上榜的玩家！</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.userId} 
                  className={`leaderboard-item ${entry.userId === userRank?.userId ? 'current-user' : ''}`}
                >
                  <div className="rank">
                    {getMedalIcon(index) || (
                      <span className="rank-number">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="player-info">
                    <span className="player-name">{entry.username}</span>
                    <span className="play-date">{formatDate(entry.timestamp)}</span>
                  </div>
                  
                  <div className="score">{entry.score.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部装饰 */}
        <div className="leaderboard-footer">
          <RankIcon size={20} color="#000000" />
          <span>磁带未来风格排行榜</span>
          <RankIcon size={20} color="#000000" />
        </div>
      </div>
    </div>
  )
}
