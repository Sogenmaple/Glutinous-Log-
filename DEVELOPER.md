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
| `首页` | `src/pages/Home.jsx` | 桌面卡片风格首页 (v6.0) |
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

### 📋 完整开发流程 (必须遵守)

#### 1️⃣ 开发前
**接收指令** → 用户发送：`开发 [模块] [功能]`

**定位文件** → 根据模块名找到对应文件

**读取文档** → 不清楚的地方先读 `DEVELOPER.md`

**检查通用样式** → CSS 修改前检查 `manga-common.css` / `game-common.css`

#### 2️⃣ 开发中
**实现功能**:
- 修改 JSX/JS
- 更新 CSS (遵循复用规范)
- 添加图标（如需要）

**遵循规范**:
- 所有页面使用黑白漫画风格
- 优先复用通用样式
- 不重复定义已有样式

#### 3️⃣ 开发后 (⚠️ 必须执行)
**编译测试**:
```bash
npm run build
# 检查编译错误
```

**更新文档** (⚠️ 必须):
- 更新 `DEVELOPER.md` 对应章节
- 记录 CSS 行数变化
- 更新版本状态表
- 添加清理记录

**清理旧代码** (⚠️ 必须):
```bash
# 删除备份文件 (确认新代码无误后)
rm src/styles/*.backup
rm src/styles/*.backup2

# 删除废弃组件
rm src/components/废弃组件.jsx

# 清理临时文件
```

**提交推送**:
```bash
git add -A
git commit -m 'feat|style|docs: [模块] [功能描述]'
git push origin main
```

---

### 📝 文档更新检查清单

每次网站更改后，**必须**检查 `DEVELOPER.md` 是否需要更新：

- [ ] **项目结构** — 新增/删除文件时更新
- [ ] **模块版本状态** — 功能更新时修改版本号
- [ ] **CSS 文件统计** — 记录行数/精简比例
- [ ] **待开发功能** — 完成的功能移到"已完成"
- [ ] **CSS 清理记录** — 添加本次清理详情

### 🧹 代码清理检查清单

每次开发后，**必须**检查是否需要清理：

- [ ] 删除 `.backup` 备份文件 (确认新代码无误后)
- [ ] 删除废弃的组件/页面
- [ ] 删除未使用的样式文件
- [ ] 清理临时文件/测试文件
- [ ] 清理注释中的过时信息

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
| 首页 | v7.0 | ✅ 模拟电脑桌面（窗口系统+任务栏） |
| 番茄钟 | v8.2 | ✅ 完整功能 + 漫画风格 |
| 博客 | v3.0 | ✅ 基础功能 + 漫画风格 |
| 后台 | v2.0 | ✅ 管理功能 + 漫画风格 |
| 用户系统 | v1.0 | ✅ 注册登录 + 漫画风格 |
| 作品集 | v2.0 | ✅ 统一风格化排版 |
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

### 2026-03-31: 备份文件清理
- 删除 7 个 `.backup` 文件 (确认新代码无误)
- 保留报告文件作为历史记录

### 2026-03-31: 多端适配优化

**响应式断点完善**:
- ✅ `responsive.css` - 添加 9 个设备断点
  - 手机 (< 768px)
  - 平板 (768px - 1024px)
  - 小屏笔记本 (1024px - 1366px)
  - 标准笔记本 (1366px - 1920px)
  - 台式机 (1920px - 2560px)
  - 大屏 (> 2560px)
  - 4K 屏 (> 3840px)
  - 超宽屏 (21:9)
  - 折叠屏

**移动端优化**:
- ✅ 触摸区域 ≥ 44px (iOS 标准)
- ✅ 输入框字体 16px (防止 iOS 缩放)
- ✅ 禁用不必要的悬停效果
- ✅ 优化滚动体验

**游戏页面适配**:
- ✅ `game-common.css` - 5 个断点 (1100px/768px/600px/480px/375px)
- ✅ 小屏手机优化 (≤ 375px)

