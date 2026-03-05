export const posts = [
  // 游戏项目（扩展概念：项目展示也是内容）
  {
    id: 1,
    title: '渡维 - 多维空间解谜游戏',
    excerpt: '在多维空间之间穿梭，突破维度的限制。2024 CiGA Game Jam 作品，探索维度转换的创意玩法。',
    type: 'project',
    date: '2024-07-06',
    category: '游戏项目',
    tags: ['CiGA', '维度', '解谜', 'Unity'],
    coverImage: '/images/posts/dimension.jpg',
    readTime: '3 分钟',
    status: 'published',
    links: {
      gmhub: 'https://gmhub.com/game/5421'
    }
  },
  {
    id: 2,
    title: '反物环 - 物理机制生存挑战',
    excerpt: '在反物质环带中生存，利用物理机制解开谜题。48 小时 Solo 开发挑战作品。',
    type: 'project',
    date: '2025-06-29',
    category: '游戏项目',
    tags: ['CiGA', '物理', '解谜', 'Solo'],
    coverImage: '/images/posts/antimatter.jpg',
    readTime: '4 分钟',
    status: 'published',
    links: {
      gmhub: 'https://gmhub.com/game/7868',
      bilibili: 'https://www.bilibili.com/video/BV1HogSz9Eke'
    }
  },
  {
    id: 3,
    title: '声纹 - 声波频率解谜',
    excerpt: '利用声波频率解谜，在声音的轨迹中寻找真相。T-cat 战队聚光灯武汉站作品。',
    type: 'project',
    date: '2025-09-14',
    category: '游戏项目',
    tags: ['聚光灯', '音乐', '解谜', 'T-cat'],
    coverImage: '/images/posts/soundwave.jpg',
    readTime: '4 分钟',
    status: 'published',
    team: 'T-cat',
    links: {}
  },
  
  // 开发日志（扩展概念：开发过程也是内容）
  {
    id: 4,
    title: '反物环开发日志 - Day 1',
    excerpt: '48 小时 Game Jam 的第一天，从概念到原型的快速迭代过程。',
    type: 'devlog',
    date: '2025-06-27',
    category: '开发日志',
    tags: ['CiGA', '开发日志', 'Game Jam'],
    coverImage: '/images/posts/devlog1.jpg',
    readTime: '5 分钟',
    status: 'published'
  },
  {
    id: 5,
    title: '声纹开发日志 - 声音可视化',
    excerpt: '如何实现声音频率的可视化效果，让声波成为游戏的核心机制。',
    type: 'devlog',
    date: '2025-09-10',
    category: '开发日志',
    tags: ['聚光灯', '开发日志', '技术'],
    coverImage: '/images/posts/devlog2.jpg',
    readTime: '6 分钟',
    status: 'published'
  },
  
  // 技术分享
  {
    id: 6,
    title: 'Unity 物理系统优化实践',
    excerpt: '在游戏开发中如何处理复杂的物理交互，以及性能优化的实践经验。',
    type: 'tech',
    date: '2025-10-01',
    category: '技术分享',
    tags: ['Unity', '物理', '优化', '教程'],
    coverImage: '/images/posts/physics.jpg',
    readTime: '10 分钟',
    status: 'published'
  },
  {
    id: 7,
    title: '2D 像素艺术动画技巧',
    excerpt: '从零开始学习像素艺术动画，分享实用的技巧和工具。',
    type: 'tech',
    date: '2025-11-05',
    category: '技术分享',
    tags: ['像素艺术', '动画', '教程'],
    coverImage: '/images/posts/pixel-art.jpg',
    readTime: '8 分钟',
    status: 'published'
  },
  
  // 设计笔记
  {
    id: 8,
    title: '游戏核心循环设计',
    excerpt: '如何设计一个让人上瘾的游戏核心循环？从理论到实践的深度探讨。',
    type: 'design',
    date: '2025-11-15',
    category: '设计笔记',
    tags: ['游戏设计', '核心循环', '理论'],
    coverImage: '/images/posts/core-loop.jpg',
    readTime: '12 分钟',
    status: 'published'
  },
  {
    id: 9,
    title: '关卡设计的节奏感',
    excerpt: '好的关卡设计像一首曲子，有起承转合。探讨如何创造有节奏的游戏体验。',
    type: 'design',
    date: '2025-12-01',
    category: '设计笔记',
    tags: ['关卡设计', '节奏', '体验'],
    coverImage: '/images/posts/level-design.jpg',
    readTime: '9 分钟',
    status: 'published'
  },
  
  // 生活随笔
  {
    id: 10,
    title: '2025 年度游戏开发总结',
    excerpt: '回顾这一年的游戏开发历程，参与过的 Game Jam，学到的经验和教训。',
    type: 'life',
    date: '2025-12-31',
    category: '生活随笔',
    tags: ['年度总结', '反思', '成长'],
    coverImage: '/images/posts/year-review.jpg',
    readTime: '15 分钟',
    status: 'published'
  },
  {
    id: 11,
    title: '独立开发者的时间管理',
    excerpt: '如何平衡工作、生活和游戏开发？分享我的时间管理方法。',
    type: 'life',
    date: '2026-01-15',
    category: '生活随笔',
    tags: ['时间管理', '独立开发', '效率'],
    coverImage: '/images/posts/time-management.jpg',
    readTime: '7 分钟',
    status: 'published'
  },
  
  // 进行中项目
  {
    id: 12,
    title: 'Cheat - 商业项目幕后',
    excerpt: '与大隆盛工作室合作的商业项目，从独立开发到商业化的转变。',
    type: 'project',
    date: '2026-03-05',
    category: '游戏项目',
    tags: ['商业', '开发中', '大隆盛工作室'],
    coverImage: '/images/posts/cheat.jpg',
    readTime: '5 分钟',
    status: 'published'
  },
  {
    id: 13,
    title: '球状围棋 - 创新围棋变体',
    excerpt: '在球面上进行对弈，带来全新的空间策略体验。个人实验项目。',
    type: 'project',
    date: '2026-03-05',
    category: '游戏项目',
    tags: ['围棋', '策略', '实验'],
    coverImage: '/images/posts/sphere-go.jpg',
    readTime: '4 分钟',
    status: 'published'
  },
]

export const categories = [
  { id: 'all', name: '全部', count: 13 },
  { id: '游戏项目', name: '游戏项目', count: 5 },
  { id: '开发日志', name: '开发日志', count: 2 },
  { id: '技术分享', name: '技术分享', count: 2 },
  { id: '设计笔记', name: '设计笔记', count: 2 },
  { id: '生活随笔', name: '生活随笔', count: 2 },
]

export const types = [
  { id: 'all', name: '全部类型' },
  { id: 'project', name: '游戏项目' },
  { id: 'devlog', name: '开发日志' },
  { id: 'tech', name: '技术分享' },
  { id: 'design', name: '设计笔记' },
  { id: 'life', name: '生活随笔' },
]

export const tags = [
  'CiGA', '聚光灯', 'Unity', '物理', '解谜', 'Solo',
  '游戏设计', '优化', '教程', '年度总结', '商业',
  '开发日志', '像素艺术', '动画', '关卡设计', '时间管理'
]
