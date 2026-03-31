# 汤圆的小窝 - 网站架构总览

**项目根目录**: `/root/tangyuan-games/`  
**前端框架**: React 18.3 + Vite 6.0  
**后端框架**: Express (Node.js)  
**路由**: React Router DOM (Hash 模式)  
**样式**: 纯 CSS (黑白漫画风格统一)

---

## 📁 完整项目结构

```
tangyuan-games/
├── 📄 配置文件
│   ├── package.json          # 项目依赖 + 脚本
│   ├── vite.config.js        # Vite 构建配置
│   └── .env                  # 环境变量 (端口/密钥)
│
├── 📦 前端源码 (src/)
│   ├── App.jsx               # ⭐ 主入口 + 路由配置
│   ├── App.css               # 全局样式
│   │
│   ├── 📄 页面组件 (pages/)   # 20 个页面
│   │   ├── NewspaperHome.jsx     # 🏠 首页 (报纸风格)
│   │   ├── GamesCollection.jsx   # 🎮 游戏宇宙展示
│   │   ├── BlogPage.jsx          # 📝 博客列表
│   │   ├── PostDetail.jsx        # 📄 文章详情
│   │   ├── PomodoroTodo.jsx      # 🍅 番茄钟待办 (v8.2)
│   │   ├── Profile.jsx           # 👤 个人中心
│   │   ├── Login.jsx             # 🔑 登录
│   │   ├── Register.jsx          # 📝 注册
│   │   ├── ForgotPassword.jsx    # 🔐 忘记密码
│   │   ├── AboutPage.jsx         # ℹ️ 关于页面
│   │   ├── SpecialConstructs.jsx # 🔧 特殊构造
│   │   ├── GamesPage.jsx         # 🎯 游戏页面
│   │   ├── Snake.jsx             # 🐍 贪吃蛇
│   │   ├── Tetris.jsx            # 🧱 俄罗斯方块
│   │   ├── Pacman.jsx            # 👻 吃豆人
│   │   ├── FlyBird.jsx           # 🐦 飞鸟
│   │   ├── Dinosaur.jsx          # 🦕 恐龙
│   │   ├── Minesweeper.jsx       # 💣 扫雷
│   │   ├── AdminLogin.jsx        # 🔐 后台登录
│   │   ├── AdminDashboard.jsx    # 📊 后台管理
│   │   ├── ArticleEditor.jsx     # ✍️ 文章编辑器
│   │   └── IntroPage.jsx         # 🎬 Intro 动画页
│   │
│   ├── 🧩 通用组件 (components/)
│   │   ├── Header.jsx            # ⭐ 顶部导航栏
│   │   ├── Footer.jsx            # ⭐ 页脚
│   │   ├── PostCard.jsx          # 文章卡片
│   │   ├── PostList.jsx          # 文章列表
│   │   ├── GameCard.jsx          # 游戏卡片
│   │   ├── GameShowcase.jsx      # 游戏展示
│   │   ├── Hero.jsx              # Hero 区域
│   │   ├── About.jsx             # 关于组件
│   │   ├── Intro.jsx             # Intro 动画
│   │   ├── CursorEffect.jsx      # ✨ 自定义光标效果
│   │   ├── ScanLines.jsx         # 扫描线效果 (已禁用)
│   │   ├── BootSequence.jsx      # 启动序列
│   │   │
│   │   ├── 📊 排行榜组件
│   │   │   ├── Leaderboard.jsx       # 排行榜主组件
│   │   │   ├── LeaderboardInline.jsx # 内联排行榜
│   │   │   └── LeaderboardSidebar.jsx# 侧边排行榜
│   │   │
│   │   └── 🗂️ 后台管理组件 (admin/)
│   │       ├── ArticleList.jsx       # 文章列表
│   │       ├── UserList.jsx          # 用户列表
│   │       └── Settings.jsx          # 设置
│   │
│   ├── 🎨 样式文件 (styles/)      # 27 个 CSS 文件
│   │   ├── 📖 通用样式库
│   │   │   ├── manga-common.css    # ⭐ 漫画风格通用 (664 行)
│   │   │   ├── game-common.css     # ⭐ 游戏页面通用 (350 行)
│   │   │   └── responsive.css      # ⭐ 全局响应式
│   │   │
│   │   ├── 📄 页面样式 (已统一漫画风格)
│   │   │   ├── NewspaperHome.css   # 首页 (180 行)
│   │   │   ├── GamesCollection.css # 游戏宇宙 (340 行)
│   │   │   ├── MangaBlog.css       # 博客 (884 行)
│   │   │   ├── MangaGames.css      # 游戏大厅 (723 行)
│   │   │   ├── Snake.css           # 贪吃蛇 (330 行)
│   │   │   ├── Tetris.css          # 俄罗斯方块 (722 行)
│   │   │   ├── Pacman.css          # 吃豆人 (626 行)
│   │   │   ├── FlyBird.css         # 飞鸟 (627 行)
│   │   │   ├── Dinosaur.css        # 恐龙 (690 行)
│   │   │   ├── Minesweeper.css     # 扫雷 (641 行)
│   │   │   ├── Profile.css         # 个人中心 (828 行)
│   │   │   ├── auth.css            # 登录注册 (785 行)
│   │   │   ├── AdminDashboard.css  # 后台管理 (1127 行)
│   │   │   └── pomodoro.css        # 番茄钟 (2897 行)
│   │   │
│   │   └── 🔧 组件样式
│   │       ├── header.css          # 导航栏
│   │       ├── cursor.css          # 光标效果
│   │       ├── intro.css           # Intro 动画
│   │       ├── special.css         # 特殊构造
│   │       └── home.css            # 首页旧样式
│   │
│   └── 📂 数据 (data/)
│       └── leaderboards.json       # 排行榜数据
│
├── 🖥️ 后端服务 (server/)
│   ├── index.js                # ⭐ Express 主服务 (32KB)
│   ├── package.json            # 后端依赖
│   │
│   └── 📦 服务模块 (services/)
│       ├── emailService.js     # 📧 邮件服务 (验证码/重置密码)
│       └── leaderboardService.js # 📊 排行榜服务
│
├── 🌐 入口文件
│   ├── index.html              # HTML 入口
│   └── main.jsx                # React 挂载点
│
├── 📊 构建输出 (dist/)          # npm run build 生成
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css         # 合并后的 CSS (~242KB)
│   │   └── index-*.js          # 合并后的 JS (~341KB)
│   └── uploads/                # 上传文件
│
└── 📚 文档
    ├── DEVELOPER.md            # ⭐ 开发者文档
    ├── CSS_CLEANUP_REPORT.md   # CSS 清理报告
    ├── CSS_CLEANUP_PROGRESS.md # 清理进度
    └── RESPONSIVE_FIX_REPORT.md# 响应式修复报告
```

