# 学习喵 - GitHub Pages 部署指南

## 概述
这是一个使用 React + TypeScript + Vite 构建的学习工具应用，支持通过 GitHub Pages 进行免费部署。

## 部署步骤

### 1. 准备 GitHub 仓库

1. 在 GitHub 上创建一个新的仓库，命名为 `learning-cat`（或其他你喜欢的名称）
2. 将本地代码推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit: Learning Cat App"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings" 标签页
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"
5. 保存设置

### 3. 自动部署

当你推送代码到 main 分支时，GitHub Actions 会自动：

1. 安装 Node.js 环境
2. 安装项目依赖
3. 构建生产版本
4. 部署到 GitHub Pages

### 4. 访问你的应用

部署完成后，你的应用将可以通过以下 URL 访问：
```
https://你的用户名.github.io/仓库名/
```

## 手动部署（如果需要）

如果你想手动触发部署：

1. 进入 GitHub 仓库的 "Actions" 标签页
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow"

## 配置说明

### Vite 配置
- `base: './'` - 设置为相对路径，适应 GitHub Pages 的子路径部署
- 自动代码分割优化

### GitHub Actions 工作流
- 使用 Node.js 18
- 自动缓存依赖加快构建速度
- 构建产物自动上传到 Pages

### SPA 路由支持
- 创建了 404.html 处理客户端路由
- 支持直接访问深层链接

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库 Settings → Pages 中设置 Custom domain
2. 在你的域名 DNS 中添加 CNAME 记录指向 GitHub Pages

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 package.json 依赖是否正确
   - 确保所有 TypeScript 错误已修复

2. **路由问题**
   - 确保所有路由都通过 index.html 处理
   - 检查 404.html 是否正确配置

3. **资源加载失败**
   - 检查 vite.config.ts 中的 base 配置
   - 确保所有资源路径使用相对路径

### 本地测试

在部署前，建议本地测试构建：

```bash
npm run build
npm run preview
```

## 项目结构

```
learning-cat/
├── .github/workflows/deploy.yml    # GitHub Actions 工作流
├── 404.html                        # SPA 路由重定向
├── src/                           # 源代码
├── dist/                          # 构建输出（自动生成）
├── vite.config.ts                 # Vite 配置
└── package.json                   # 项目配置
```

## 技术支持

如果遇到部署问题，请检查：
- GitHub Actions 日志
- 浏览器开发者工具控制台
- 确保所有依赖包版本兼容

---

祝你的学习喵应用部署成功！🐱