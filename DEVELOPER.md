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
│   │   ├── pomodoro.css    # 番茄钟样式 (2300+ 行)
│   │   └── ...
│   └── App.jsx             # 路由配置
├── server/
│   └── index.js            # 后端 API (Express)
├── index.html              # 入口 HTML
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

### 设计系统
- **主色**: 琥珀色 `#ff9500` + 青色 `#06b6d4`
- **背景**: `--bg-deep: #050508`
- **文字**: `--text: #d4d4d8`
- **风格**: 赛博朋克 + 复古磁带

### 统一元素
```css
/* 输入框 */
background: rgba(255,255,255,0.05);
border: 1px solid rgba(255,149,0,0.2);
font-family: var(--font-mono);

/* 按钮 */
background: rgba(255,149,0,0.15);
border: 1px solid var(--amber);
color: var(--amber);

/* 鼠标状态 */
可点击：pointer
可拖拽：grab/grabbing
默认：default
```

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
```

---

## 📊 当前版本

| 模块 | 版本 | 状态 |
|------|------|------|
| 番茄钟 | v8.1 | ✅ 完整功能 |
| 博客 | v3.0 | ✅ 基础功能 |
| 后台 | v2.0 | ✅ 管理功能 |
| 用户系统 | v1.0 | ✅ 注册登录 |

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

---

## 📞 快速参考

**编译错误**: 检查 JSX 语法、导入语句、重复声明  
**黑屏问题**: 检查组件导入、localStorage 解析  
**样式无效**: 检查类名匹配、CSS 优先级  
**拖拽失效**: 检查 `draggable`、`onDragStart`、`onDrop`

---

**最后更新**: 2025-01-04  
**维护者**: AI Assistant