**博客页面适配**:
- ✅ `MangaBlog.css` - 4 个断点 (768px/600px/480px/375px)
- ✅ 触摸按钮优化 (最小高度 48px)

### 2026-04-08: 作品集页面风格统一

**页面更名**:
- ✅ "汤圆的游戏" → "汤圆的作品集" (GamesCollection.jsx)
- ✅ 英文副标题 "TANGYUAN'S GAMES" → "TANGYUAN'S PORTFOLIO"

**样式优化** (`GamesCollection.css`):
- ✅ 移除所有 `!important` 声明
- ✅ 使用 `clamp()` 实现平滑响应式缩放
- ✅ 统一卡片样式类名 (`.manga-card-title-cn`, `.manga-card-desc` 等)
- ✅ 优化信息卡片/技术标签样式
- ✅ 精简响应式断点 (1100px/800px/600px/480px/1920px/2560px)
- ✅ 添加触摸设备优化 (最小点击区域 44px)

**代码统计**:
- `GamesCollection.css`: 精简约 40 行，优化结构

### 2026-04-08: 作品集智能字体缩放排版 v3.0

**设计理念**:
- ✅ 字体跟随容器大小智能缩放
- ✅ 使用 container query + clamp() 组合
- ✅ 确保文字不溢出容器
- ✅ 更大的基础字体，更好的可读性

**字体调整** (`GamesCollection.css` v3.0):
- ✅ 中文标题：`clamp(1.4rem, 4vw, 2rem)` - 更大更醒目
- ✅ 英文标题：`clamp(0.7rem, 2vw, 0.9rem)` - 精致但不失清晰
- ✅ 描述文字：`clamp(0.95rem, 2.5vw, 1.1rem)` - 舒适阅读体验
- ✅ 标签文字：`clamp(0.7rem, 1.8vw, 0.85rem)` - 清晰可点
- ✅ 统计数字：`clamp(2.5rem, 8vw, 4rem)` - 视觉冲击力强
- ✅ 社交链接：`clamp(0.8rem, 2vw, 0.95rem)` - 易于点击

**容器优化**:
- ✅ 游戏卡片：`container-type: inline-size` 启用容器查询
- ✅ 侧边栏：独立容器，字体自适应宽度
- ✅ 网格布局：`minmax(320px, 1fr)` 保证最小可读宽度
- ✅ 内边距：`clamp(1.5rem, 4vw, 2.5rem)` 呼吸感更强

**布局调整**:
- ✅ 主布局三栏：`clamp(180px, 18vw, 240px) 1fr clamp(200px, 18vw, 260px)`
- ✅ 卡片间距：`clamp(1.5rem, 3vw, 2.5rem)` 更宽松
- ✅ 悬停效果：`translate(-6px, -6px)` + 更大阴影

**响应式增强**:
- ✅ 容器查询：`@container main-container` 智能适配
- ✅ 传统媒体查询：兼容旧浏览器
- ✅ 触摸优化：最小点击区域提升至 48px

**代码统计**:
- `GamesCollection.css`: 11190 字节，结构更清晰

**域名记录**:
- ✅ 记录用户域名 `ovo-ovo.cn` 到 USER.md

### 2026-04-08: 作品集固定比例卡片排版 v4.0

**设计理念**:
- ✅ 移除侧边栏，简化为单栏布局
- ✅ 卡片固定宽高比 (3:4)，不压缩变形
- ✅ 字体使用固定值，不随容器缩放
- ✅ 简洁清晰的网格布局

**布局简化** (`GamesCollection.css` v4.0):
- ✅ 移除左侧栏 (统计卡片/社交链接)
- ✅ 移除右侧栏 (信息卡片/技术标签)
- ✅ 主布局改为单栏：`display: block`
- ✅ 网格居中：`justify-content: center`

**卡片固定比例**:
- ✅ `aspect-ratio: 3/4` - 固定宽高比
- ✅ `min-height: 420px` - 最小高度保证
- ✅ `padding: 2rem` - 固定内边距
- ✅ 描述文字 4 行截断：`-webkit-line-clamp: 4`