---

## 🗺️ 路由架构

### 前台路由 (Hash 模式)

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `NewspaperHome` | 🏠 首页 (报纸风格) |
| `/games` | `GamesCollection` | 🎮 游戏宇宙展示 |
| `/blog` | `BlogPage` | 📝 博客列表 |
| `/post/:id` | `PostDetail` | 📄 文章详情 |
| `/about` | `AboutPage` | ℹ️ 关于页面 |
| `/login` | `Login` | 🔑 用户登录 |
| `/register` | `Register` | 📝 用户注册 |
| `/profile` | `Profile` | 👤 个人中心 |
| `/forgot-password` | `ForgotPassword` | 🔐 忘记密码 |
| `/special` | `SpecialConstructs` | 🔧 特殊构造 |
| `/special/minigames` | `GamesPage` | 🎯 休闲游戏 |
| `/special/snake` | `Snake` | 🐍 贪吃蛇 |
| `/special/pomodoro` | `PomodoroTodo` | 🍅 番茄钟待办 |
| `/special/intro` | `IntroPage` | 🎬 Intro 动画 |

### 后台路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/admin/login` | `AdminLogin` | 🔐 后台登录 |
| `/admin` | `AdminDashboard` | 📊 后台首页 |
| `/admin/dashboard` | `AdminDashboard` | 📊 后台管理 |
| `/admin/article/new` | `ArticleEditor` | ✍️ 新建文章 |
| `/admin/article/edit/:id` | `ArticleEditor` | ✏️ 编辑文章 |

---

## 🎨 样式架构

### 设计系统：黑白漫画风格 (v3.0)

**统一视觉元素**:
- 背景：白色 + 漫画网点 (`radial-gradient`)
- 主色：纯黑 `#1a1a1a`
- 辅色：浅灰 `#f0f0f0` / 中灰 `#444444`
- 阴影：硬阴影 (无模糊) `box-shadow: 8px 8px 0 #1a1a1a`
- 字体：`Georgia` (衬线) + `Courier New` (等宽)
- 风格：硬朗线条 + 强烈阴影 + 漫画分镜感

### CSS 复用规范

```css
/* 1. 文件开头导入通用样式 */
@import './manga-common.css';
/* 或 */
@import './game-common.css';

/* 2. 只定义页面特定样式 */
.manga-page-specific {
  /* ... */
}
```

**通用样式库**:
- `manga-common.css` (664 行) - 漫画风格通用样式
  - 网点背景、报头、环形钟、统计卡片、卡片悬停、角落装饰
- `game-common.css` (350 行) - 游戏页面通用样式
  - 游戏布局、侧边栏、信息面板、控制按钮、游戏结束覆盖层
- `responsive.css` - 全局响应式样式
  - 通用断点、容器宽度、网格系统、工具类

---

## 🖥️ 后端架构

### Express 主服务 (`server/index.js`)

