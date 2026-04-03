# Next.js 个人主页项目说明（结构与文件职责）

> 维护规则：结构以本节 **§3 目录树** 与 **§4 路由入口** 为事实来源；后续增删文件时**直接改已有条目**，不把变更堆在文末。

## 1. 项目目标（你当前实现了什么）

- **个人主页（`/`）**（实现：`src/components/home/HomeLandingRoute.tsx`，由 `src/app/page.tsx` 导入）
  - 顶部 **Hero**（切片动效）+ 叠加 **Header**（Logo / 文章入口）
  - **简介**窄栏、`#section-intro`
  - **电影海报墙**通栏预览（较小网格：约 **3～6 列**/响应式，点击海报打开**液态玻璃**详情；详情自**点击位置**缩放进出，`AnimatePresence` 下遮罩与卡片**分别**做 exit，关闭为**缩放收回**而非瞬关）
  - **摄影作品**全宽轮播（三倍轨道平移、卡片间距 24px、左右箭头 **`xl+` 对称内收** 以免挡步骤条）
  - **步骤条式导航**（`HomeSectionStepperClient`：右栏竖向步骤 + 小屏底部横向，平滑滚动锚点）
  - **五个未来模块占位**：旅行日记 / 书单 / 周杰伦时光机 / 留言版 / 想做·不想做（`HomeModulePlaceholderSection`）
  - **兴趣板块** + **最新文章**（Markdown 元数据）
- **电影列表页（`/movies`）**：分页海报墙（`max-w-7xl` 容器）、背景氛围层（服务端随机海报，无 hydration 问题）
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

## 3. 核心目录结构

```text
site/
  content/posts/              # 文章 Markdown（frontmatter + 正文）
  src/
    app/                      # 仅保留路由入口、layout、全局样式与按路由拆分的薄页面
      layout.tsx
      globals.css             # Tailwind + 全站变量 + `.movie-detail-scroll` 等
      page.tsx                # `/` → 导入 HomeLandingRoute
      not-found.tsx
      movies/page.tsx         # `/movies` → 导入 MoviesIndexRoute
      posts/…                 # 文章路由（极薄 page + *Route）
    components/               # 按区域划分的可复用 UI（主页 / 布局 / 电影）
      home/
        HomeLandingRoute.tsx          # 首页主体（Server）：锚点、模块占位、文章列表
        HomeHeroLanding.tsx           # Hero（Client）
        HomeMoviesPosterWallSection.tsx
        HomePhotographySection.tsx
        HomeModulePlaceholderSection.tsx
        HomeSectionStepperClient.tsx  # 步骤条导航（Client）
        PhotographyCarouselClient.tsx # 摄影轮播（Client）
      layout/
        TheTilaviSiteHeader.tsx
        TheTilaviLogoMark.tsx
      movies/
        MoviesIndexRoute.tsx          # `/movies` 页面主体（Server）
        MoviePosterWallClient.tsx     # 海报墙 + 详情弹窗（Client）
        MoviesBackgroundBackdrop.tsx  # `/movies` 背景（Server）
    lib/
      posts.ts
      movies.ts
      photography.ts
  public/
    movies/posters/*.svg
    …
```

## 4. 路由对应关系

- `/` → `src/app/page.tsx` → `src/components/home/HomeLandingRoute.tsx`
- `/movies` → `src/app/movies/page.tsx` → `src/components/movies/MoviesIndexRoute.tsx`
- `/posts` → `src/app/posts/page.tsx` → `PostsIndexRoute.tsx`
- `/posts/[slug]` → `src/app/posts/[slug]/page.tsx` → `PostDetailsRoute.tsx`

> App Router 要求路由目录里保留 `page.tsx`；重逻辑放在 `components/` 或 `*Route.tsx`，避免单层目录堆满杂文件。

## 5. 数据流（Markdown → 页面）

1. 编辑 `content/posts/<slug>.md`
2. `src/lib/posts.ts`：`getAllPosts()` / `getPostBySlug()`（gray-matter + remark）
3. 列表与详情路由消费 meta / HTML

## 6. 文章 frontmatter 要点

- 必填：`title`、`date`；`slug` 来自文件名
- 可选：`excerpt`、`tags`

## 7. 你接下来该改哪里（最常用）

- 首页文案与区块顺序：`src/components/home/HomeLandingRoute.tsx`
- 摄影轮播：`src/components/home/PhotographyCarouselClient.tsx`；数据：`src/lib/photography.ts`
- 电影墙与详情弹窗：`src/components/movies/MoviePosterWallClient.tsx`；首页预览上限等：`src/lib/movies.ts`（如 `getHomeMoviePosters`）
- `/movies` 分页与容器宽度：`src/components/movies/MoviesIndexRoute.tsx`
- 步骤条锚点列表：`src/components/home/HomeSectionStepperClient.tsx`（`HOME_PAGE_STEPS` 与页面 `id` 保持一致）
- 全局滚动条样式：`src/app/globals.css`（`.movie-detail-scroll`）
- 文章：`content/posts/*.md`；列表/详情路由在 `src/app/posts/`

---

若后续接评论（Isso / Giscus），在 `TECH_STACK_AND_DEPLOYMENT.md` 已有落点说明。

## 8. 补充文档

- `TECH_STACK_AND_DEPLOYMENT.md`：技术栈、部署、工程约定
