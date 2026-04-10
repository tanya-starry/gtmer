#!/bin/bash

# GTM智能中台 - 快速部署脚本
# 使用方法: ./deploy.sh

echo "🚀 GTM智能中台部署脚本"
echo "========================"
echo ""

# 配置信息
GITHUB_USER="tanya-starry"
REPO_NAME="gtm-platform"
DOMAIN="gtmer.cn"

echo "📋 配置信息:"
echo "  GitHub 用户: $GITHUB_USER"
echo "  仓库名: $REPO_NAME"
echo "  域名: $DOMAIN"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "📝 步骤 1/5: 初始化 Git 仓库..."
git init
git config user.name "$GITHUB_USER"
git config user.email "deploy@$DOMAIN"
git branch -M main

echo "📦 步骤 2/5: 添加文件到 Git..."
git add .

echo "💾 步骤 3/5: 提交代码..."
git commit -m "Initial commit for $DOMAIN deployment"

echo "🔗 步骤 4/5: 连接远程仓库..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "☁️ 步骤 5/5: 推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 代码已成功推送到 GitHub!"
echo ""
echo "🌐 仓库地址: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "📌 下一步:"
echo "  1. 访问 https://vercel.com"
echo "  2. 点击 'Add New Project'"
echo "  3. 导入 $REPO_NAME 仓库"
echo "  4. 点击 Deploy"
echo ""
echo "📖 详细指南: 查看 DEPLOY-FOR-TANYA.md"