**固定字体大小**:
| 元素 | 大小 | 说明 |
|------|------|------|
| 中文标题 | 1.6rem | 清晰醒目 |
| 英文标题 | 0.8rem | 精致 |
| 描述文字 | 1rem | 舒适阅读 |
| 标签 | 0.75rem | 紧凑 |
| 图标 | 70px | 固定大小 |

**响应式适配**:
- ✅ 平板 (900px): 卡片 300px 最小宽度
- ✅ 手机 (600px): 单列布局
- ✅ 大屏 (1400px+): 卡片 360px+
- ✅ 超大屏 (1920px+): 卡片 400px+

**代码统计**:
- `GamesCollection.css`: 6700 字节 (-40%)
- 移除约 180 行侧边栏相关代码

### 2026-04-08: 修复布局爆炸问题 v4.1

**问题**: CSS 移除侧边栏后，JSX 仍保留侧边栏代码，导致布局错乱

**修复内容** (`GamesCollection.jsx`):
- ✅ 移除左侧栏 JSX (`manga-sidebar-left`)
- ✅ 移除右侧栏 JSX (`manga-sidebar-right`)
- ✅ 移除社交链接数据
- ✅ 简化游戏描述文案
- ✅ 移除未使用的图标导入

**代码对比**:
- JSX: 164 行 → 64 行 (-100 行)
- 结构更清晰，只保留核心游戏网格

**提交记录**:
- `fix: 修复作品集页面布局爆炸 - 同步移除侧边栏 JSX`

### 2026-04-08: 作品集时间轴排版 v5.0

**设计理念**:
- ✅ 滚动式时间轴布局，按时间顺序展示
- ✅ 只保留 13 个 GameJam 作品（基于表格数据）
- ✅ 删除非 GameJam 游戏（扫雷/贪吃蛇/FlyBird/吃豆人/恐龙）
- ✅ 交替左右排列，视觉更丰富
- ✅ 每个卡片包含完整活动信息

**数据更新** (`GamesCollection.jsx` v5.0):
- ✅ 13 个 GameJam 作品，按时间排序 (2023.2 - 2026.3)
- ✅ 每个作品包含：时间/活动/主题/地点/队伍/成员
- ✅ 外部链接：GmHub / TapTap / Bilibili / 百度网盘
- ✅ 队伍名称：零时密境 / 跑路策程只会梦见 AI 画师 / 大锅炖汤圆队 / T-Cat / 牛战士不会摘下他的面具

**时间轴样式** (`GamesCollection.css` v5.0):
- ✅ 中央时间轴线：`4px` 黑色竖线
- ✅ 交替布局：左/右项目各占 50% 宽度
- ✅ 时间标记：黑色背景白字，跨线显示
- ✅ 卡片悬停：`translate(-6px, -6px)` + 阴影增强
- ✅ 进入动画：`translateY(30px)` + `opacity: 0` → `1`
- ✅ 链接按钮：GmHub / TapTap / Bilibili / 百度网盘

**信息结构**:
```
┌─────────────────────────┐
│     [图标]              │
│  游戏名称 (中文 + 英文)   │
├─────────────────────────┤
│ 📅 活动：2026 GGJ 武汉站  │
│ 🎯 主题：MASK            │
│ 👥 队伍：牛战士不会...   │
├─────────────────────────┤
│ [GmHub] [TapTap] [B 站]  │
└─────────────────────────┘
```

**响应式适配**:
- ✅ 平板 (900px): 时间轴线移到左侧，单栏布局
- ✅ 手机 (600px): 缩小字体和间距
- ✅ 大屏 (1400px+): 增加容器宽度和间距

**代码统计**:
- `GamesCollection.jsx`: 13734 字节 (13 个作品数据)
- `GamesCollection.css`: 7972 字节 (时间轴样式)

**提交记录**:
- `feat: 作品集时间轴排版 v5.0 - 13 个 GameJam 作品`

