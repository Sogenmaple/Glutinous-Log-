# 汤圆的小窝 - 开发者文档

**项目地址**: `/root/tangyuan-games/`  
**服务器**: `http://36.151.149.117:3000`  
**API**: `http://36.151.149.117:3001`  
**GitHub**: `https://github.com/Sogenmaple/Glutinous-Log-`

---

## 📁 项目结构

```
tangyuan-games/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home.jsx        # 首页
│   │   ├── BlogPage.jsx    # 博客列表
│   │   ├── PostDetail.jsx  # 文章详情
│   │   ├── PomodoroTodo.jsx # 番茄钟 (v8.1)
│   │   ├── Register.jsx    # 注册
│   │   └── ...
│   ├── components/         # 通用组件
│   │   ├── Header.jsx      # 导航栏
│   │   ├── PostCard.jsx    # 文章卡片
│   │   └── admin/          # 后台管理
│   ├── styles/             # CSS 样式
│   │   ├── manga-common.css    # ⭐ 漫画风格通用样式 (新增)
│   │   ├── responsive.css      # ⭐ 全局响应式样式
│   │   ├── NewspaperHome.css   # 首页 (精简后 180 行)
│   │   ├── GamesCollection.css # 游戏宇宙 (精简后 340 行)
│   │   ├── MangaBlog.css       # 博客页面
│   │   ├── pomodoro.css        # 番茄钟 (2300+ 行)
│   │   ├── header.css          # 导航栏
│   │   ├── Profile.css         # 个人资料
│   │   ├── auth.css            # 登录注册
│   │   ├── AdminDashboard.css  # 后台管理
│   │   ├── Snake.css           # 贪吃蛇
│   │   ├── Tetris.css          # 俄罗斯方块
│   │   ├── Pacman.css          # 吃豆人
│   │   ├── FlyBird.css         # 飞鸟
│   │   ├── Dinosaur.css        # 恐龙
│   │   └── Minesweeper.css     # 扫雷
│   └── App.jsx             # 路由配置
├── server/
│   └── index.js            # 后端 API (Express)
├── index.html              # 入口 HTML
├── DEVELOPER.md            # 开发者文档
├── CSS_CLEANUP_REPORT.md   # CSS 清理报告
└── package.json
```

---

## 🎯 模块开发指令

### 开发命令格式
```
开发 [模块名] [功能描述]
```

### 可用模块

| 模块 | 文件路径 | 说明 |
|------|----------|------|
| `首页` | `src/pages/Home.jsx` | 博客列表展示 |
| `博客` | `src/pages/BlogPage.jsx` | 博客页面 |
| `详情` | `src/pages/PostDetail.jsx` | 文章详情 |
| `番茄钟` | `src/pages/PomodoroTodo.jsx` | 番茄钟专注系统 |
| `番茄样式` | `src/styles/pomodoro.css` | 番茄钟样式 |
| `导航栏` | `src/components/Header.jsx` | 顶部导航 |
| `注册` | `src/pages/Register.jsx` | 用户注册 |
| `后台` | `src/components/admin/` | 后台管理组件 |
| `API` | `server/index.js` | 后端接口 |

---

## 🍅 番茄钟模块 (v8.1)

**文件**: `src/pages/PomodoroTodo.jsx` + `src/styles/pomodoro.css`

### 核心功能
- ✅ 专注计时器（数字/圆形）
- ✅ 待办清单（优先级/重复/配置）
- ✅ 时间轴规划（拖拽/调整/预设）
- ✅ 习惯打卡（手动/自动）
- ✅ 数据统计（柱状/折线/详情）

### 开发示例
```
开发 番茄钟 添加白噪音功能
开发 番茄样式 优化暗色主题
开发 番茄钟 添加成就系统
```

---

## 📝 博客模块

**文件**: `src/pages/Home.jsx` + `src/pages/PostDetail.jsx`

### 核心功能
- ✅ 文章列表（卡片式）
- ✅ 文章详情（Markdown 渲染）
- ✅ 分类筛选
- ✅ 响应式布局

