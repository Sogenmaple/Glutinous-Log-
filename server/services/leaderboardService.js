// 游戏排行榜数据管理
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../../src/data')
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboards.json')

// 支持的游戏列表
export const SUPPORTED_GAMES = [
  'snake',
  'tetris',
  'pacman',
  'minesweeper',
  'dinosaur',
  'flybird'
]

// 初始化排行榜文件
export async function initLeaderboardFile() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
  
  try {
    await fs.access(LEADERBOARD_FILE)
  } catch {
    const initialData = {}
    SUPPORTED_GAMES.forEach(gameId => {
      initialData[gameId] = []
    })
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
    console.log('✓ 排行榜数据文件已初始化')
  }
}

// 读取排行榜数据
export async function readLeaderboards() {
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('读取排行榜数据失败:', err)
    return {}
  }
}

// 写入排行榜数据
export async function writeLeaderboards(data) {
  try {
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('写入排行榜数据失败:', err)
    return false
  }
}

// 获取某个游戏的排行榜（前 N 名）
export async function getGameLeaderboard(gameId, limit = 10) {
  if (!SUPPORTED_GAMES.includes(gameId)) {
    throw new Error(`不支持的游戏：${gameId}`)
  }
  
  const leaderboards = await readLeaderboards()
  const gameBoard = leaderboards[gameId] || []
  
  // 按分数降序排序，取前 N 名
  const sorted = gameBoard
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  
  return sorted
}

// 提交新分数
export async function submitScore(gameId, userId, username, score) {
  if (!SUPPORTED_GAMES.includes(gameId)) {
    throw new Error(`不支持的游戏：${gameId}`)
  }
  
  const leaderboards = await readLeaderboards()
  
  if (!leaderboards[gameId]) {
    leaderboards[gameId] = []
  }
  
  const gameBoard = leaderboards[gameId]
  const timestamp = new Date().toISOString()
  
  // 检查是否已有该用户的记录
  const existingIndex = gameBoard.findIndex(entry => entry.userId === userId)
  
  if (existingIndex !== -1) {
    // 更新已有记录（只保留最高分）
    if (score > gameBoard[existingIndex].score) {
      gameBoard[existingIndex] = {
        ...gameBoard[existingIndex],
        score,
        timestamp
      }
      console.log(`✓ 更新了用户 ${username} 在 ${gameId} 的排行榜记录：${score}`)
    } else {
      // 新分数不如已有记录，不更新
      return { success: false, message: '新分数未超过已有记录', rank: existingIndex + 1 }
    }
  } else {
    // 添加新记录
    gameBoard.push({
      userId,
      username,
      score,
      timestamp
    })
    console.log(`✓ 添加了用户 ${username} 在 ${gameId} 的排行榜记录：${score}`)
  }
  
  // 重新排序
  leaderboards[gameId] = gameBoard.sort((a, b) => b.score - a.score)
  
  // 写入文件
  await writeLeaderboards(leaderboards)
  
  // 获取用户的新排名
  const newRank = leaderboards[gameId].findIndex(entry => entry.userId === userId) + 1
  
  return {
    success: true,
    rank: newRank,
    total: leaderboards[gameId].length
  }
}

// 获取用户在游戏中的排名
export async function getUserRank(gameId, userId) {
  const leaderboards = await readLeaderboards()
  const gameBoard = leaderboards[gameId] || []
  
  const sorted = gameBoard.sort((a, b) => b.score - a.score)
  const index = sorted.findIndex(entry => entry.userId === userId)
  
  if (index === -1) {
    return null // 用户还没有记录
  }
  
  return {
    rank: index + 1,
    score: sorted[index].score,
    total: sorted.length
  }
}

// 删除排行榜记录（用于管理员）
export async function deleteLeaderboardEntry(gameId, userId) {
  const leaderboards = await readLeaderboards()
  
  if (!leaderboards[gameId]) {
    return false
  }
  
  const initialLength = leaderboards[gameId].length
  leaderboards[gameId] = leaderboards[gameId].filter(entry => entry.userId !== userId)
  
  if (leaderboards[gameId].length < initialLength) {
    await writeLeaderboards(leaderboards)
    return true
  }
  
  return false
}

// 清空某个游戏的排行榜
export async function clearGameLeaderboard(gameId) {
  const leaderboards = await readLeaderboards()
  leaderboards[gameId] = []
  await writeLeaderboards(leaderboards)
  return true
}
