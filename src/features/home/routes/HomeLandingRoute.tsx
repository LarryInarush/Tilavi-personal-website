/**
 * File: `src/features/home/routes/HomeLandingRoute.tsx`
 * Purpose:
 * - 提供 `/`（个人主页）的“主要渲染内容”。
 *
 * 为什么存在这个文件？
 * - Next.js App Router 强制 `src/app/page.tsx` 作为根路由入口。
 * - 但根路由入口文件应该尽量薄，因此把真正的 UI 和数据读取拆到这里。
 *
 * 数据来源：
 * - 调用 `getAllPosts()`（来自 `src/features/posts/lib/posts.ts`）读取 `content/posts/*.md` 的元数据。
 * - 电影与摄影占位图来自各自功能区的数据层：`src/features/movies/lib/movies.ts` 与 `src/features/photography/lib/photography.ts`。
 *
 * 注意：
 * - 你随时可以改这里的文案、布局、最新文章数量等。
 * - 评论系统本轮不接入（你前面说先把页面搭起来）。
 * - 首页含步骤条式锚点导航（`HomeSectionStepperClient`）与未来模块占位（`HomeModulePlaceholderSection`），与各区块 `id` 一致。
 * - 源文件位于 `src/features/home/routes/`，由 `app/page.tsx` 导入。
 */
import Link from "next/link";
import { getAllPosts } from "@/features/posts/lib/posts";
import HomePhotographySection from "@/features/photography/components/HomePhotographySection";
import TheTilaviSiteHeader from "@/shared/components/layout/TheTilaviSiteHeader";
import HomeHeroLanding from "../components/HomeHeroLanding";
import HomeModulePlaceholderSection from "../components/HomeModulePlaceholderSection";
import HomeMoviesPosterWallSection from "../components/HomeMoviesPosterWallSection";
import HomeSectionStepperClient from "../components/HomeSectionStepperClient";

/**
 * Personal home page content (route component).
 *
 * 说明：
 * - Next.js App Router 要求入口文件名必须是 `page.tsx`，所以真正的路由入口
 *   仍在 `src/app/page.tsx`。
 * - 这里把“主页的业务 UI”拆出来，用更有语义的文件名，避免多个 `page.tsx`
 *   里塞大量代码导致难读/难维护。
 */