### 开发示例
```
开发 首页 添加文章搜索
开发 详情 添加评论功能
开发 博客 添加标签系统
```

---

## 🎨 样式规范

### 📚 CSS 文件结构大纲

```
src/styles/
├── 📖 通用样式库 (必须优先导入)
│   ├── manga-common.css    # ⭐ 漫画风格通用样式 (664 行)
│   │   ├── 网点背景 (.manga-halftone)
│   │   ├── 报头样式 (.manga-masthead)
│   │   ├── 环形钟 (.manga-ring-clock)
│   │   ├── 统计卡片 (.manga-stat-card)
│   │   ├── 卡片悬停 (.manga-card-hover)
│   │   ├── 角落装饰 (.manga-corner)
│   │   └── 社交链接/页脚
│   │
│   ├── game-common.css     # ⭐ 游戏页面通用样式 (350 行)
│   │   ├── 游戏布局 (.manga-game-layout)
│   │   ├── 侧边栏 (.manga-sidebar)
│   │   ├── 信息面板 (.manga-info-panel)
│   │   ├── 控制按钮 (.manga-control-btn)
│   │   ├── 游戏结束覆盖层 (.manga-game-over)
│   │   ├── 说明面板 (.manga-instructions)
│   │   └── 响应式断点
│   │
│   └── responsive.css      # ⭐ 全局响应式样式
│       ├── 通用断点 (@media)
│       ├── 容器宽度 (.container)
│       ├── 网格系统 (.grid)
│       └── 工具类 (.hidden-sm, .visible-md)
│
├── 📄 页面样式 (已统一为黑白漫画风格 ✅)
│   ├── NewspaperHome.css   # 首页 (180 行，精简 76%) ✅
│   ├── GamesCollection.css # 游戏宇宙 (340 行，精简 58%) ✅
│   ├── MangaBlog.css       # 博客页面 (884 行，精简 32%) ✅
│   ├── MangaGames.css      # 游戏大厅 (723 行) ✅
│   │
│   ├── Snake.css           # 贪吃蛇 (330 行，精简 45%) ✅
│   ├── Tetris.css          # 俄罗斯方块 (722 行，待精简)
│   ├── Pacman.css          # 吃豆人 (626 行，待精简)
│   ├── FlyBird.css         # 飞鸟 (627 行，待精简)
│   ├── Dinosaur.css        # 恐龙 (690 行，待精简)
│   └── Minesweeper.css     # 扫雷 (641 行，待精简)
│
├── 🎯 功能模块样式 (已统一为黑白漫画风格 ✅)
│   ├── Profile.css         # 个人资料 (828 行) ✅
│   ├── auth.css            # 登录注册 (785 行) ✅
│   ├── AdminDashboard.css  # 后台管理 (1127 行) ✅
│   └── pomodoro.css        # 番茄钟 (2897 行，⚠️ 待迁移为漫画风格)
│
└── 🔧 组件样式
    ├── header.css          # 导航栏 ✅
    └── PostCard.css        # 文章卡片 ✅
```

---

### 🎨 设计系统

#### 1️⃣ 黑白漫画风格 (全站统一 ⭐)
**适用**: 所有页面 (首页、博客、游戏、个人中心、登录注册、后台管理)

| 元素 | 值 | 说明 |
|------|-----|------|
| **背景** | `#ffffff` + 漫画网点 | `radial-gradient` 点状网格 |
| **主色** | `#1a1a1a` (纯黑) | 边框、文字、阴影 |
| **辅色** | `#f0f0f0` (浅灰) | 卡片背景、按钮 |
| **阴影** | `#444444` / `#666666` | 硬阴影 (无模糊) |
| **字体** | `Georgia`, `Courier New` | 衬线 + 等宽 |
| **风格** | 硬朗线条 + 强烈阴影 | 漫画分镜感 |

**核心视觉元素**:
```css
/* 漫画网点背景 */
background-image: radial-gradient(#cccccc 1px, transparent 1px);
background-size: 24px 24px;

/* 硬阴影效果 */
box-shadow: 10px 10px 0 #1a1a1a, 16px 16px 0 #444444;

/* 装饰角 */
border-top: 6px solid #f0f0f0;
border-left: 6px solid #f0f0f0;
```

