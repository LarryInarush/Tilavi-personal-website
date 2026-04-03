# Next.js 个人主页项目说明（结构与文件职责）

> 维护规则：结构以本节 **§3 目录树** 与 **§4 路由入口** 为事实来源；后续增删文件时**直接改已有条目**，不把变更堆在文末。

## 1. 项目目标（你当前实现了什么）

- **个人主页（`/`）**（实现：`src/features/home/routes/HomeLandingRoute.tsx`，由 `src/app/page.tsx` 导入）
  - 顶部 **Hero**（切片动效）+ 叠加 **Header**（Logo / 文章入口）
  - **简介**窄栏、`#section-intro`
  - **电影海报墙**通栏预览（与摄影区统一的竖版卡片尺寸；约 **2～5 列**响应式；点击海报打开液态玻璃详情；详情自点击位置缩放进出；关闭按钮改为图标按钮）
  - **摄影作品**全宽轮播（三倍轨道平移、卡片间距 24px、左右箭头 **`xl+` 对称内收** 以免挡步骤条）
  - **步骤条式导航**（`HomeSectionStepperClient`：右栏竖向步骤 + 小屏底部横向，平滑滚动锚点）
  - **五个未来模块占位**：旅行日记 / 书单 / 周杰伦时光机 / 留言版 / 想做·不想做（`HomeModulePlaceholderSection`）
  - **兴趣板块** + **最新文章**（Markdown 元数据）
- **电影列表页（`/movies`）**：分页海报墙（`max-w-7xl` 容器）、背景氛围层（服务端随机海报，无 hydration 问题）、更快的开合动效
- **文章系统**：`/posts` 列表、`/posts/[slug]` 详情（含 `generateStaticParams`）
- **内容来源**：`content/posts/*.md`
- **评论**：本阶段不接（曾规划 Giscus / Isso，见 `TECH_STACK_AND_DEPLOYMENT.md`）

## 2. 快速启动命令

在 `site/` 目录下：

```bash
npm run dev
```

构建验证：

```bash
npm run build
```

风格检查：

```bash
npm run lint
npm run format:check
```

## 3. 核心目录结构

```text
site/
  content/posts/                        # 文章 Markdown（frontmatter + 正文）
  src/
    app/                                # 仅保留路由入口、layout、全局样式与极薄 page 文件
      layout.tsx
      globals.css                       # Tailwind + 全站变量 + `.movie-detail-scroll` 等
      page.tsx                          # `/` → 导入 HomeLandingRoute
      not-found.tsx
      movies/page.tsx                   # `/movies` → 导入 MoviesIndexRoute
      posts/page.tsx                    # `/posts` → 导入 PostsIndexRoute
      posts/[slug]/page.tsx             # `/posts/[slug]` → 导入 PostDetailsRoute
    features/                           # 按功能区域组织业务代码；每个区域按需继续细分
      home/
        components/
          HomeHeroLanding.tsx
          HomeModulePlaceholderSection.tsx
          HomeMoviesPosterWallSection.tsx
          HomeSectionStepperClient.tsx
        routes/
          HomeLandingRoute.tsx          # 首页主体（Server）：锚点、模块占位、文章列表
      movies/
        components/
          MoviePosterWallClient.tsx     # 海报墙 + 详情弹窗（Client）
          MoviesBackgroundBackdrop.tsx  # `/movies` 背景（Server）
        lib/
          movies.ts                     # 电影数据层 / TMDB 增强 / 分页
        routes/
          MoviesIndexRoute.tsx          # `/movies` 页面主体（Server）
      photography/
        components/
          HomePhotographySection.tsx
          PhotographyCarouselClient.tsx # 摄影轮播（Client）
        lib/
          photography.ts                # 摄影数据层（当前仍为占位图源）
      posts/
        lib/
          posts.ts                      # Markdown content layer
        routes/
          PostDetailsRoute.tsx
          PostsIndexRoute.tsx
    shared/                             # 仅放跨功能区复用的共享资源
      components/
        brand/
          TheTilaviLogoMark.tsx
        layout/
          TheTilaviSiteHeader.tsx
  public/
    hero/hero-bg-01.jpg
    movies/posters/*.svg
    …
```

## 4. 路由对应关系

- `/` → `src/app/page.tsx` → `src/features/home/routes/HomeLandingRoute.tsx`
- `/movies` → `src/app/movies/page.tsx` → `src/features/movies/routes/MoviesIndexRoute.tsx`
- `/posts` → `src/app/posts/page.tsx` → `src/features/posts/routes/PostsIndexRoute.tsx`
- `/posts/[slug]` → `src/app/posts/[slug]/page.tsx` → `src/features/posts/routes/PostDetailsRoute.tsx`

> App Router 要求路由目录里保留 `page.tsx`；重逻辑放在 `features/` 下的 `routes/`、`components/`、`lib/` 中，避免把业务代码堆在 `app/`。

## 5. 数据流（Markdown → 页面）

1. 编辑 `content/posts/<slug>.md`
2. `src/features/posts/lib/posts.ts`：`getAllPosts()` / `getPostBySlug()`（gray-matter + remark）
3. 列表与详情路由消费 meta / HTML

## 6. 文章 frontmatter 要点

- 必填：`title`、`date`；`slug` 来自文件名
- 可选：`excerpt`、`tags`

## 7. 你接下来该改哪里（最常用）

- 首页文案与区块顺序：`src/features/home/routes/HomeLandingRoute.tsx`
- Hero：`src/features/home/components/HomeHeroLanding.tsx`
- 摄影轮播：`src/features/photography/components/PhotographyCarouselClient.tsx`；数据：`src/features/photography/lib/photography.ts`
- 电影墙与详情弹窗：`src/features/movies/components/MoviePosterWallClient.tsx`；数据：`src/features/movies/lib/movies.ts`
- `/movies` 分页与容器：`src/features/movies/routes/MoviesIndexRoute.tsx`
- 步骤条锚点列表：`src/features/home/components/HomeSectionStepperClient.tsx`（`HOME_PAGE_STEPS` 与页面 `id` 保持一致）
- Header / Logo：`src/shared/components/layout/TheTilaviSiteHeader.tsx`、`src/shared/components/brand/TheTilaviLogoMark.tsx`
- 全局滚动条样式：`src/app/globals.css`（`.movie-detail-scroll`）
- 文章：`content/posts/*.md`；文章数据层在 `src/features/posts/lib/posts.ts`

---

若后续接评论（Isso / Giscus），在 `TECH_STACK_AND_DEPLOYMENT.md` 已有落点说明。

## 8. 补充文档

- `TECH_STACK_AND_DEPLOYMENT.md`：技术栈、部署、工程准则、目录分层约定
