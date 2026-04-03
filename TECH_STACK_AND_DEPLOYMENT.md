<!--
  文件用途：
  1) 作为“项目技术方案总说明”，给任何后续接手/借助工具进行开发的人快速建立全局认知。
  2) 汇总当前 Next.js 个人主页项目的前后端实现方式、内容模型、目录结构设计、部署准备与注意事项。
  3) 作为整个项目的长期开发准则文件；后续功能迭代主要更新事实变化较大的小段落，不频繁改动整体规则。
  4) 规划评论功能的接入工具与未来落地点（当前先不做评论功能）。
-->

# Next.js 个人网站：技术方案 / 部署说明（总览）

## 0. 文档适用范围

本说明文档面向以下几类场景：

1. 你自己过一段时间回来看项目时，能快速知道“现在到底怎么搭的、下一步怎么加功能”。
2. 你希望借助其他工具/人继续开发某个模块时，对方能看完文档后明确：
   - 应该改哪些文件
   - 如何遵循工程约定
   - 部署时有哪些关键点
   - 评论功能之后该怎么接（当前不要求实现）
3. 你在每次完成功能后，需要快速核对“哪些结构文档必须同步更新”。

## 1. 项目目标与当前已实现的功能

### 1.1 网站定位

这是一个个人网站，主要用于：

- 介绍你自己
- 展示/分享有趣内容方向（如摄影、滑板、随笔）
- 发布文章（文章内容由本地 Markdown 维护）

### 1.2 当前已实现的主要页面/能力

- `/`：主页（业务代码主要位于 `src/features/home/`、`src/features/photography/`）
  - 自我介绍（窄栏）、电影海报墙（与摄影区统一的竖版卡片尺寸，约 **2～5 列**响应式）、摄影作品横向条、`HomeSectionStepperClient` 锚点导航、五个 `HomeModulePlaceholderSection` 占位、兴趣板块与最新文章
  - 展示“最新文章”（从本地 Markdown 读取）
- `/movies`
  - 电影海报墙：hover、分页（`?page=`）、容器 `max-w-7xl`
  - 详情（`src/features/movies/components/MoviePosterWallClient.tsx`）：液态玻璃；自点击海报中心 scale 进出场；开合速度已调快；关闭按钮为图标按钮；左栏 `object-cover`；正文 `.movie-detail-scroll`
- `/posts`
  - 文章列表页：读取所有 Markdown frontmatter，渲染列表卡片
- `/posts/[slug]`
  - 文章详情页：读取单篇 Markdown，渲染正文 HTML

### 1.3 评论功能（当前阶段明确不做）

当前项目结构中已预留“未来接评论”的思路，但**本阶段先不接入评论组件**。

## 2. 技术栈概览

### 2.1 前端/渲染技术（Next.js）

- 框架：`Next.js`（App Router）
- 语言：`TypeScript`
- 样式：`Tailwind CSS`
- 动效/交互：
  - 首页 Hero、电影弹层、摄影轮播均使用 `framer-motion`
- 字体（`next/font/google`）：
  - 正文/UI：`Geist` / `Geist Mono`
  - 摄影区块标题：`Cormorant Garamond`（`layout.tsx` 注入 `--font-photo-display`，`globals.css` 中 `.font-photo-display`）
- 渲染方式：
  - 页面为 Server Components（默认）
  - 文章详情的 Markdown 内容会在服务端读取并转换为 HTML，再在页面中通过 `dangerouslySetInnerHTML` 渲染

### 2.2 内容与数据来源（Markdown Content Layer）

文章来源：`site/content/posts/*.md`
每篇文章文件通常包含：

```md
---
title: "文章标题"
date: "2026-04-02"
excerpt: "列表摘要（可选）"
tags: ["摄影", "滑板"]
---

你的 Markdown 正文...
```

数据层逻辑（当前实现）负责两类任务：

1. 读取所有文章的 frontmatter，形成列表 meta（给 `/` 与 `/posts` 用）
2. 读取单篇文章的内容并渲染 Markdown -> HTML（给 `/posts/[slug]` 用）

电影内容（本地数据源）：

- 数据：`site/src/features/movies/lib/movies.ts`
- 海报资源：`site/public/movies/posters/`
  - 当前仓库内为“自制 SVG 海报”，用于占位与统一风格
  - 你可以替换成真实海报（jpg/png/webp），只需保持路径与 `posterSrc` 对应即可