export default async function HomeLandingRoute() {
  // 读取所有文章的元数据（title/date/tags/excerpt/slug），用于首页展示“最新文章”。
  const posts = await getAllPosts();

  // 取最新 3 篇用于首页卡片展示；如果你以后想分页/分类，只需要改这里的策略。
  const latest = posts.slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-hidden font-sans text-zinc-100">
      {/* 顶部舞台：Header 叠在 Hero 上，共享背景（更“艺术性”的首屏合成） */}
      <div className="relative">
        <HomeHeroLanding />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <div className="pointer-events-auto">
            <TheTilaviSiteHeader />
          </div>
        </div>
      </div>

      {/* 页面主体：窄栏与通栏穿插，避免整页同一 max-width 显得呆板。 */}
      <main className="w-full py-12 pb-28 xl:pb-12">
        {/* 步骤条式区块导航（Client）：点击平滑滚动至各锚点 */}
        <HomeSectionStepperClient />

        {/* 个人简介：保持阅读舒适的窄栏 */}
        <div
          id="section-intro"
          className="mx-auto w-full max-w-3xl scroll-mt-28 px-6"
        >
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.25)] backdrop-blur">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
              你好，我是你
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-200">
              这里记录我在摄影、滑板和生活里的有意思瞬间：构图练习、器材心得、动作复盘，以及一些随笔小想法。
            </p>

            {/* 两个入口：最新文章 + 兴趣板块锚点 */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="rounded-xl bg-[#39ff14] px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#2ee80e]"
              >
                查看最新文章
              </Link>
              <a
                href="#interests"
                className="rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
              >
                兴趣与内容
              </a>
            </div>
          </section>
        </div>

        {/* 电影海报墙：通栏更宽，让画面有呼吸感 */}
        <div
          id="section-movies"
          className="mt-14 w-full scroll-mt-28 border-y border-white/[0.06] bg-[radial-gradient(1200px_400px_at_50%_0%,rgba(57,255,20,0.06),transparent_55%)] py-12"
        >
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
            <HomeMoviesPosterWallSection />
          </div>
        </div>

        {/* 摄影作品：相对视口全宽通栏（突破父级宽度限制） */}
        <div
          id="section-photography"
          className="relative right-1/2 left-1/2 -mx-[50vw] w-screen max-w-[100vw] scroll-mt-28 overflow-x-hidden py-10"
        >
          <HomePhotographySection />
        </div>

        {/* 未来模块占位：旅行 / 书单 / 周杰伦 / 留言 / 想做 — 宽版 + 加高 */}
        <div className="mx-auto mt-8 w-full max-w-6xl space-y-10 px-6 lg:px-10">
          <HomeModulePlaceholderSection
            id="module-travel"
            title="旅行日记"
            titleEn="Travel Journal"
          />
          <HomeModulePlaceholderSection
            id="module-books"
            title="看过的书"
            titleEn="Books I’ve Read"
          />
          <HomeModulePlaceholderSection
            id="module-jaychou"
            title="周杰伦时光机"
            titleEn="Jay Chou Time Machine"
          />
          <HomeModulePlaceholderSection
            id="module-guestbook"
            title="留言版"
            titleEn="Guestbook"
          />
          <HomeModulePlaceholderSection
            id="module-todos"
            title="想做的事 · 不想做的事"
            titleEn="Want to do · Rather not"
          />
        </div>

        {/* 兴趣板块 + 文章：回到窄栏 */}
        <div className="mx-auto mt-16 w-full max-w-3xl px-6">
          <section id="interests" className="mt-10 scroll-mt-28">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-50">
                  兴趣板块
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  你可以用文章持续扩展这些方向。
                </p>
              </div>
            </div>

            {/* 用 grid 做两列卡片；小屏自动堆叠。 */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
                <h3 className="text-lg font-semibold text-zinc-50">摄影</h3>
                <p className="mt-2 text-sm text-zinc-300">
                  构图、光线、后期与器材小结。
                </p>
                <div className="mt-4 text-sm">
                  <Link
                    href="/posts"
                    className="font-medium text-[#39ff14] hover:underline"
                  >
                    从文章开始 →
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur">
                <h3 className="text-lg font-semibold text-zinc-50">滑板</h3>
                <p className="mt-2 text-sm text-zinc-300">
                  训练进度、动作解析、摔跤复盘。
                </p>
                <div className="mt-4 text-sm">
                  <Link
                    href="/posts"
                    className="font-medium text-[#00ffff] hover:underline"
                  >
                    从文章开始 →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 最新文章区块：展示最新 3 篇。 */}
          <section id="section-posts" className="mt-10 scroll-mt-28">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-50">
                  最新文章
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  你在 <code>content/posts/</code> 里新增 <code>.md</code>{" "}
                  文件，这里会自动更新。
                </p>
              </div>
              <Link
                href="/posts"
                className="text-sm font-medium text-zinc-200 hover:underline"
              >
                查看全部 →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {latest.length === 0 ? (
                <p className="text-sm text-zinc-300">暂无文章。</p>
              ) : (
                latest.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur transition-colors hover:border-white/18"
                  >
                    {/* 文章详情链接：slug 决定路径 `/posts/${slug}` */}
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-lg font-semibold text-zinc-50 hover:underline"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-2 text-sm text-zinc-300">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    {post.excerpt ? (
                      <p className="mt-3 text-sm text-zinc-200">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 页脚信息：你以后可以替换成个人签名/联系方式等。 */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} TheTilavi · Built with Next.js + Tailwind
      </footer>
    </div>
  );
}
