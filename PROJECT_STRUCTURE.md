# Next.js 个人主页项目说明（结构与文件职责）

> 维护规则：如果后续你新增文件或改动目录结构，我会在你继续让我修改项目时同步更新本文件，保证它始终是“当前结构的事实来源”。

## 1. 项目目标（你当前实现了什么）

- 个人主页（`/`）：自我介绍 + 兴趣板块入口 + 最新文章（读取本地 Markdown）。
- 文章系统：
  - 文章列表页（`/posts`）
  - 文章详情页（`/posts/[slug]`）
- 内容由你本地维护：所有文章来源于 `content/posts/*.md`。
- 评论系统（`Isso`）本轮先不做，后续再接。

## 2. 快速启动命令

在 `site/` 目录下运行：

```bash
npm run dev
```

构建验证（你/我会用它确认路由与类型无问题）：

```bash
npm run build
```

## 3. 核心目录结构

```text
site/
  content/
    posts/
      *.md                      # 你的文章内容（frontmatter + Markdown 正文）
  src/
    app/
      layout.tsx                # 根布局：HTML/Body 包裹 + 全局 metadata
      globals.css              # Tailwind 入口 + 少量全局变量
      not-found.tsx            # 404 页面（Next.js App Router）
      page.tsx                 # 路由入口 `/`（极薄）
      HomeLandingRoute.tsx    # `/` 页面真正的 UI 与数据读取（语义化文件名）
      HomeHeroLanding.tsx     # 首页顶部 Hero（方案 C：照片切片 + 首次进入动效；承载品牌/双语介绍）
      TheTilaviSiteHeader.tsx # 站点 Header（叠加在 Hero 上的极简导航层）
      TheTilaviLogoMark.tsx   # TheTilavi Logo SVG mark（霓虹/酸性风格）
      posts/
        page.tsx               # 路由入口 `/posts`（极薄）
        PostsIndexRoute.tsx   # `/posts` 列表的真正实现
        [slug]/
          page.tsx            # 路由入口 `/posts/[slug]`（含 generateStaticParams）
          PostDetailsRoute.tsx# 详情页真正的 UI 与 Markdown 渲染
    lib/
      posts.ts                 # 数据层：读取 content/posts/*.md 并解析
  public/
    *.svg / *.ico             # 静态资源（图标等）
```

## 4. 路由对应关系（非常重要）

- `/`
  - 入口：`src/app/page.tsx`
  - 实现：`src/app/HomeLandingRoute.tsx`
- `/posts`
  - 入口：`src/app/posts/page.tsx`
  - 实现：`src/app/posts/PostsIndexRoute.tsx`
- `/posts/[slug]`
  - 入口：`src/app/posts/[slug]/page.tsx`
  - 实现：`src/app/posts/[slug]/PostDetailsRoute.tsx`

> 说明：Next.js App Router 要求路由入口必须叫 `page.tsx`，因此你会看到它仍然存在；但为了避免“到处都是 page.tsx 大段代码”，我们把主要 UI 逻辑拆到了语义化命名文件里。

## 5. 数据流（从 Markdown 到页面）

1. 你添加/修改文章文件：`content/posts/<slug>.md`
2. 数据层 `src/lib/posts.ts` 做两件事：
   - `getAllPosts()`：读取所有 `.md`，解析 frontmatter，返回列表 meta（title/date/excerpt/tags/slug）
   - `getPostBySlug(slug)`：读取某个 `.md`，解析 frontmatter，并把 Markdown 转成 HTML（`contentHtml`）
3. 路由层：
   - `/posts` 使用 meta 渲染列表卡片
   - `/posts/[slug]` 使用 `contentHtml` 渲染详情正文

## 6. 文章文件格式模板（frontmatter 要点）

每篇文章文件建议结构如下：

```md
---
title: "文章标题"
date: "2026-04-02"
excerpt: "列表摘要（可选）"
tags: ["摄影", "滑板"]  # tags 可选
---

你的 Markdown 正文...
```

注意：
- `title`、`date` 现在是必须的（用于排序和展示）。
- `slug` 由文件名决定（去掉 `.md`）。

## 7. 你接下来该改哪里（最常用）

- 改主页文案/布局：`src/app/HomeLandingRoute.tsx`
- 新增文章：新增 `content/posts/*.md` 文件
- 改文章列表页文案：`src/app/posts/PostsIndexRoute.tsx`
- 改文章详情页样式/渲染区域：`src/app/posts/[slug]/PostDetailsRoute.tsx`

---

如果你后续准备接评论系统（`Isso`），我们会补两块内容：
- 服务器端：在 Ubuntu 上部署 `Isso`
- 前端：在 `/posts/[slug]` 页面加入 Isso 的嵌入容器（按 thread id 绑定页面路径）

## 8. 补充文档（给接手开发者快速扫一眼）
- `TECH_STACK_AND_DEPLOYMENT.md`：汇总当前技术栈、前后端职责、部署准备、评论规划（Giscus 方向）、以及工程准则说明。