- TMDB 增强（可选）：
  - 当配置 `TMDB_API_KEY` 后，`getMoviesCatalog()` 会并行请求 `zh-CN`（`append_to_response=credits`）与 `en-US`，合并海报、中英文简介/tagline、片长、评分、上映日、国家、导演与主要演员等；任一步失败则单条回退本地数据
  - 海报 URL 仍优先 TMDB `w780`（失败回退 `public/movies/posters/`）

摄影模块（占位）：

- 数据：`src/features/photography/lib/photography.ts`（当前复用电影海报 URL）
- UI：`src/features/photography/components/PhotographyCarouselClient.tsx`
- 轮播：**三倍轨道** + `translateX` 平移；`TRACK_GAP_PX = 24`；`xl+` **左右箭头对称内收**，避免与步骤条重叠

### 2.3 Markdown 解析链路

- frontmatter：`gray-matter`
- Markdown -> HTML：`remark` + `remark-html`

### 2.4 代码风格与检查工具

- `ESLint`：项目级静态检查（Flat Config）
- `Prettier`：项目级格式化
- `prettier-plugin-tailwindcss`：统一 Tailwind 类名顺序
- `.editorconfig`：统一基础缩进、换行、结尾换行等编辑器行为

## 3. “前后端怎么做”：本项目的后端是什么

在这个项目里，“后端”不是传统意义的独立服务（没有数据库/独立 API）。
它由 Next.js 的服务器运行能力承担，具体体现为：

- 服务端读取本地文件系统（读取 `content/posts` 目录与对应 md 文件）
- 服务端执行 Markdown 转换生成 HTML
- 服务端根据 slug 渲染文章详情页面
- 服务端在有 `TMDB_API_KEY` 时直接请求第三方 TMDB API

因此：

- 客户端（浏览器）只负责展示与交互
- 服务端（Next.js 在构建/请求时）负责“内容读取与转换”以及第三方增强数据获取

> 注意：当前正文使用 `dangerouslySetInnerHTML` 渲染。由于内容来自你本地维护的 Markdown，风险可控；如果未来引入不可信内容，则需要补充 HTML Sanitization 策略。

## 4. 项目结构设计（目录与职责）

项目根目录为 `site/`，关键结构如下：

- `site/content/posts/*.md` — 文章内容
- `site/src/app/` — **路由专用**：`page.tsx`、`layout.tsx`、`globals.css`、按 URL 拆分的薄入口
- `site/src/features/` — **按功能区域组织业务代码**；每个功能区内部按需细分
  - 常见子目录：`components/`、`routes/`、`lib/`
  - 可选扩展：`styles/`、`assets/`、`images/`、`constants/`、`types/`
  - 原则：**按需创建，不强行造空文件夹**
- `site/src/shared/` — **只放跨功能区复用的共享资源**（例如全站 Header、Logo、共享图标、共享 hooks 等）

路由组织方式（当前约定）：

- `/`：`src/app/page.tsx` → `src/features/home/routes/HomeLandingRoute.tsx`
- `/movies`：`src/app/movies/page.tsx` → `src/features/movies/routes/MoviesIndexRoute.tsx`
- `/posts`：`src/app/posts/page.tsx` → `src/features/posts/routes/PostsIndexRoute.tsx`
- `/posts/[slug]`：`src/app/posts/[slug]/page.tsx` → `src/features/posts/routes/PostDetailsRoute.tsx`

结构细节以 `site/PROJECT_STRUCTURE.md` §3 为准（冲突时以该树为准）。

## 5. 部署方案（准备部署到哪里）

本项目部署分两条路线：推荐路线（Vercel）与自建路线（云服务器）。

### 5.1 推荐：部署到 Vercel（开发者体验优先）

建议原因：

- Next.js 与 Vercel 的集成成熟
- 构建/部署流程通常更省心
- 更少运维工作

建议准备：

1. 将代码托管到 GitHub（如果尚未）
2. 在 Vercel 创建项目，导入仓库
3. 确认构建命令：
   - `npm run build`
4. 确认输出（Vercel 自动处理 Next.js）
5. 环境变量：
   - 当前项目基本不依赖环境变量
   - 电影 TMDB 增强需要 `TMDB_API_KEY`
   - 后续如果接入评论（Giscus）可能会新增配置项（见第 7 节）