**核心功能**:
- 📧 邮件发送 (nodemailer)
- 👤 用户认证 (注册/登录/重置密码)
- 📝 文章管理 (CRUD)
- 📊 排行榜数据
- 📁 文件上传

### 服务模块

| 文件 | 功能 | 说明 |
|------|------|------|
| `emailService.js` | 邮件服务 | 验证码、密码重置 |
| `leaderboardService.js` | 排行榜服务 | 分数记录、排名查询 |

---

## 🧩 核心组件说明

### 1. Header.jsx (导航栏)
- 响应式导航菜单
- 用户状态显示
- 移动端汉堡菜单
- 黑白漫画风格

### 2. CursorEffect.jsx (自定义光标)
- 点 + 圈双层跟随
- 点击粒子效果
- 悬停/拖拽状态变化
- 全局注入

### 3. Leaderboard 系列 (排行榜)
- `Leaderboard.jsx` - 主组件
- `LeaderboardInline.jsx` - 内联版本
- `LeaderboardSidebar.jsx` - 侧边栏版本

### 4. PostCard / PostList (博客)
- 文章卡片展示
- 漫画风格卡片
- 列表网格布局

### 5. GameCard (游戏卡片)
- 游戏封面展示
- 悬停效果
- 漫画风格统一

---

## 🍅 核心功能模块

### 番茄钟待办 (v8.2)
**文件**: `PomodoroTodo.jsx` + `pomodoro.css` (2897 行)

**功能**:
- ✅ 专注计时器 (数字/圆形)
- ✅ 待办清单 (优先级/重复/配置)
- ✅ 时间轴规划 (拖拽/调整/预设)
- ✅ 习惯打卡 (手动/自动)
- ✅ 数据统计 (柱状/折线/详情)
- ✅ 排行榜系统

### 博客系统 (v3.0)
**文件**: `BlogPage.jsx` + `PostDetail.jsx` + `MangaBlog.css`

**功能**:
- ✅ 文章列表 (卡片式)
- ✅ 文章详情 (Markdown 渲染)
- ✅ 分类筛选
- ✅ 标签系统
- ✅ 响应式布局

### 游戏中心
**6 个游戏页面** (已统一漫画风格):
- 贪吃蛇、俄罗斯方块、吃豆人、飞鸟、恐龙、扫雷

### 用户系统 (v1.0)
- ✅ 注册/登录
- ✅ 个人中心
- ✅ 密码重置
- ✅ 邮件验证

### 后台管理 (v2.0)
- ✅ 文章管理 (CRUD)
- ✅ 用户管理
- ✅ 数据统计
- ✅ 系统设置

---

## 🛠️ 开发工具链

### 构建工具
- **Vite 6.0** - 前端构建
- **React 18.3** - UI 框架
- **React Router DOM** - 路由管理

### 开发脚本
```bash
# 开发模式 (仅前端)
npm run dev

# 开发模式 (前端 + 后端)
npm run dev:all

# 仅后端
npm run server

# 生产构建
npm run build

# 预览构建
npm run preview
```

### PM2 进程管理
```bash
# 前端服务
pm2 start npm --name "tangyuan-frontend" -- run dev

# 后端服务
pm2 start server/index.js --name "tangyuan-server"
```

---

## 📊 代码统计

### 前端代码
- **页面组件**: 20 个
- **通用组件**: 15+ 个
- **CSS 文件**: 27 个 (约 16,000 行)
- **总代码量**: ~50KB (JSX) + ~500KB (CSS)

### 后端代码
- **主服务**: 32KB
- **服务模块**: 11KB
- **总代码量**: ~43KB

### 样式优化成果 (2026-03-31)
- 创建通用样式库：1,014 行
- 精简重复代码：约 700+ 行
- 全站风格统一：100% 覆盖

---

## 🌐 部署架构

### 服务器信息
- **IP**: `36.151.149.117`
- **前端端口**: `3000`
- **后端端口**: `3001`
- **域名**: `ovo-ovo.cn`
- **SSL**: Let's Encrypt

### 服务状态
```bash
# PM2 管理
pm2 list
# - tangyuan-frontend (端口 3000)
# - tangyuan-server (端口 3001)
```

---

## 📝 开发规范

### 开发流程
1. **开发前**: 读 `DEVELOPER.md` → 确认模块 → 检查通用样式
2. **开发中**: 遵循规范 → 统一风格 → 避免重复
3. **开发后**: 更新文档 → 清理旧代码 → 编译测试 → 提交推送

### 文档更新检查清单
- [ ] 项目结构 (新增/删除文件)
- [ ] 模块版本状态
- [ ] CSS 文件行数/精简比例
- [ ] 待开发功能列表
- [ ] CSS 清理记录

### 代码清理检查清单
- [ ] 删除 `.backup` / `.backup2` 文件
- [ ] 删除废弃组件
- [ ] 删除未使用的样式
- [ ] 清理临时文件

---

**最后更新**: 2026-03-31  
**维护者**: AI Assistant  
**文档版本**: v3.0
