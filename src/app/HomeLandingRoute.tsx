/**
 * File: `src/app/HomeLandingRoute.tsx`
 * Purpose:
 * - 提供 `/`（个人主页）的“主要渲染内容”。
 *
 * 为什么存在这个文件？
 * - Next.js App Router 强制 `src/app/page.tsx` 作为根路由入口。
 * - 但根路由入口文件应该尽量薄，因此把真正的 UI 和数据读取拆到这里。
 *
 * 数据来源：
 * - 调用 `getAllPosts()`（来自 `src/lib/posts.ts`）读取 `content/posts/*.md` 的元数据。
 *
 * 注意：
 * - 你随时可以改这里的文案、布局、最新文章数量等。
 * - 评论系统本轮不接入（你前面说先把页面搭起来）。
 */
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

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
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Sticky 顶栏：固定在页面顶部，增强个人主页的“站点感”。 */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur dark:border-zinc-800 dark:bg-black/70">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          {/* 左侧：站点 Logo/名称 */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-center text-sm font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
              P
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                你的名字
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                摄影 · 滑板 · 随笔
              </div>
            </div>
          </div>

          {/* 右侧：导航链接 */}
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/posts"
              className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              文章
            </Link>
          </nav>
        </div>
      </header>

      {/* 页面主体：控制最大宽度，保证桌面端观感舒服。 */}
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* 个人简介卡片：你可以长期维护并随时扩展文案。 */}
        <section className="rounded-3xl bg-white p-8 shadow-sm dark:bg-black/30">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            你好，我是你
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-700 dark:text-zinc-300">
            这里记录我在摄影、滑板和生活里的有意思瞬间：构图练习、器材心得、动作复盘，以及一些随笔小想法。
          </p>

          {/* 两个入口：最新文章 + 兴趣板块锚点 */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
            >
              查看最新文章
            </Link>
            <a
              href="#interests"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black/30 dark:text-zinc-50 dark:hover:bg-black/50"
            >
              兴趣与内容
            </a>
          </div>
        </section>

        {/* 兴趣板块：用来承接“后续持续扩展”。目前没有做分类筛选，只是内容入口。 */}
        <section id="interests" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                兴趣板块
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                你可以用文章持续扩展这些方向。
              </p>
            </div>
          </div>

          {/* 用 grid 做两列卡片；小屏自动堆叠。 */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black/30">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                摄影
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                构图、光线、后期与器材小结。
              </p>
              <div className="mt-4 text-sm">
                <Link
                  href="/posts"
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  从文章开始 →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black/30">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                滑板
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                训练进度、动作解析、摔跤复盘。
              </p>
              <div className="mt-4 text-sm">
                <Link
                  href="/posts"
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  从文章开始 →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 最新文章区块：展示最新 3 篇。 */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                最新文章
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                你在 <code>content/posts/</code> 里新增 <code>.md</code>{" "}
                文件，这里会自动更新。
              </p>
            </div>
            <Link
              href="/posts"
              className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              查看全部 →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latest.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                暂无文章。
              </p>
            ) : (
              latest.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-black/30 dark:hover:border-zinc-700"
                >
                  {/* 文章详情链接：slug 决定路径 `/posts/${slug}` */}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-lg font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {post.excerpt}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* 页脚信息：你以后可以替换成个人签名/联系方式等。 */}
      <footer className="border-t border-zinc-200 py-10 text-center text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} 你的名字 · 用 Next.js + Tailwind 写主页
      </footer>
    </div>
  );
}

