# GTM智能中台 - 专属部署指南 (gtmer.cn)

## 🎯 你的配置信息

- **域名**: `gtmer.cn`
- **GitHub 用户名**: `tanya-starry`
- **项目名**: `gtm-platform` (建议)

---

## 第一步：创建 GitHub 仓库

### 1.1 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**: `gtm-platform`
   - **Description**: GTM智能中台 - 知识库与AI Agent平台
   - **Public** (推荐，免费部署)
   - ✅ 勾选 "Add a README file"
3. 点击 "Create repository"

### 1.2 上传代码到 GitHub

在你的本地电脑（下载项目代码后）执行：

```bash
# 进入项目目录
cd gtm-platform

# 初始化 Git
git init
git config user.name "tanya-starry"
git config user.email "your-email@example.com"

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 连接远程仓库
git remote add origin https://github.com/tanya-starry/gtm-platform.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 第二步：部署到 Vercel

### 2.1 登录 Vercel

1. 访问 https://vercel.com
2. 点击 "Continue with GitHub"
3. 授权访问你的 GitHub 账号

### 2.2 导入项目

1. 点击 "Add New Project"
2. 找到 `gtm-platform` 仓库，点击 "Import"
3. 配置项目：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. 点击 "Deploy"

等待部署完成，会获得一个 Vercel 临时域名（如 `gtm-platform-xxx.vercel.app`）

---

## 第三步：配置 Supabase 数据库

### 3.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 注册/登录账号
3. 点击 "New Project"
4. 配置：
   - **Organization**: 选择或创建
   - **Project name**: `gtm-platform`
   - **Database Password**: 设置强密码（保存好！）
   - **Region**: `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`
5. 点击 "Create new project"

等待项目创建完成（约 2 分钟）

### 3.2 初始化数据库

1. 进入项目 Dashboard
2. 点击左侧 "SQL Editor"
3. 点击 "New query"
4. 复制粘贴 `supabase/schema.sql` 中的全部内容
5. 点击 "Run" 执行

### 3.3 获取 API 密钥

1. 点击左侧 "Project Settings" → "API"
2. 复制以下信息（保存好！）：
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public**: `eyJhbG...` (长字符串)

---

## 第四步：配置 Vercel 环境变量

### 4.1 添加环境变量

1. 进入 Vercel Dashboard → 你的项目
2. 点击 "Settings" → "Environment Variables"
3. 添加两个变量：

```
Key: VITE_SUPABASE_URL
Value: https://你的项目.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbG... (你的 anon key)
```

4. 点击 "Save"
5. 重新部署：点击 "Deployments" → 最新部署 → "Redeploy"

---

## 第五步：绑定自定义域名 gtmer.cn

### 5.1 在 Vercel 添加域名

1. Vercel Dashboard → 项目 → "Settings" → "Domains"
2. 输入域名：`gtmer.cn`
3. 点击 "Add"
4. 记录 Vercel 提供的配置信息

### 5.2 配置 DNS（阿里云控制台）

1. 登录阿里云控制台 https://dns.console.aliyun.com
2. 找到 `gtmer.cn` 域名，点击 "解析设置"
3. 添加以下记录：

**方式一：CNAME 记录（推荐）**

| 记录类型 | 主机记录 | 解析线路 | 记录值 |
|---------|---------|---------|--------|
| CNAME | www | 默认 | cname.vercel-dns.com |
| A | @ | 默认 | 76.76.21.21 |

**方式二：如果支持 ANAME/ALIAS**

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 5.3 等待生效

- DNS 生效时间：5 分钟 ~ 48 小时（通常 15 分钟内）
- 可以在 Vercel Domains 页面查看状态

---

## 第六步：验证部署

### 6.1 检查网站访问

访问以下地址：
- https://gtmer.cn （你的域名）
- https://www.gtmer.cn （www 子域名）

### 6.2 检查功能

- ✅ 页面正常加载
- ✅ 左侧导航栏显示正常
- ✅ 可以创建文档
- ✅ 可以创建 Agent

---

## 🆘 常见问题

### Q1: Vercel 部署失败
**解决**: 
1. 检查 Build Command 是否为 `npm run build`
2. 检查 Output Directory 是否为 `dist`
3. 查看 Vercel 部署日志

### Q2: 页面空白，控制台报错
**解决**: 
1. 检查环境变量 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确
2. 确认 Supabase 数据库已初始化

### Q3: DNS 不生效
**解决**:
1. 使用 `nslookup gtmer.cn` 检查解析
2. 清除本地 DNS 缓存
3. 等待更长时间（最长 48 小时）

### Q4: SSL 证书问题
**解决**: Vercel 会自动申请 Let's Encrypt 证书，无需手动配置

---

## 📞 需要帮助？

如果在部署过程中遇到问题，请告诉我：
1. 错误截图或错误信息
2. 当前进行到第几步
3. 具体遇到了什么问题

我可以远程协助排查！

---

## ✅ 部署检查清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] Supabase 项目已创建
- [ ] 数据库已初始化
- [ ] Vercel 环境变量已配置
- [ ] 域名已添加到 Vercel
- [ ] DNS 记录已配置
- [ ] 网站可以正常访问

---

**现在你可以开始部署了！有问题随时问我。**
