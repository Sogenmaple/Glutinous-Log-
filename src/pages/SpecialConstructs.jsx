import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToolIcon, ClockIcon, CodeIcon, ExperimentIcon, BombIcon, CalculatorIcon, TangyuanIcon } from '../components/icons/SiteIcons'

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
      id: 'prefix',
      title: '风格化前缀',
      subtitle: 'STYLED PREFIX',
      description: '自定义进场动画、屏保效果和视觉前缀',
      icon: TangyuanIcon,
      color: 'amber',
      path: '/special/prefix-settings',
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
          <p className="page-subtitle">SPECIAL CONSTRUCTS // TOOLS & EXPERIMENTS</p>
        </div>

        <div className="tools-grid">
          {specialTools.map((tool, index) => {
            const IconComponent = tool.icon
            return (
              <div
                key={tool.id}
                className={`tool-card ${tool.color} ${tool.featured ? 'featured' : ''} ${hoveredCard === tool.id ? 'hovered' : ''} ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(tool.path)}
              >
                <div className="card-icon">
                  <IconComponent size={48} color="currentColor" />
                </div>

                <div className="card-content">
                  <h3 className="card-title">{tool.title}</h3>
                  <p className="card-subtitle">{tool.subtitle}</p>
                  <p className="card-description">{tool.description}</p>
                </div>

                {tool.status === 'active' ? (
                  <span className="status-badge active">可用</span>
                ) : (
                  <span className="status-badge coming-soon">即将推出</span>
                )}

                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
              </div>
            )
          })}
        </div>

        <Footer />
      </main>
    </>
  )
}
