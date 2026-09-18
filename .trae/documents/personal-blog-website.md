# 个人博客网站搭建计划

## Context（背景）

用户希望搭建一个个人博客网站，核心需求：
1. **移动端友好** — 在手机上能很好地浏览
2. **SEO 友好** — 搜索引擎能够抓取和索引网站内容

工作目录 `d:\trae_projects\yeccat_blog` 当前为空，属于全新项目。环境已安装 Node.js v24.18.0（满足 Astro 要求）。由于 PowerShell 执行策略限制 npm.ps1，实现时将使用 `npm.cmd` / `npx.cmd` 绕过。

## 技术选型

| 选择 | 方案 | 理由 |
|------|------|------|
| 框架 | **Astro 7** | 专为内容站点设计，默认零 JS 输出，预渲染 HTML 对 SEO 最友好 |
| 样式 | **Tailwind CSS v4** | 通过 `@tailwindcss/vite` 插件，响应式开发极简，无需 config 文件 |
| 内容 | **Markdown + Content Collections** | 用 Zod 校验 frontmatter，Git 版本管理，无需数据库/CMS |
| 部署 | 静态输出 | 构建产物为纯 HTML，可部署到任意静态托管（GitHub Pages / Vercel / Netlify / Cloudflare） |

**为什么选 Astro 而非 Next.js/Hugo**：Astro 默认输出静态 HTML 且不向客户端发送 JS，加载极快，Lighthouse 满分；Content Collections 内置类型安全；Markdown 优先，对个人博客最合适。

## 项目结构

```
yeccat_blog/
├── astro.config.mjs              # Astro 配置（site URL、sitemap、tailwind 插件）
├── package.json
├── tsconfig.json
├── public/
│   ├── robots.txt                # 允许搜索引擎抓取
│   └── favicon.svg
├── src/
│   ├── content.config.ts         # Content Collection schema（Zod 校验）
│   ├── styles/
│   │   └── global.css            # @import "tailwindcss" + 全局样式
│   ├── components/
│   │   ├── SEO.astro             # 可复用 SEO meta 组件（OG/Twitter/canonical/JSON-LD）
│   │   ├── Header.astro          # 响应式导航（移动端汉堡菜单）
│   │   ├── Footer.astro
│   │   └── PostCard.astro        # 文章列表卡片
│   ├── layouts/
│   │   └── BaseLayout.astro      # <head>、viewport、SEO 调用
│   ├── pages/
│   │   ├── index.astro           # 首页（最新文章列表）
│   │   ├── about.astro           # 关于页
│   │   ├── blog/
│   │   │   ├── index.astro       # 博客列表页（分页）
│   │   │   └── [...slug].astro   # 文章详情页（动态路由）
│   │   └── rss.xml.ts            # RSS feed 端点
│   └── data/
│       └── blog/
│           ├── welcome-to-my-blog/
│           │   └── index.md      # 示例文章 1
│           └── markdown-guide/
│               └── index.md      # 示例文章 2
```

## SEO 实现方案

1. **SSG 静态生成** — Astro 默认预渲染所有页面为 HTML，搜索引擎可直接抓取
2. **sitemap.xml** — `@astrojs/sitemap` 集成，构建时自动生成
3. **robots.txt** — 手动创建，允许全部抓取并指向 sitemap
4. **Meta 标签** — `SEO.astro` 组件统一管理：title、description、canonical、Open Graph、Twitter Card
5. **JSON-LD 结构化数据** — 文章页输出 `BlogPosting` schema，帮助搜索引擎理解内容
6. **语义化 HTML** — 正确的 `<h1>`-`<h6>` 层级、`<article>`、`<nav>`、`<main>` 等语义标签
7. **RSS feed** — `rss.xml.ts` 端点提供订阅源

## 移动端适配方案

1. **Tailwind 响应式工具类** — 移动优先（mobile-first），`sm:` `md:` `lg:` 断点适配
2. **viewport meta** — `BaseLayout.astro` 中设置 `<meta name="viewport" content="width=device-width, initial-scale=1">`
3. **流式排版** — 正文 `max-w-prose` 限制行宽，`text-base md:text-lg` 自适应字号
4. **响应式图片** — 使用 Astro 内置 `<Image>` 组件自动生成响应式图片
5. **移动端导航** — Header 在小屏下使用汉堡菜单

## 实现步骤

### 步骤 1：初始化项目骨架
手动创建 `package.json`、`tsconfig.json`、`astro.config.mjs`，配置依赖和脚本。

### 步骤 2：安装依赖
运行 `npm.cmd install` 安装：`astro`、`@astrojs/sitemap`、`@astrojs/rss`、`@astrojs/mdx`、`@tailwindcss/vite`、`tailwindcss`。

### 步骤 3：全局样式与配置
创建 `src/styles/global.css`（`@import "tailwindcss"`），在 `astro.config.mjs` 中注册 Tailwind Vite 插件和 sitemap 集成，设置 `site` 字段。

### 步骤 4：Content Collection schema
创建 `src/content.config.ts`，定义 blog 集合的 frontmatter schema（title、description、pubDatetime、tags、draft 等），使用 `glob` loader 加载 `src/data/blog/**/*.md`。

### 步骤 5：核心组件
- `SEO.astro` — 接收 title/description/image props，输出完整 meta 标签
- `Header.astro` — 响应式导航栏（含移动端菜单）
- `Footer.astro` — 版权信息、社交链接
- `PostCard.astro` — 文章卡片预览

### 步骤 6：布局与页面
- `BaseLayout.astro` — HTML 骨架、`<head>`、viewport、SEO 组件调用
- `index.astro` — 首页最新文章列表
- `blog/index.astro` — 全部文章列表
- `blog/[...slug].astro` — 文章详情页，用 `render()` 渲染 Markdown
- `about.astro` — 关于页面

### 步骤 7：RSS 与 SEO 文件
- `rss.xml.ts` — RSS feed 端点
- `public/robots.txt` — 允许抓取 + sitemap 引用
- `public/favicon.svg`

### 步骤 8：示例文章
创建 2 篇 Markdown 示例文章，含完整 frontmatter，验证内容管线。

### 步骤 9：验证
- 运行 `npm.cmd run build` 确认构建成功
- 运行 `npm.cmd run dev` 启动开发服务器
- 检查 `dist/` 输出包含 sitemap.xml、rss.xml
- 在浏览器验证移动端响应式效果

## 验证方法

1. **构建测试**：`npm.cmd run build` 成功，`dist/` 目录生成静态 HTML
2. **SEO 检查**：`dist/sitemap-index.xml` 和 `dist/rss.xml` 存在；文章页 HTML 含 OG meta、JSON-LD
3. **移动端测试**：浏览器 DevTools 切换移动设备视图，确认布局自适应、导航菜单可用
4. **内容验证**：访问 `/` 看到文章列表，点击进入文章详情页，Markdown 正确渲染
```
<!-- end of plan file content -->
