<!--
  文件用途：
  1) 作为“项目技术方案总说明”，给任何后续接手/借助工具进行开发的人快速建立全局认知。
  2) 汇总当前 Next.js 个人主页项目的前后端实现方式、内容模型、目录结构设计、部署准备与注意事项。
  3) 规划评论功能的接入工具与未来落地点（当前先不做评论功能）。
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

## 1. 项目目标与当前已实现的功能
### 1.1 网站定位
这是一个个人网站，主要用于：
- 介绍你自己
- 展示/分享有趣内容方向（如摄影、滑板、随笔）
- 发布文章（文章内容由本地 Markdown 维护）

### 1.2 当前已实现的主要页面/能力
- `/`：主页
  - 自我介绍（窄栏）、电影海报墙（较宽通栏）、摄影作品横向条（`w-screen` 通栏：中间三张清晰、最外侧模糊；高行高约 4× 原预览；Cormorant 标题 + 滚动入场）、兴趣板块与最新文章（窄栏）
  - 展示“最新文章”（从本地 Markdown 读取）
- `/movies`
  - 电影海报墙：支持 hover 动效、点击弹出详情卡片、并提供分页（`?page=`）
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
  - 首页 Hero 首次进入动效使用 `framer-motion`（保证动画在客户端稳定触发）
  - 摄影栏目标题：`framer-motion` 的 `whileInView` 入场；海报墙/轮播等交互同依赖 `framer-motion`
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
- 数据：`site/src/lib/movies.ts`（电影列表 + 分页逻辑）
- 海报资源：`site/public/movies/posters/`
  - 当前仓库内为“自制 SVG 海报”，用于占位与统一风格
  - 你可以替换成真实海报（jpg/png/webp），只需保持路径与 `posterSrc` 对应即可
- TMDB 增强（可选）：
  - 当配置 `TMDB_API_KEY` 后，`getMoviesCatalog()` 会并行请求 `zh-CN`（`append_to_response=credits`）与 `en-US`，合并海报、中英文简介/tagline、片长、评分、上映日、国家、导演与主要演员等；任一步失败则单条回退本地数据
  - 海报 URL 仍优先 TMDB `w780`（失败回退 `public/movies/posters/`）
- 摄影模块（占位）：
  - `src/lib/photography.ts` 的 `getPhotographyItems()` 当前复用上述电影海报 URL；替换为真实作品时只需改该数据层
  - UI：`PhotographyCarouselClient`；首页外层用 `HomeLandingRoute` 中 `left-1/2 -mx-[50vw] w-screen` 做视口全宽通栏

### 2.3 Markdown 解析链路
- frontmatter：`gray-matter`
- Markdown -> HTML：`remark` + `remark-html`

## 3. “前后端怎么做”：本项目的后端是什么
在这个项目里，“后端”不是传统意义的独立服务（没有数据库/独立 API）。
它由 Next.js 的服务器运行能力承担，具体体现为：
- 服务端读取本地文件系统（读取 `content/posts` 目录与对应 md 文件）
- 服务端执行 Markdown 转换生成 HTML
- 服务端根据 slug 渲染文章详情页面

因此：
- 客户端（浏览器）只负责展示与交互（当前主要是导航与展示）
- 服务端（Next.js 在构建/请求时）负责“内容读取与转换”

> 注意：当前正文使用 `dangerouslySetInnerHTML` 渲染。由于内容来自你本地维护的 Markdown，风险可控；如果未来引入不可信内容，则需要补充 HTML Sanitization 策略。

## 4. 项目结构设计（目录与职责）
项目根目录为 `site/`，关键目录如下：

- `site/content/posts/*.md`
  - 文章内容（frontmatter + Markdown 正文）
- `site/src/lib/posts.ts`
  - 文章数据层：读取文件、解析 frontmatter、渲染 Markdown -> HTML
- `site/src/app/`
  - 路由入口与业务组件拆分