### 2026-04-08: 作品详情页 + 删除 emoji + 统一标题 v5.1

**新增功能**:
- ✅ 创建作品详情页 `GameDetail.jsx` (14863 字节)
- ✅ 创建详情页样式 `GameDetail.css` (8088 字节)
- ✅ 添加路由 `/games/:id` 支持 13 个作品详情

**详情页设计**:
- ✅ 黑白漫画风格，与时间轴页面统一
- ✅ 返回按钮：返回作品集列表
- ✅ 主卡片：图标 + 标题 + 描述 + 标签
- ✅ 信息面板：时间/活动/主题/地点/队伍/成员
- ✅ 链接面板：GmHub / TapTap / Bilibili / 百度网盘
- ✅ 响应式：平板/手机适配

**删除 emoji**:
- ✅ 时间轴信息标签：`📅` `🎯` `👥` → 纯文本
- ✅ 详情页信息面板：纯文本标签

**统一标题**:
- ✅ `Header.jsx`: Logo "汤圆的小窝" → "汤圆的作品集"
- ✅ `Header.jsx`: 导航 "小窝" → "首页"，"游戏宇宙" → "作品集"
- ✅ `NewspaperHome.jsx`: 游戏版块 "汤圆的游戏" → "汤圆的作品集"
- ✅ `GamesCollection.jsx`: 报头 "汤圆的作品集" (已统一)
- ✅ `GameDetail.jsx`: 报头 "汤圆的作品集" (已统一)

**代码统计**:
- 新增 2 个文件：`GameDetail.jsx` + `GameDetail.css`
- 修改 4 个文件：`App.jsx`, `GamesCollection.jsx`, `Header.jsx`, `NewspaperHome.jsx`

**提交记录**:
- `feat: 作品详情页 + 删除 emoji + 统一标题为作品集 v5.1`

### 2026-04-08: 增强滚动动画 + 大气排版 v5.2

**动画增强**:
- ✅ 时间轴脉冲动画：顶部标记点呼吸效果 (`timelinePulse`)
- ✅ 半色调背景浮动：视差滚动背景 (`halftoneScroll`, `halftoneFloat`)
- ✅ 卡片进入动画：`translateY(50px) scale(0.95)` → `translateY(0) scale(1)`
- ✅ 悬停光泽扫过：卡片上的对角光泽扫过效果
- ✅ 图标填充动画：悬停时背景从中心扩散填充
- ✅ 边框渐变闪烁：详情页顶部边框流光效果 (`borderShimmer`)
- ✅ 页脚光泽扫过：底部光泽循环动画 (`footerShine`)
- ✅ 分隔符脉冲旋转：页脚分隔符旋转脉冲 (`sepPulse`)
- ✅ 链接按钮填充：悬停时黑色背景从左滑入
- ✅ 信息项悬停：网格项独立悬停效果

**详情页大气排版**:
- ✅ 主卡片尺寸：`120px` 图标 + `3rem` 标题 + 引号装饰
- ✅ 信息面板：网格项独立背景 + 悬停效果
- ✅ 链接卡片：更大尺寸 (`220px` 最小宽度) + 光泽扫过
- ✅ 描述引号：大尺寸引号装饰 (`2rem`)
- ✅ 标签悬停：独立填充动画
- ✅ 返回按钮：箭头滑动动画
- ✅ 面板进入延迟：卡片 `0s` → 信息 `0.2s` → 链接 `0.4s`

**滚动交互**:
- ✅ `IntersectionObserver` 监听可见性
- ✅ 滚动触发卡片依次出现
- ✅ 视差背景层 (预留)

**代码变化**:
- `GamesCollection.css`: 13360 字节 (+5388 字节)
- `GameDetail.css`: 15305 字节 (+7217 字节)
- `GamesCollection.jsx`: 添加滚动监听逻辑
- `GameDetail.jsx`: 添加 IntersectionObserver