### 5.2 备选：部署到云服务器（面向你购买的云主机/宝塔/反向代理）

适用情况：

- 你希望完全自建部署（或暂时不走 Vercel）

典型准备清单（概念层面）：

1. 服务器环境：
   - Node.js（与项目要求兼容）
   - 反向代理（例如 Nginx）
2. 应用运行：
   - `npm ci --only=production`
   - `npm run build`
   - 使用 `next start` 启动生产服务
3. 反向代理：
   - Nginx 把域名流量转发给 Next.js 服务端口
4. HTTPS：
   - 通过证书/面板配置保证 HTTPS

> 具体到你使用的“宝塔面板”的按钮和目录路径，需要你在部署时按面板习惯再落地。这里重点记录“部署逻辑与注意点”。

## 6. 构建 / 启动 / 代码风格命令（当前 package.json）

位于 `site/package.json`：

- 开发：`npm run dev`
- 构建：`npm run build`
- 生产启动：`npm run start`
- Lint：`npm run lint`
- Lint 自动修复：`npm run lint:fix`
- 格式化：`npm run format`
- 格式检查：`npm run format:check`

### 6.1 TMDB API Key 配置（你拿到 key 后怎么做）

1. 在 `site/` 目录下创建 `.env.local`
2. 添加一行：

```bash
TMDB_API_KEY=你的_tmdb_api_key
```

3. 重启开发服务（如果已在运行，先 Ctrl+C 再 `npm run dev`）
4. 打开 `/movies` 验证：
   - 如果 key 可用：海报会优先显示 TMDB 海报
   - 如果 key 无效或网络失败：会自动回退到本地 `public/movies/posters/*.svg`

## 7. 评论功能规划（当前不接入，但要能看懂未来怎么做）

### 7.1 选择的工具：Giscus

你已经选择评论方案为 `Giscus`，其核心特点：

- 评论数据存储/管理在 GitHub Discussions
- 前端通过嵌入脚本/组件的方式展示评论
- 不需要你为评论功能额外维护独立后端服务

### 7.2 未来接入时的落地点（预计）

评论最自然的接入点是：

- `src/features/posts/routes/PostDetailsRoute.tsx`
- 文章正文渲染区域结束后追加评论组件容器

### 7.3 未来接入时需要的配置项

当你开始接入 Giscus 时，通常需要以下信息（以你的实际 Giscus 配置为准）：

- GitHub 仓库（用于承载 Discussions）
- Discussions 的分类/ID（如需要）
- 评论与文章的映射策略（常见做法：按 `pathname` 将每篇文章绑定到唯一 thread）
- 如果需要的话，提供 repo/category 的环境变量或写死在配置文件

### 7.4 当前阶段的承诺

- 本阶段不实现评论 UI/后端
- 本阶段只保证：当你准备开始接评论时，我们能准确知道“应该改哪里、需要哪些配置、注意哪些边界条件”

## 8. 工程准则（长期有效）

下面这些规则属于**整个项目的长期准则**。以后开发时默认遵守；该节本身通常只做小幅补充，不频繁重写。

### 8.1 每次完成功能后，必须同步更新两个结构文档

每次更新完项目之后，都要同步检查并按需更新：

- `site/PROJECT_STRUCTURE.md`
- `site/TECH_STACK_AND_DEPLOYMENT.md`

目的：方便你未来切换到别的 agent / 开发者时，对方能立刻接手，不需要重新扫仓库猜结构。

执行方式：

- **结构、路由、文件职责变了** → 两个文档都要更新
- **仅是纯文案微调、样式微调、无结构变化** → 通常只需很小改动，甚至无需改 `PROJECT_STRUCTURE.md`
- 更新文档时优先直接修改已有段落，不在文末堆一大串变更日志

### 8.2 新增文件：文件最上方必须有用途注释

执行方式：

- 每新增一个文件，在文件顶部写清：
  - 这个文件干嘛
  - 它负责哪个功能区域 / 路由
  - 为什么放在这个目录下

### 8.3 函数 / 特殊交互：尽可能详细注释

执行方式：

- 对非显然逻辑写清楚：输入 / 输出 / 为什么这么做 / 注意事项
- 对关键边界写清楚：失败时行为、异常处理、兼容性假设
- 对复杂动画、滚动行为、共享元素过渡等，要说明“为什么这样组织结构”

