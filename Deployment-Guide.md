# GTM智能中台 - 正式上线部署指南

## 方案对比

| 方案 | 成本 | 难度 | 适用场景 |
|------|------|------|----------|
| **Vercel/Netlify** | 免费起步 | ⭐ 简单 | 快速上线、个人/小团队 |
| **云服务器 + Nginx** | ¥50-200/月 | ⭐⭐⭐ 中等 | 企业级、需要自定义 |
| **Docker + K8s** | ¥200+/月 | ⭐⭐⭐⭐⭐ 复杂 | 大规模、高可用 |

---

## 推荐方案：Vercel（最简单）

### 1. 准备工作

#### 1.1 购买域名
推荐平台：
- **阿里云** (wanwang.aliyun.com) - 中文界面，.com ¥55/年
- **腾讯云** (dnspod.cloud.tencent.com) - .cn ¥35/年
- **Cloudflare** - 国外域名，DNS管理方便

#### 1.2 注册 GitHub 账号
访问 https://github.com 注册

#### 1.3 注册 Vercel 账号
访问 https://vercel.com ，用 GitHub 账号登录

---

### 2. 部署流程

#### 2.1 创建 GitHub 仓库

```bash
# 在项目目录执行
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 创建仓库后
git remote add origin https://github.com/你的用户名/gtm-platform.git
git push -u origin main
```

#### 2.2 配置 Vercel

1. 登录 Vercel Dashboard
2. 点击 "Add New Project"
3. 选择 GitHub 仓库
4. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 Deploy

#### 2.3 配置环境变量（可选）

在 Vercel Project Settings → Environment Variables 添加：

```
VITE_SUPABASE_URL=你的Supabase URL
VITE_SUPABASE_ANON_KEY=你的Supabase Key
```

---

### 3. 绑定自定义域名

#### 3.1 在 Vercel 添加域名

1. Project Settings → Domains
2. 输入你的域名，如 `gtm.yourcompany.com`
3. 记录 Vercel 提供的 DNS 记录

#### 3.2 在域名服务商配置 DNS

以阿里云为例：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | www | cname.vercel-dns.com |
| A | @ | 76.76.21.21 |

#### 3.3 等待 DNS 生效

通常 5-30 分钟，最长 48 小时

---

### 4. 配置 Supabase 生产环境

#### 4.1 创建生产数据库

1. 登录 https://supabase.com
2. 创建 New Project
3. 选择地区（推荐亚太地区）
4. 保存 Database URL 和 API Key

#### 4.2 执行数据库初始化

在 Supabase SQL Editor 执行：

```sql
-- 复制 schema.sql 中的内容执行
```

#### 4.3 更新环境变量

在 Vercel 更新为生产环境的 Supabase 配置

---

## 备选方案：阿里云服务器

### 1. 购买服务器

推荐配置：
- **ECS 共享型 n4** - 1核2G - ¥99/年
- **轻量应用服务器** - 2核4G - ¥200/年

### 2. 环境配置

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt-get update
sudo apt-get install -y nginx

# 安装 PM2
sudo npm install -g pm2
```

### 3. 部署脚本

```bash
# 克隆代码
git clone https://github.com/你的用户名/gtm-platform.git
cd gtm-platform

# 安装依赖
npm install

# 构建
npm run build

# 启动服务
pm2 serve dist 3000 --name "gtm-platform"
pm2 startup
pm2 save
```

### 4. Nginx 配置

```nginx
# /etc/nginx/sites-available/gtm-platform
server {
    listen 80;
    server_name gtm.yourcompany.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 启用 HTTPS（SSL）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d gtm.yourcompany.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 成本预估

| 项目 | 方案A (Vercel) | 方案B (阿里云) |
|------|---------------|---------------|
| 域名 | ¥55/年 | ¥55/年 |
| 服务器 | 免费 | ¥99-200/年 |
| 数据库 | 免费 (Supabase) | 免费 (Supabase) |
| SSL证书 | 免费 | 免费 (Let's Encrypt) |
| **总计** | **¥55/年** | **¥154-255/年** |

---

## 运维建议

### 监控
- **Vercel Analytics** - 免费，内置
- **UptimeRobot** - 免费监控网站可用性
- **Sentry** - 错误追踪，免费版够用

### 备份
- 定期导出 Supabase 数据库
- GitHub 代码自动备份

### 更新流程
```bash
# 本地修改后
git add .
git commit -m "更新内容"
git push

# Vercel 自动部署
```

---

## 需要我帮你做什么？

1. **生成完整的部署配置文件**
2. **编写自动化部署脚本**
3. **配置 Docker 容器化部署**
4. **设置 CI/CD 流水线**

请告诉我你想采用哪个方案，我可以进一步协助！