**提交记录**:
- `feat: 增强滚动动画 + 详情页大气排版 v5.2`

### 2026-04-08: 删除黑色底栏 v5.3

**删除内容**:
- ✅ `GamesCollection.jsx`: 移除 `<footer className="manga-footer">` 区块
- ✅ `GameDetail.jsx`: 移除 `<footer className="manga-footer">` 区块
- ✅ `GamesCollection.css`: 移除所有 `.manga-footer*` 样式（约 80 行）
- ✅ `GameDetail.css`: 移除所有 `.manga-footer*` 样式（约 70 行）

**删除的样式**:
- `.manga-footer` 容器
- `.manga-footer::before` 光泽动画
- `.manga-footer-content` 布局
- `.manga-footer-line` 文本行
- `.manga-sep` 分隔符脉冲动画
- `.manga-icp` 备案链接

**代码变化**:
- 删除 4 个文件中的页脚代码
- 总计删除约 236 行代码

**视觉效果**:
- 页面底部更简洁
- 时间轴/详情页内容结束后直接结束
- 无黑色底栏干扰

**提交记录**:
- `style: 删除作品集及详情页黑色底栏 v5.3`

### 2026-05-07: 修复导航栏头像显示不全 v5.5

**问题描述**:
- 导航栏 `.user-btn` 按钮有 `padding: 0.5rem 0.8rem`，但按钮尺寸仅 `36x36px`
- 加上 `4px` 边框后，实际内容区域仅剩 `20px`
- 头像图片 `28x28px` 被严重挤压，显示不全

**修复内容**:
- ✅ `.user-btn`: 移除 padding（设为 `0`），头像居中显示
- ✅ `.login-btn`: 保留 padding（无头像，需要内边距）
- ✅ 按钮尺寸: `36x36` → `40x40`（给头像更多空间）
- ✅ 头像尺寸: `28x28` → `30x30`
- ✅ 添加 `object-position: center` 确保头像居中

**涉及文件**:
- `src/styles/header.css`: 修改 `.user-btn` 和 `.header-avatar` 样式

**提交记录**:
- `fix: 修复导航栏头像显示不全 v5.5`

### 2026-04-28: 首页重构为桌面卡片风格 v6.0

**设计理念**:
- ✅ 删除导航栏以外所有元素
- ✅ 所有页面以卡片形式随机散落在桌面上
- ✅ 卡片可鼠标拖动，大小随机，旋转角度随机
- ✅ 点击卡片翻转查看背面，双击跳转
- ✅ 黑白漫画风格统一

**新首页功能** (`Home.jsx` v6.0):
- ✅ 8 个页面卡片：作品集、博客、关于、番茄钟、小游戏、特殊构造、个人中心、登录
- ✅ 3 种卡片尺寸：large (320x240)、medium (260x200)、small (200x160)
- ✅ 随机位置 + 随机旋转角度 (-8° 到 8°)
- ✅ 拖拽交互：鼠标按下拖动，自动提升到最上层
- ✅ 翻转交互：点击翻转查看背面，双击跳转
- ✅ 黑白漫画风格：硬阴影、角落装饰、漫画网点背景

**样式文件** (`Home.css` v6.0):
- ✅ 桌面卡片样式（4036 字节）
- ✅ 卡片翻转动画（3D perspective + backface-visibility）
- ✅ 拖拽光标样式（grab/grabbing）
- ✅ 响应式适配（768px / 480px 断点）

**代码变化**:
- 新建 `src/pages/Home.jsx`（桌面卡片首页）
- 新建 `src/styles/Home.css`（卡片样式）
- 修改 `src/App.jsx`（路由更新）

**提交记录**:
- `feat: 首页重构为桌面卡片风格 v6.0`

### 2026-04-28: 首页重构为模拟电脑桌面 v7.0

**设计理念**:
- ✅ 模拟 Windows/macOS 桌面环境
- ✅ 桌面图标（所有页面）
- ✅ 可拖动的窗口系统
- ✅ 底部任务栏（显示打开的窗口）
- ✅ 资源管理器 + 终端 + 设置
- ✅ 黑白漫画风格统一

