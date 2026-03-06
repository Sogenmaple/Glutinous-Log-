# 汤圆游戏世界 - 博客管理系统

一个复古风格的个人博客与游戏作品集展示平台。

## 🎨 设计主题

- **风格**: 复古磁带 / 赛博朋克
- **配色**: 琥珀色 (Amber) + 青色 (Cyan)
- **字体**: VT323, Share Tech Mono, Orbitron

## 🚀 快速开始

### 开发模式

```bash
# 启动后端 API 服务 (3001 端口)
cd /root/tangyuan-games
node server/index.js &

# 启动前端开发服务器 (3000 端口)
npm run dev
```

### 生产构建

```bash
# 构建前端
npm run build

# 构建产物在 dist/ 目录
```

## 📁 项目结构

```
tangyuan-games/
├── src/
│   ├── components/          # React 组件
│   │   ├── admin/          # 后台管理组件
│   │   │   ├── PostEditor.jsx      # 文章编辑器
│   │   │   └── PostListAdmin.jsx   # 文章列表管理
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── GameTimeline.jsx
│   │   ├── PostList.jsx
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── AdminLogin.jsx  # 后台登录
│   │   ├── AdminDashboard.jsx  # 后台仪表盘
│   │   └── PostDetail.jsx  # 文章详情
│   ├── data/               # 静态数据
│   ├── hooks/              # 自定义 Hooks
│   ├── styles/             # 样式文件
│   └── App.jsx             # 主应用组件
├── server/                 # 后端 API 服务
│   └── index.js           # Express 服务器
├── package.json
└── vite.config.js
```

## 🔐 后台管理

### 访问地址
- **前台首页**: `http://localhost:3000`
- **后台登录**: `http://localhost:3000/#/admin/login`
- **API 端点**: `http://localhost:3001/api/`

### 默认管理员账号
- 用户名：`admin`
- 密码：`admin123`

### 功能特性

#### 文章编辑器 (PostEditor)
- ✅ 标题、摘要、正文内容编辑
- ✅ 类型选择（游戏项目/开发日志/技术分享/设计笔记/生活随笔）
- ✅ 分类管理
- ✅ 标签系统（逗号分隔）
- ✅ 状态切换（草稿/已发布）
- ✅ 封面图片 URL
- ✅ 阅读时间估算
- ✅ 字数统计（字符数/词数）
- ✅ Markdown 快捷插入工具栏
- ✅ 实时保存状态提示

#### 文章列表管理 (PostListAdmin)
- ✅ 文章总数统计卡片
- ✅ 搜索功能（标题/内容/标签）
- ✅ 类型筛选
- ✅ 状态筛选
- ✅ 文章详情预览
- ✅ 快速编辑/删除
- ✅ 标签展示（最多显示 3 个 + 计数）
- ✅ 空状态提示

## 🛠️ API 接口

### 认证
- `POST /api/login` - 用户登录

### 文章
- `GET /api/posts` - 获取所有文章
- `GET /api/posts/:id` - 获取单篇文章
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:id` - 更新文章（需认证）
- `DELETE /api/posts/:id` - 删除文章（需认证）

## 📦 技术栈

### 前端
- React 18
- React Router DOM (Hash 路由)
- Vite 6
- 原生 CSS（CSS 变量 + 动画）

### 后端
- Node.js + Express
- JWT 认证
- bcryptjs 密码加密
- 文件系统存储（JSON）

## 🎯 待开发功能

- [ ] Markdown 实时预览
- [ ] 图片上传功能
- [ ] 文章分类管理
- [ ] 评论系统
- [ ] 访客统计
- [ ] SEO 优化
- [ ] PWA 支持

## ⚠️ 注意事项

1. **生产部署**: 建议使用 Nginx 部署 `dist` 目录
2. **安全**: 生产环境请修改 JWT_SECRET 并使用环境变量
3. **数据备份**: 定期备份 `src/data/` 目录下的 JSON 文件
4. **端口**: 确保服务器防火墙开放 3000 和 3001 端口

---

**开发时间**: 2026-03-06  
**版本**: 1.0.0