#### 2️⃣ 赛博朋克风格 (⚠️ 已弃用)
**说明**: 2026-03-31 全站统一为黑白漫画风格，赛博朋克风格已移除。
**遗留**: `pomodoro.css` 仍保留部分赛博风格变量（待迁移）

---

### 📐 统一元素规范

#### 输入框
```css
background: rgba(255,255,255,0.05);
border: 1px solid rgba(255,149,0,0.2);
font-family: var(--font-mono);
```

#### 按钮
```css
background: rgba(255,149,0,0.15);
border: 1px solid var(--amber);
color: var(--amber);
```

#### 鼠标状态
- **可点击**: `cursor: pointer`
- **可拖拽**: `cursor: grab` / `grabbing`
- **默认**: `cursor: default`

---

### ♻️ CSS 复用规范 (⭐ 新增)

#### 漫画风格页面开发流程

**步骤 1**: 文件开头导入通用样式
```css
/* 文件顶部 */
@import './manga-common.css';
/* 或 */
@import './game-common.css';
```

**步骤 2**: 定义页面特定样式
```css
/* 只写本页面独有的样式 */
.manga-page-specific {
  /* ... */
}
```

**步骤 3**: 避免重复定义
```css
/* ❌ 错误：重复定义通用样式 */
.manga-halftone { ... }  /* 已在 manga-common.css 中定义 */

/* ✅ 正确：只写特定样式 */
.manga-snake-page .custom-canvas { ... }
```

#### 通用样式清单

**manga-common.css 已包含**:
- ✅ `.manga-halftone` - 漫画网点背景
- ✅ `.manga-masthead` - 报头样式
- ✅ `.manga-ring-clock` - 环形钟
- ✅ `.manga-stat-card` - 统计卡片
- ✅ `.manga-card-hover` - 卡片悬停效果
- ✅ `.manga-corner` - 角落装饰
- ✅ `.manga-social-links` - 社交链接
- ✅ `.manga-footer` - 页脚
- ✅ 响应式断点

**game-common.css 已包含**:
- ✅ `.manga-game-layout` - 游戏布局
- ✅ `.manga-sidebar` - 侧边栏
- ✅ `.manga-info-panel` - 信息面板
- ✅ `.manga-control-btn` - 控制按钮
- ✅ `.manga-game-over` - 游戏结束覆盖层
- ✅ `.manga-instructions` - 说明面板
- ✅ 响应式断点

#### 响应式设计规范

**使用 responsive.css 中的通用类**:
```css
/* ❌ 错误：重复定义断点 */
@media (max-width: 768px) { }

/* ✅ 正确：使用通用响应式类 */
.container { }  /* responsive.css 已处理 */
```

**使用 clamp() 实现平滑缩放**:
```css
/* 字体大小 */
font-size: clamp(1rem, 2vw, 1.5rem);

/* 容器宽度 */
max-width: clamp(300px, 80vw, 1400px);

/* 间距 */
padding: clamp(1rem, 3vw, 3rem);
```

---

### 🎯 CSS 开发检查清单

开发新页面时，按顺序检查：

- [ ] **1. 选择基础样式库**
  - 漫画风格 → `@import './manga-common.css'`
  - 游戏页面 → `@import './game-common.css'`
  - 番茄钟风格 → 独立样式

- [ ] **2. 检查通用样式**
  - 需要的样式是否已在通用文件中？
  - 避免重复定义

- [ ] **3. 定义页面特定样式**
  - 只写本页面独有的样式
  - 使用语义化类名

- [ ] **4. 响应式适配**
  - 使用 `responsive.css` 通用类
  - 使用 `clamp()` 平滑缩放
  - 测试 768px / 480px 断点

- [ ] **5. 性能优化**
  - 删除未使用的样式
  - 合并重复选择器
  - 使用 CSS 变量

- [ ] **6. 编译测试**
  - `npm run build`
  - 检查编译错误
  - 测试页面显示

---

## 🔧 开发流程