### 8.4 目录必须按功能区域组织，不把业务文件堆在通用 `components/`

这是本项目现在非常重要的约定：

- **`src/features/`**：放业务功能区代码，例如 `home`、`movies`、`photography`、`posts`
- **`src/shared/`**：只放跨功能区复用的共享内容
- 不要把某个页面专用的业务组件继续塞回通用 `src/components/`

判断标准：

- 如果一个组件 / 数据层 / 常量只服务某个功能区，就放到对应 `feature` 里
- 只有跨多个功能区复用，才进入 `shared/`

### 8.5 功能区内部继续细分，但按需建目录

在某个功能区内部，可以继续按职责拆分，例如：

- `components/`
- `routes/`
- `lib/`
- `styles/`
- `assets/`
- `images/`
- `constants/`
- `types/`

原则：

- **按需创建，不强行照模板堆空目录**
- 如果某个 feature 里暂时没有独立 `styles/`、`assets/`，就不要硬建
- 但一旦某一类文件开始增多，就应及时归类，不要继续平铺

### 8.6 `app/` 目录必须保持“极薄路由入口”

执行方式：

- `src/app/**/page.tsx` 只做路由入口、参数转发、极少量元数据声明
- 真正的页面业务逻辑放到 `src/features/<feature>/routes/`
- 页面专属复杂组件放到对应 feature 的 `components/`

### 8.7 共享资源与业务资源边界要清楚

建议标准：

- `shared`：Header、Logo、通用 Icon、通用 hooks、通用 utils
- `features/<name>`：该区域独有的 UI、数据源、样式、图片、局部常量

### 8.8 样式、图片、静态资源要尽量就近归属

执行方式：

- 纯页面/功能区专属资源，优先跟随对应 feature 归档
- 面向浏览器直接访问的静态文件，继续放 `public/`
- 若后续某个功能区拥有大量专属图片、局部样式、局部常量，就在该 feature 内继续分出 `images/`、`styles/`、`constants/` 等子目录

### 8.9 命名避免重名：文件名体现位置与功能

执行方式：

- 除 Next.js 强制入口文件名外，其他实现尽量用 `*Route.tsx`、`*Section.tsx`、`*Client.tsx`、`*Service.ts` 等语义命名
- 命名要让人一眼看出：它属于哪个功能区、解决什么问题

### 8.10 风格统一依赖项目配置，而不是依赖某个编辑器习惯

执行方式：

- 提交或交付前至少运行一次：
  - `npm run lint`
  - `npm run format:check`
- 需要修复时使用：
  - `npm run lint:fix`
  - `npm run format`
- 让规则由项目接管，而不是依赖“这个开发者恰好装了某个插件”

### 8.11 使用 `dangerouslySetInnerHTML` 时要明确内容可信边界

当前可以接受，因为正文来自你本地维护的 Markdown。
但如果未来内容来源变成用户输入、第三方同步或远程 CMS，必须补充 sanitize 方案。

## 9. 接手开发时的快速检查清单

当你或其他工具 / 开发者准备扩展功能时，建议先确认：

1. 你要改的是哪个功能区：`home`、`movies`、`photography`、`posts` 还是 `shared`
2. 新增文件是否写了文件头用途注释
3. 是否把文件放到了正确的功能区域目录，而不是错误地塞进通用目录
4. 如果目录职责、文件位置、路由指向变了，是否同步更新了：
   - `site/PROJECT_STRUCTURE.md`
   - `site/TECH_STACK_AND_DEPLOYMENT.md`
5. 若使用了 `dangerouslySetInnerHTML`，未来是否会引入不可信输入（如果会，需要 sanitize）
6. 是否执行了 `npm run lint` 与 `npm run format:check`

## 10. 未来扩展建议（非必须，但建议方向）

为了让你后续扩展摄影 / 滑板 / 旅行内容更顺畅，可以考虑：

- 将“兴趣板块”从现在的入口链接扩展为：按 tag / 分类过滤文章列表
- 如果要做“摄影图片画廊”，可以：
  - 继续用 Markdown 作为内容管理单元
  - 在 `public/` 或 `src/features/photography/` 下进一步拆出图片与元数据目录
- 若未来确实需要“真正后端”（登录、评论、表单等），再在部署方案中增加对应服务（Giscus 已足够轻量；表单可考虑第三方服务）
