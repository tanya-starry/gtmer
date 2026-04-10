# GTM智能中台 - Vercel 部署指南

## 📋 部署前准备

### 1. 购买域名（你需要完成）

推荐平台：
- **阿里云**: https://wanwang.aliyun.com - .com 域名约 ¥55/年
- **腾讯云**: https://dnspod.cloud.tencent.com - .cn 域名约 ¥35/年

建议域名格式：
- `gtm.yourcompany.com` (公司子域名)
- `yourname-gtm.com` (独立域名)

### 2. 注册账号（你需要完成）

1. **GitHub**: https://github.com/signup
2. **Vercel**: https://vercel.com/signup (用 GitHub 登录)

---

## 🚀 部署步骤

### 步骤 1: Fork 代码到 GitHub

1. 登录 GitHub
2. 访问你的仓库页面
3. 点击 Fork 按钮，将代码复制到你的账号下

### 步骤 2: 连接 Vercel

1. 登录 Vercel (vercel.com)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择你 Fork 的仓库
5. 点击 "Import"

### 步骤 3: 配置项目

Vercel 会自动识别配置，确认以下设置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

点击 "Deploy" 开始部署

### 步骤 4: 配置环境变量（重要）

1. 进入 Vercel Project Dashboard
2. 点击 "Settings" → "Environment Variables"
3. 添加以下变量：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ 需要先在 Supabase 创建项目获取这些值

4. 点击 "Save" 并重新部署

### 步骤 5: 绑定自定义域名

1. Vercel Dashboard → 你的项目 → "Settings" → "Domains"
2. 输入你购买的域名，如 `gtm.yourcompany.com`
3. 点击 "Add"
4. 记录 Vercel 提供的 DNS 配置信息

### 步骤 6: 配置 DNS（域名服务商后台）

登录你的域名服务商（阿里云/腾讯云），添加 DNS 记录：

**方式一：CNAME 记录（推荐）**

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | www | cname.vercel-dns.com |
| CNAME | @ | cname.vercel-dns.com |

**方式二：A 记录**

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 76.76.21.21 |

### 步骤 7: 等待生效

- DNS 生效时间：5 分钟 ~ 48 小时（通常 15 分钟内）
- Vercel 会自动申请 SSL 证书

---

## 🔧 Supabase 数据库配置

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 注册/登录账号
3. 点击 "New Project"
4. 选择地区："East Asia (Singapore)" 或 "Northeast Asia (Tokyo)"
5. 设置数据库密码，创建项目

### 2. 获取连接信息

1. 进入项目 Dashboard
2. 点击左侧 "Project Settings" → "API"
3. 复制以下信息：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. 初始化数据库

1. 点击左侧 "SQL Editor"
2. 新建 Query
3. 复制 `supabase/schema.sql` 中的全部内容
4. 点击 "Run" 执行

### 4. 配置 Vercel 环境变量

将上述获取的 URL 和 Key 添加到 Vercel 的环境变量中

---

## ✅ 部署检查清单

- [ ] 已购买域名
- [ ] 已注册 GitHub 账号
- [ ] 已注册 Vercel 账号
- [ ] 已 Fork 代码到 GitHub
- [ ] 已在 Vercel 创建项目
- [ ] 已在 Supabase 创建项目
- [ ] 已配置 Vercel 环境变量
- [ ] 已初始化 Supabase 数据库
- [ ] 已绑定自定义域名
- [ ] 已配置 DNS 记录
- [ ] 网站可正常访问

---

## 🔄 后续更新

代码更新后自动部署：

```bash
# 本地修改代码后
git add .
git commit -m "更新内容"
git push origin main

# Vercel 会自动重新部署
```

---

## 🆘 常见问题

### Q1: 部署失败，显示 Build Error
**解决**: 检查 package.json 中的 build 脚本是否为 `"build": "tsc && vite build"`

### Q2: 页面空白，控制台报错
**解决**: 检查环境变量 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确配置

### Q3: 域名无法访问
**解决**: 
1. 检查 DNS 记录是否正确
2. 使用 `nslookup yourdomain.com` 检查解析
3. 等待 DNS 生效（最长 48 小时）

### Q4: SSL 证书问题
**解决**: Vercel 会自动申请 Let's Encrypt 证书，无需手动配置

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 联系开发者协助
