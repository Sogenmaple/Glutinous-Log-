export const posts = [
  {
    id: 1,
    title: '渡维 - CiGA Game Jam 2024 开发日志',
    excerpt: '在多维空间之间穿梭，突破维度的限制。这是我们在 2024 年 CiGA Game Jam 的 48 小时开发经历。',
    content: '完整文章内容...',
    date: '2024-07-06',
    category: 'Game Jam',
    tags: ['CiGA', '维度', '解谜', '开发日志'],
    coverImage: '/images/posts/dimension.jpg',
    readTime: '5 分钟',
    status: 'published'
  },
  {
    id: 2,
    title: '反物环 - 48 小时 Solo 挑战',
    excerpt: '在反物质环带中生存，利用物理机制解开谜题。这是我第一次独自完成 Game Jam 作品。',
    content: '完整文章内容...',
    date: '2025-06-29',
    category: 'Game Jam',
    tags: ['CiGA', '物理', '解谜', 'Solo'],
    coverImage: '/images/posts/antimatter.jpg',
    readTime: '8 分钟',
    status: 'published'
  },
  {
    id: 3,
    title: '声纹 - 聚光灯武汉站 T-cat 战队复盘',
    excerpt: '利用声波频率解谜，在声音的轨迹中寻找真相。T-cat 战队的合作开发经历。',
    content: '完整文章内容...',
    date: '2025-09-14',
    category: 'Game Jam',
    tags: ['聚光灯', '音乐', '解谜', 'T-cat'],
    coverImage: '/images/posts/soundwave.jpg',
    readTime: '6 分钟',
    status: 'published',
    team: 'T-cat'
  },
  {
    id: 4,
    title: '技术分享：Unity 中的物理系统优化',
    excerpt: '在游戏开发中如何处理复杂的物理交互，以及性能优化的实践经验。',
    content: '完整文章内容...',
    date: '2025-10-01',
    category: '技术',
    tags: ['Unity', '物理', '优化', '教程'],
    coverImage: '/images/posts/physics.jpg',
    readTime: '10 分钟',
    status: 'published'
  },
  {
    id: 5,
    title: '游戏设计笔记：核心循环的构建',
    excerpt: '如何设计一个让人上瘾的游戏核心循环？从理论到实践的深度探讨。',
    content: '完整文章内容...',
    date: '2025-11-15',
    category: '设计',
    tags: ['游戏设计', '核心循环', '理论'],
    coverImage: '/images/posts/core-loop.jpg',
    readTime: '12 分钟',
    status: 'published'
  },
  {
    id: 6,
    title: '2025 年度游戏开发总结',
    excerpt: '回顾这一年的游戏开发历程，参与过的 Game Jam，学到的经验和教训。',
    content: '完整文章内容...',
    date: '2025-12-31',
    category: '生活',
    tags: ['年度总结', '反思', '成长'],
    coverImage: '/images/posts/year-review.jpg',
    readTime: '15 分钟',
    status: 'published'
  },
  {
    id: 7,
    title: 'Cheat 项目幕后：商业游戏开发初探',
    excerpt: '与大隆盛工作室合作的商业项目，从独立开发到商业化的转变。',
    content: '完整文章内容...',
    date: '2026-03-05',
    category: '项目',
    tags: ['商业', '开发中', '大隆盛工作室'],
    coverImage: '/images/posts/cheat.jpg',
    readTime: '7 分钟',
    status: 'draft'
  },
]

export const categories = [
  { id: 'all', name: '全部', count: 7 },
  { id: 'Game Jam', name: 'Game Jam', count: 3 },
  { id: '技术', name: '技术', count: 1 },
  { id: '设计', name: '设计', count: 1 },
  { id: '生活', name: '生活', count: 1 },
  { id: '项目', name: '项目', count: 1 },
]

export const tags = [
  'CiGA', '聚光灯', 'Unity', '物理', '解谜', 'Solo',
  '游戏设计', '优化', '教程', '年度总结', '商业'
]
