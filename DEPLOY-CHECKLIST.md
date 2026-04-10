# GTM智能中台 - 上线部署清单

## ✅ 你需要完成的事情

### 第一步：购买域名（预计 5-10 分钟）

推荐平台：
- **阿里云**: https://wanwang.aliyun.com
  - 搜索想要的域名
  - 推荐：`.com` (¥55/年) 或 `.cn` (¥35/年)
  - 完成实名认证后购买

- **腾讯云**: https://buy.cloud.tencent.com/domain
  - 流程类似

**建议域名格式：**
- `gtm.yourcompany.com` (如果有公司域名)
- `yourname-gtm.com` (独立域名)
- `gtm-platform.com`

---

### 第二步：注册账号（预计 5 分钟）

1. **GitHub**: https://github.com/signup
   - 使用邮箱注册
   - 验证邮箱

2. **Vercel**: https://vercel.com/signup
   - 选择 "Continue with GitHub"
   - 授权登录

---

## ✅ 我会帮你完成的事情

我已经为你准备好了以下文件：

### 配置文件
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `.github/workflows/deploy.yml` - 自动部署流水线
- ✅ `.gitignore` - Git 忽略配置
- ✅ `DEPLOY.md` - 详细部署文档
- ✅ `README.md` - 项目说明

### 代码准备
- ✅ 完整的项目代码
- ✅ 数据库 Schema (`supabase/schema.sql`)
- ✅ Skill 系统
- ✅ 文档编辑器

---

## 📦 项目打包交付

项目已保存在：`/mnt/okcomputer/output/app/`

### 你需要做的：

1. **下载项目代码**
   - 我会把项目打包成 zip 文件
   - 或者你可以直接复制 `app` 文件夹

2. **上传到 GitHub**
   ```bash
   # 在 app 文件夹内执行
   git init
   git add .
   git commit -m "Initial commit"
   
   # 在 GitHub 创建新仓库后
   git remote add origin https://github.com/你的用户名/gtm-platform.git
   git push -u origin main
   ```

---

## 🚀 部署流程（购买域名后）

### 1. Fork 到 GitHub
1. 登录 GitHub
2. 创建新仓库 `gtm-platform`
3. 上传代码

### 2. 连接 Vercel
1. 登录 Vercel
2. 点击 "Add New Project"
3. 选择 GitHub 仓库
4. 点击 "Deploy"

### 3. 配置数据库
1. 注册 Supabase: https://supabase.com
2. 创建新项目
3. 执行 `supabase/schema.sql`
4. 获取 URL 和 Key

### 4. 配置环境变量
在 Vercel 添加：
```
VITE_SUPABASE_URL=你的URL
VITE_SUPABASE_ANON_KEY=你的KEY
```

### 5. 绑定域名
1. Vercel → Settings → Domains
2. 添加你的域名
3. 在域名服务商配置 DNS

---

## 💰 费用预估

| 项目 | 费用 | 说明 |
|------|------|------|
| 域名 | ¥35-55/年 | .cn 或 .com |
| Vercel | 免费 | 个人项目免费 |
| Supabase | 免费 | 500MB 数据库免费 |
| **总计** | **¥35-55/年** | 仅域名费用 |

---

## 📞 需要帮助？

如果在部署过程中遇到问题，可以：

1. 查看 `DEPLOY.md` 中的常见问题
2. 检查 Vercel 部署日志
3. 联系我协助

---

## 🎯 下一步

请告诉我：
1. **你的域名是什么？** (购买后告诉我)
2. **你的 GitHub 用户名？** (注册后告诉我)

我可以帮你：
- 检查 DNS 配置是否正确
- 协助排查部署问题
- 优化部署配置
