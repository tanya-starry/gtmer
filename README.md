# GTM智能中台

一个集成知识库、AI Agent 和数据分析的统一 GTM (Go-to-Market) 智能平台。

## 功能特性

- 📚 **GTM 知识库** - 集中管理文章、SOP、案例等知识资产
- 🤖 **AI Agent 中心** - 智能自动化 GTM 任务
- ✍️ **文档编辑器** - 支持 Markdown 的实时预览编辑器
- 🗂️ **可编辑目录** - 自由管理知识库目录结构
- 🎨 **现代化 UI** - 深色主题，专业简洁

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/你的用户名/gtm-platform.git
cd gtm-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建

```bash
npm run build
```

## 部署指南

详见 [DEPLOY.md](./DEPLOY.md)

### 简要步骤

1. 购买域名
2. 注册 GitHub 和 Vercel 账号
3. Fork 本仓库到 GitHub
4. 在 Vercel 导入项目
5. 配置 Supabase 数据库
6. 绑定自定义域名

## 项目结构

```
├── src/
│   ├── components/ui/    # UI 组件
│   ├── lib/skills/       # Skill 系统
│   ├── types/            # TypeScript 类型
│   └── App.tsx           # 主应用
├── supabase/
│   └── schema.sql        # 数据库 Schema
├── vercel.json           # Vercel 配置
└── DEPLOY.md             # 部署文档
```

## 环境变量

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## License

MIT
