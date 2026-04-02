/**
 * File: `src/app/posts/[slug]/PostDetailsRoute.tsx`
 * Purpose:
 * - 渲染文章详情页面 `/posts/[slug]` 的主要 UI（含从 Markdown 读取内容并渲染）。
 *
 * 关键点：
 * - `[slug]` 来自路由目录名，它会映射到 `content/posts/${slug}.md`。
 * - 这里是“业务组件”，真正的 Next.js 路由入口仍在同目录的 `page.tsx`。
 *
 * 安全提醒：
 * - 文章正文来自本地 Markdown，经 `remark-html` 转成 HTML。
 * - 页面使用 `dangerouslySetInnerHTML` 渲染这段 HTML，
 *   因而如果你未来允许用户输入不可信内容，需要进一步加过滤策略。
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";

/**
 * `/posts/[slug]` 文章详情的“渲染组件”（route business logic）。
 *
 * 参数：
 * - slug：来自路由参数 `[slug]`，对应 `content/posts/${slug}.md` 的文件名（不含扩展名）。
 *
 * 说明：
 * - 这个文件负责真正的“读数据 + 组织 UI”。
 * - 真正的路由入口仍在 `page.tsx`（Next.js App Router 要求）。
 */
export default async function PostDetailsRoute({
  slug,
}: {
  slug: string;
}) {
  // 读取指定 slug 的文章内容
  const post = await getPostBySlug(slug);

  // 如果文件不存在/解析失败，就让 Next.js 走 404
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      {/* 返回上一页：回到文章列表 */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/posts"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← 返回文章列表
        </Link>
      </div>

      {/* 文章正文区 */}
      <article className="mt-6">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {post.title}
        </h1>

        {/* 日期与标签 */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          {post.tags?.length ? (
            <span className="text-zinc-500 dark:text-zinc-500">
              · {post.tags.join(" / ")}
            </span>
          ) : null}
        </div>

        {/* Markdown -> HTML 后渲染。
            由于内容来自本地 `.md`，并且 remark-html 会做一定的处理，
            但从安全角度仍是“危险渲染”，所以我们保留在这里集中处理。 */}
        <div
          className="mt-8 text-[15px] leading-7 text-zinc-900 dark:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}