路由组织方式（当前约定）：
- `/`：
  - `src/app/page.tsx` 作为入口薄包装
  - 主要 UI/数据读取在 `src/app/HomeLandingRoute.tsx`
- `/posts`：
  - `src/app/posts/page.tsx` 作为入口薄包装
  - 主要实现 `src/app/posts/PostsIndexRoute.tsx`
- `/posts/[slug]`：
  - `src/app/posts/[slug]/page.tsx` 作为入口薄包装 + `generateStaticParams`
  - 主要实现 `src/app/posts/[slug]/PostDetailsRoute.tsx`

结构细节以 `site/PROJECT_STRUCTURE.md` 为准（此文档是“总览版”，但当细节冲突时以结构文件为事实来源）。

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
   - 后续如果接入评论（Giscus）可能才会用到配置项（见第 7 节）

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

> 具体到你使用的“宝塔面板”的按钮和目录路径，需要你在部署时按面板习惯再落地。这里重点记录“部署逻辑与注意点”，避免对方不知道目标做什么。

## 6. 构建/启动命令（当前 package.json）
位于 `site/package.json`：
- 开发：`npm run dev`（Next.js 开发模式）
- 构建：`npm run build`
- 生产启动：`npm run start`
- Lint：`npm run lint`（当前配置由 eslint-config-next 驱动）

## 6.1 TMDB API Key 配置（你拿到 key 后怎么做）
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
- `src/app/posts/[slug]/PostDetailsRoute.tsx`
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

## 8. 工程准则（你提出的 4 条要求）
下面是你要求的规则原意与我对执行方式的补充说明：

### 8.1 新增文件：文件最上方必须有用途注释
执行方式：
- 每新增一个文件，在文件顶部使用注释（MD 文件用 HTML 注释或大段开头说明；代码文件用常见文件头注释）写清：
  - 这个文件干嘛
  - 大致负责什么职责
  - 对应到哪个路由/模块（如果适用）

### 8.2 函数/特殊功能：尽可能详细注释
执行方式：
- 对非显然逻辑写清楚“输入/输出/为什么这么做/注意事项”
- 对关键边界写清楚“失败时行为、异常处理、兼容性假设”

### 8.3 命名避免重名：文件名体现位置与功能
执行方式：
- 尽量用语义化文件名，避免出现“很多个地方都叫 `page.tsx`（这是 Next.js 必需例外）”
- 除 Next.js 强制入口文件名以外，其他实现尽量用 `*Route.tsx` / `*Page.tsx` / `*Service.ts` 等语义命名，体现模块职责与位置

### 8.4 完成功能后更新 `@site/PROJECT_STRUCTURE.md`
执行策略（与当前约定一致）：
- 只有当“结构/职责分工发生变化”才更新 `PROJECT_STRUCTURE.md`
- 若涉及重构、拆分、合并、移动文件等导致结构变化，也必须同步更新结构文档

## 9. 接手开发时的快速检查清单
当你或其他工具/开发者准备扩展功能时，建议先确认：
1. 你要改的是“内容层”（`content/posts`）还是“渲染层”（`src/app`）还是“数据层”（`src/lib`）
2. 新增文件是否需要遵循四条准则（文件头注释、关键逻辑注释、命名规范）
3. 如果修改导致路由职责拆分/合并，是否需要更新 `site/PROJECT_STRUCTURE.md`
4. 若使用了 `dangerouslySetInnerHTML`，未来是否会引入不可信输入（如果会，需要 sanitize）

## 10. 未来扩展建议（非必须，但建议方向）
为了让你后续扩展摄影/滑板内容更顺畅，可以考虑：
- 将“兴趣板块”从现在的入口链接扩展为：按 tag/分类过滤文章列表
- 如果要做“摄影图片画廊”，可以：
  - 继续用 Markdown 作为内容管理单元
  - 在 `public/` 或专门目录放图片资源，或用 URL 引用图片
- 若未来确实需要“真正后端”（登录、评论、表单等），再在部署方案中增加对应服务（Giscus 已足够轻量；表单可考虑第三方服务）