**新桌面功能** (`Desktop.jsx` v7.0):
- ✅ 12 个桌面图标：作品集、博客、关于、番茄钟、小游戏、特殊构造、个人中心、登录、注册、资源管理器、设置、终端
- ✅ 窗口系统：拖动、最小化、关闭、z-index 管理
- ✅ 任务栏：开始按钮、窗口列表、系统托盘（时间显示）
- ✅ 资源管理器：文件浏览、双击打开、地址栏、状态栏
- ✅ 终端：模拟命令行（help/date/whoami/ls/clear 命令）
- ✅ 设置：主题选择、版本信息
- ✅ 右键菜单：快速打开页面/工具
- ✅ 黑白漫画风格：硬阴影、黑色标题栏、漫画网点背景

**样式文件** (`Desktop.css` v7.0):
- ✅ 桌面环境样式（9130 字节）
- ✅ 窗口系统样式（标题栏/内容/调整大小手柄）
- ✅ 资源管理器样式（地址栏/文件列表/状态栏）
- ✅ 终端样式（黑色背景 + 绿色文字）
- ✅ 任务栏样式（开始按钮/窗口列表/系统托盘）
- ✅ 右键菜单样式
- ✅ 响应式适配（768px / 480px 断点）

**代码变化**:
- 新建 `src/pages/Desktop.jsx`（模拟电脑桌面）
- 新建 `src/styles/Desktop.css`（桌面样式）
- 修改 `src/App.jsx`（路由更新）

**提交记录**:
- `feat: 首页重构为模拟电脑桌面 v7.0`

### 2026-04-28: 桌面图标修复 v7.1

**问题修复**:
- ✅ 移除所有 emoji，改用纯文本/CSS 图标符号（P/B/A/T/G/S/U/L/R/E/C/$）
- ✅ 图标布局改为网格排版：从上到下排满一列后自动换到下一列
- ✅ 图标支持拖拽：鼠标拖动后更新位置
- ✅ 资源管理器正常显示：修复窗口内容渲染问题

**代码变化** (`Desktop.jsx` v7.1):
- ✅ 图标数据：移除 emoji，改用 symbol 字段（单字母）
- ✅ 图标位置：使用 useEffect 初始化网格位置（动态计算每列数量）
- ✅ 图标拖拽：onMouseDown 事件 + 鼠标移动/抬起监听
- ✅ 资源管理器：修复 openWindow 回调传递

**样式变化** (`Desktop.css` v7.1):
- ✅ 图标样式：绝对定位 + 网格布局
- ✅ 图标符号：CSS 方框 + 粗体字母
- ✅ 移除所有 emoji 相关样式
- ✅ 资源管理器工具栏：地址栏 + 导航按钮

**代码统计**:
- `Desktop.jsx`: 17111 字节
- `Desktop.css`: 10927 字节

**提交记录**:
- `fix: 桌面图标修复 - 移除emoji/网格布局/图标拖拽/资源管理器 v7.1`

### 2026-04-28: 桌面系统 v7.5 - iframe 加载真实页面

**架构变更**:
- ✅ 窗口内容改用 `<iframe>` 加载真实完整页面（非精简版组件）
- ✅ 解决用户反馈"精简版不是真实页面"的问题
- ✅ iframe 内显示真正的页面内容（含 Header/Footer/所有交互）

**技术实现**:
- ✅ `getIframeUrl(route)` 构造 iframe URL（`origin + pathname + '#/' + route`）
- ✅ `isInIframe()` 检测函数：在 iframe 中 Desktop 返回 null（避免桌面嵌套桌面）
- ✅ 修复 HashRouter 双斜杠 bug（`route` 去掉开头 `/`，避免 `//#/games`）
- ✅ App.jsx 路由配合：`/#/games` 匹配 GamesCollection（非 Desktop）

