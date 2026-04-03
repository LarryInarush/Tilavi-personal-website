# Next.js 个人主页项目说明（结构与文件职责）

> 维护规则：如果后续你新增文件或改动目录结构，我会在你继续让我修改项目时同步更新本文件，保证它始终是“当前结构的事实来源”。

## 1. 项目目标（你当前实现了什么）

- 个人主页（`/`）：自我介绍 + 电影通栏 + 摄影横向陈列（视口全宽、中间三张清晰；箭头切换时为**整条轨道平移**的轮播，卡片间距约 24px）+ **步骤条式页面导航**（点击平滑滚动至锚点）+ **五大未来模块占位**（旅行日记 / 书单 / 周杰伦时光机 / 留言版 / 想做与不想做）+ 兴趣板块 + 最新文章（读取本地 Markdown）。
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
      layout.tsx                # 根布局：HTML/Body + Geist / Cormorant（`--font-photo-display`，摄影标题）
      globals.css              # Tailwind 入口 + 少量全局变量
      not-found.tsx            # 404 页面（Next.js App Router）
      page.tsx                 # 路由入口 `/`（极薄）
      HomeLandingRoute.tsx    # `/` 页面真正的 UI 与数据读取（语义化文件名；挂载锚点 id、占位模块与步骤条）
      HomeSectionStepperClient.tsx # 首页 Client：步骤条式锚点导航（右栏竖向 / 底部横向），滚动高亮当前段
      HomeModulePlaceholderSection.tsx # 首页未来模块占位：大号标题 + 宽/高区块，供旅行/书单等预留
      HomeHeroLanding.tsx     # 首页顶部 Hero（方案 C：照片切片 + 首次进入动效；承载品牌/双语介绍）
      HomeMoviesPosterWallSection.tsx # 首页电影海报墙栏目（9 张预览，标题跳转 `/movies`）
      HomePhotographySection.tsx      # 首页摄影作品栏目（占位图来自电影海报，数据源见 `lib/photography.ts`）
      PhotographyCarouselClient.tsx   # 摄影横向轮播：三倍条目轨道 + translateX 平移（循环无缝）、卡片间距 24px、中间三张清晰/仅最外侧模糊、全屏（仅居中卡挂 layoutId）、标题滚动入场
      TheTilaviSiteHeader.tsx # 站点 Header（叠加在 Hero 上的极简导航层）
      TheTilaviLogoMark.tsx   # TheTilavi Logo SVG mark（霓虹/酸性风格）
      posts/
        page.tsx               # 路由入口 `/posts`（极薄）
        PostsIndexRoute.tsx   # `/posts` 列表的真正实现
        [slug]/
          page.tsx            # 路由入口 `/posts/[slug]`（含 generateStaticParams）
          PostDetailsRoute.tsx# 详情页真正的 UI 与 Markdown 渲染
      movies/
        page.tsx               # 路由入口 `/movies`（极薄，支持 `?page=`）
        MoviesIndexRoute.tsx   # `/movies` 页面实现：分页 + 海报墙
        MoviePosterWallClient.tsx # 海报墙交互层：滚动入场/hover/点击详情卡片（复用）
        MoviesBackgroundBackdrop.tsx # `/movies` 背景氛围层：服务端随机海报融入暗黑霓虹底色（避免 hydration mismatch）
    lib/
      posts.ts                 # 数据层：读取 content/posts/*.md 并解析
      movies.ts                # 电影数据层：列表 + 分页；可选 TMDB 拉取海报与 credits/简介等
      photography.ts           # 摄影数据层：当前复用电影海报 URL 作占位，便于日后替换真实作品
  public/
    *.svg / *.ico             # 静态资源（图标等）
    movies/
      posters/*.svg            # 电影海报资源（当前为自制 SVG，可替换为真实海报）
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
- 改摄影条样式/动效：`src/app/PhotographyCarouselClient.tsx`；摄影数据：`src/lib/photography.ts`
- 新增文章：新增 `content/posts/*.md` 文件
- 改文章列表页文案：`src/app/posts/PostsIndexRoute.tsx`
- 改文章详情页样式/渲染区域：`src/app/posts/[slug]/PostDetailsRoute.tsx`

---

如果你后续准备接评论系统（`Isso`），我们会补两块内容：
- 服务器端：在 Ubuntu 上部署 `Isso`
- 前端：在 `/posts/[slug]` 页面加入 Isso 的嵌入容器（按 thread id 绑定页面路径）

## 8. 补充文档（给接手开发者快速扫一眼）
- `TECH_STACK_AND_DEPLOYMENT.md`：汇总当前技术栈、前后端职责、部署准备、评论规划（Giscus 方向）、以及工程准则说明。

## 9. 开发变更记录（最近）
- **2026-04-03**：摄影轮播交互优化（`PhotographyCarouselClient.tsx`）
  - 左右箭头：由「重排 slot + 易触发的逐项入场感」改为 **`motion`/`framer-motion` 的 `animate` 驱动整条轨道 `x` 平移**；条目在 DOM 中为三倍拼接，首尾循环时在边界多走一步后**无动画跳回**中间段，避免整圈闪跳。
  - 视觉：卡片间距由约 `gap-2` 调整为 **`TRACK_GAP_PX = 24`**；`layoutId` 仅在当前**物理居中**的一张上启用，避免三倍轨道上重复 `layoutId`。
  - 目录结构未新增文件，职责仍见上文 `PhotographyCarouselClient.tsx` 条目。
- **2026-04-03（续）**：首页模块占位 + 步骤条导航 + 电影详情海报布局
  - 新增 `HomeSectionStepperClient.tsx`：`HOME_PAGE_STEPS` 与 `section-intro` / `section-movies` / `section-photography` / `module-*` / `interests` / `section-posts` 对齐；点击 `scrollTo` 平滑滚动；`scroll` 监听高亮当前段；`xl+` 右侧竖向节点连线，小屏底部横向胶囊列表；`main` 增加 `pb-28` 避免遮挡底部导航。
  - 新增 `HomeModulePlaceholderSection.tsx`：五个宽版加高占位区（旅行日记、看过的书、周杰伦时光机、留言版、想做的事·不想做的事）。
  - `HomeLandingRoute.tsx`：为上述区块挂载 `id` 与 `scroll-mt-*`。
  - `movies/MoviePosterWallClient.tsx`：详情弹窗左侧由 **窄 grid + `object-cover`** 改为 **flex 侧栏 + `object-contain` + 更大 `max-w`**，避免竖版海报被裁切或挤压。