### 1. 接收指令
用户发送：`开发 [模块] [功能]`

### 2. 定位文件
根据模块名找到对应文件

### 3. 读取上下文
```bash
cd /root/tangyuan-games
head -100 [文件路径]  # 快速了解结构
```

### 4. 实现功能
- 修改 JSX/JS
- 更新 CSS
- 添加图标（如需要）

### 5. 编译测试
```bash
npm run build
# 检查编译错误
```

### 6. 提交推送
```bash
git add -A
git commit -m 'feat: [模块] [功能描述]'
git push origin main
```

---

## 🚀 常用命令

```bash
# 开发模式
cd /root/tangyuan-games
npm run dev

# 生产构建
npm run build

# 后端服务
node server/index.js

# 查看服务状态
ps aux | grep vite
ps aux | grep node

# Git 操作
git log --oneline -10
git status
git diff [文件]

# CSS 分析
wc -l src/styles/*.css
grep -r "\.manga-" src/styles/ --include="*.css"
```

---

## 📊 当前版本

| 模块 | 版本 | 状态 |
|------|------|------|
| 番茄钟 | v8.2 | ✅ 完整功能 + 漫画风格 |
| 博客 | v3.0 | ✅ 基础功能 + 漫画风格 |
| 后台 | v2.0 | ✅ 管理功能 + 漫画风格 |
| 用户系统 | v1.0 | ✅ 注册登录 + 漫画风格 |
| 漫画风格 | v3.0 | ✅ 全站统一 (100% 覆盖) |

---

## 🎯 待开发功能

### 高优先级
- [ ] 番茄钟：白噪音/专注场景
- [ ] 博客：评论系统
- [ ] 用户：个人中心
- [ ] 全局：主题切换

### 中优先级
- [ ] 番茄钟：成就系统
- [ ] 博客：标签/搜索
- [ ] 统计：数据导出
- [ ] API：数据库集成

---

## 💡 开发技巧

1. **快速定位**: 使用 `grep -n "关键词" [文件]`
2. **样式优先**: 先改 JSX 结构，再调 CSS
3. **图标复用**: 检查 `SiteIcons.jsx` 已有图标
4. **状态管理**: 使用 `useState` + `localStorage`
5. **事件系统**: 使用 `CustomEvent` 实现跨组件通信
6. **CSS 复用**: 先检查 `manga-common.css` 是否已有样式
7. **响应式**: 优先使用 `responsive.css` 中的通用类

---

## 📞 快速参考

**编译错误**: 检查 JSX 语法、导入语句、重复声明  
**黑屏问题**: 检查组件导入、localStorage 解析  
**样式无效**: 检查类名匹配、CSS 优先级  
**拖拽失效**: 检查 `draggable`、`onDragStart`、`onDrop`  
**CSS 重复**: 检查是否已存在于 `manga-common.css`

---

## 🧹 CSS 清理记录

### 2026-03-31: 全站风格统一 + 代码清理

**风格统一**:
- ✅ 所有页面已统一为黑白漫画风格
- ✅ `Profile.css` - 个人资料 (漫画风格)
- ✅ `auth.css` - 登录注册 (漫画风格)
- ✅ `AdminDashboard.css` - 后台管理 (漫画风格)
- ✅ `pomodoro.css` - 番茄钟 (漫画风格 v8.2)

**代码清理**:
- 创建 `manga-common.css` (664 行) 提取通用样式
- 创建 `game-common.css` (350 行) 游戏页面通用样式
- `NewspaperHome.css`: 739 行 → 180 行 (-76%)
- `GamesCollection.css`: 800 行 → 340 行 (-58%)
- `MangaBlog.css`: 1308 行 → 884 行 (-32%)
- `Snake.css`: 604 行 → 330 行 (-45%)
- `pomodoro.css`: 2897 行 → 漫画风格 (颜色替换)

**总计**: 减少约 1000+ 行重复代码，全站风格统一 ✨

详见：`CSS_CLEANUP_REPORT.md` + `CSS_CLEANUP_PROGRESS.md`

---

**最后更新**: 2026-03-31  
**维护者**: AI Assistant