**CSS 优化**:
- ✅ 清理 `Desktop.css` 中 25 个重复的 `.explorer-content` 块
- ✅ `.window-content` 添加 `min-height: 0`（flex 布局修复）
- ✅ `.window-iframe` 添加 `min-height: 100%`（iframe 自适应窗口）

**代码统计**:
- `Desktop.jsx`: 19193 字节
- `Desktop.css`: 10927 字节（清理后）

### 2026-04-28: 桌面系统 v7.6 - 窗口自由拉伸 + 内容自适应

**新功能**:
- ✅ 窗口支持自由拖拽拉伸（CSS `resize: both`）
- ✅ iframe 内容动态自适应窗口大小
- ✅ 右下角漫画风格拉伸手柄指示器
- ✅ ResizeObserver 监听窗口尺寸变化，自动更新状态

**技术实现**:
- ✅ `.desktop-window` 添加 `resize: both` + `overflow: hidden`
- ✅ `.window-content` 添加 `min-height: 0`（flex 子元素正确收缩）
- ✅ `.window-iframe` 添加 `min-height: 100%`（iframe 填满窗口）
- ✅ 新增 `ResizeObserver` 监听窗口尺寸变化
- ✅ 新增 `handleResize` 回调更新窗口宽高状态
- ✅ 新增 `.resize-handle` 漫画风格三角指示器

**代码统计**:
- `Desktop.jsx`: ~19500 字节
- `Desktop.css`: ~11100 字节

### 2026-04-28: 桌面系统 v7.6.1 - 窗口拉伸 Bug 修复

**Bug 修复**:
- ✅ 修复窗口回缩 bug：移除 CSS `resize: both`，改用 JS 自定义拉伸手柄
- ✅ 修复 iframe 导航栏溢出：Header 在小窗口下按钮/文字出框
- ✅ `header.css` 新增超小视口适配（< 500px）：隐藏导航、缩小 Logo、紧凑布局
- ✅ `header.css` 新增小视口适配（500-768px）：紧凑导航按钮
- ✅ `.header-main` 添加 `min-width: 0` 允许 flex 子元素正确收缩

**技术实现**:
- ✅ Desktop.jsx 已有 JS 自定义 resize（`handleResizeMouseDown` + `handleMouseMove`）
- ✅ header.css 新增 `@media (max-width: 499px)` 超小视口规则
- ✅ header.css 新增 `@media (min-width: 500px) and (max-width: 768px)` 小视口规则
- ✅ 超小视口下：header 高度 40px、padding 0.5rem、隐藏导航、按钮 32x32

**代码统计**:
- `Desktop.jsx`: ~19500 字节（无变化）
- `Desktop.css`: ~11100 字节（无变化）
- `header.css`: 新增 ~70 行响应式规则

---

### 2026-04-28: 桌面系统 v7.6.2 - 修复按钮换行 + 缩小拉伸手柄

**Bug 修复**:
- ✅ 修复弹性容器挤压换行：`.header-main` 和 `.nav` 添加 `flex-wrap: nowrap`
- ✅ 缩小拉伸手柄：从 24×24px 改为 12×12px，简化为单色三角
- ✅ 减少 iframe padding：从 24px 减到 12px，增加内容可用空间

**技术实现**:
- `header.css`: `.header-main` 添加 `flex-wrap: nowrap` 防止换行
- `header.css`: `.nav` 添加 `flex-wrap: nowrap` 防止按钮换行
- `Desktop.css`: `.resize-handle` 缩小到 12×12px，背景改为 `linear-gradient(135deg, transparent 50%, #1a1a1a 50%)`
- `Desktop.css`: `.window-content` padding 从 24px 改为 12px
- `Desktop.css`: `.window-iframe` calc 从 24px 改为 12px

**代码统计**:
- `Desktop.css`: 拉伸手柄简化，padding 调整
- `header.css`: 新增 `flex-wrap: nowrap`（2 处）

---

**最后更新**: 2026-04-28  
**维护者**: AI Assistant
