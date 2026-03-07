import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToolIcon, ClockIcon, CodeIcon, ExperimentIcon, BombIcon, CalculatorIcon, BirdIcon, DinosaurIcon, SnakeIcon, PacmanIcon, BlockIcon } from '../components/icons/SiteIcons'

/**
 * 特殊构造 - 工具与实验页面
 * 展示各种创意工具和实验性项目
 */
export default function SpecialConstructs() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const specialTools = [
    {
      id: 'pomodoro',
      title: '番茄钟待办',
      subtitle: 'POMODORO TODO',
      description: '专注工作与休息的番茄钟时间管理法，搭配待办事项清单',
      icon: ClockIcon,
      color: 'red',
      path: '/special/pomodoro',
      status: 'active'
    },
    {
      id: 'minesweeper',
      title: '扫雷游戏',
      subtitle: 'MINESWEEPER',
      description: '经典益智扫雷游戏，找出所有非地雷格子',
      icon: BombIcon,
      color: 'amber',
      path: '/special/minesweeper',
      status: 'active'
    },
    {
      id: 'calculator',
      title: '科学计算器',
      subtitle: 'CALCULATOR',
      description: '功能齐全的科学计算器，支持历史记录和键盘输入',
      icon: CalculatorIcon,
      color: 'cyan',
      path: '/special/calculator',
      status: 'active'
    },
    {
      id: 'tetris',
      title: '俄罗斯方块',
      subtitle: 'TETRIS',
      description: '经典益智俄罗斯方块，消除行来得分',
      icon: BlockIcon,
      color: 'purple',
      path: '/special/tetris',
      status: 'active'
    },
    {
      id: 'flybird',
      title: '飞扬的小鸟',
      subtitle: 'FLAPPY BIRD',
      description: '经典飞行游戏，躲避管道飞跃障碍',
      icon: BirdIcon,
      color: 'amber',
      path: '/special/flybird',
      status: 'active'
    },
    {
      id: 'dinosaur',
      title: '恐龙快跑',
      subtitle: 'DINO RUN',
      description: 'Chrome 小恐龙游戏，无尽跑酷挑战',
      icon: DinosaurIcon,
      color: 'green',
      path: '/special/dinosaur',
      status: 'active'
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      subtitle: 'SNAKE',
      description: '经典贪吃蛇游戏，吃掉食物变长，挑战最高分',
      icon: SnakeIcon,
      color: 'amber',
      path: '/special/snake',
      status: 'active'
    },
    {
      id: 'pacman',
      title: '吃豆人',
      subtitle: 'PAC-MAN',
      description: '经典吃豆人游戏，吃掉所有豆子，躲避幽灵追击',
      icon: PacmanIcon,
      color: 'amber',
      path: '/special/pacman',
      status: 'active'
    },
    {
      id: 'code-snippets',
      title: '代码片段库',
      subtitle: 'CODE SNIPPETS',
      description: '常用代码片段收藏与分类管理',
      icon: CodeIcon,
      color: 'cyan',
      path: '/special/snippets',
      status: 'coming-soon'
    },
    {
      id: 'dev-tools',
      title: '开发工具箱',
      subtitle: 'DEV TOOLS',
      description: '实用开发小工具集合',
      icon: ToolIcon,
      color: 'amber',
      path: '/special/tools',
      status: 'coming-soon'
    },
    {
      id: 'experiments',
      title: '创意实验',
      subtitle: 'CREATIVE EXPERIMENTS',
      description: '各种奇思妙想的实验性项目',
      icon: ExperimentIcon,
      color: 'purple',
      path: '/special/experiments',
      status: 'coming-soon'
    }
  ]

  return (
    <>
      <Header />
      <main className="special-constructs-page">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">
              <ToolIcon size={40} color="#ff9500" />
            </span>
            <span className="title-text">特殊构造</span>
          </h1>
          <p className="page-subtitle">SPECIAL CONSTRUCTS - 工具 · 实验 · 创意</p>
        </div>

        <div className="special-grid">
          {specialTools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <div
                key={tool.id}
                className={`special-card ${tool.color} ${hoveredCard === tool.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => tool.status === 'active' && navigate(tool.path)}
              >
                <div className="card-bg-decoration"></div>
                
                <div className="card-content">
                  <div className="card-icon">
                    <IconComponent size={56} color="currentColor" />
                  </div>
                  <h3 className="card-title">{tool.title}</h3>
                  <p className="card-subtitle">{tool.subtitle}</p>
                  <p className="card-description">{tool.description}</p>
                  
                  <div className="card-status">
                    {tool.status === 'active' ? (
                      <span className="status-badge active">
                        <span className="status-dot"></span>
                        可用
                      </span>
                    ) : (
                      <span className="status-badge coming-soon">
                        敬请期待
                      </span>
                    )}
                  </div>

                  {tool.status === 'active' && (
                    <div className="card-arrow">
                      <span>ENTER</span>
                      <span className="arrow-symbol">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M8 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
