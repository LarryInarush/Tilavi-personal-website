/**
 * File: `src/app/not-found.tsx`
 * Purpose:
 * - Next.js App Router 当路由匹配不到页面时，会渲染这个组件（默认 404）。
 * - 你也可以通过 `notFound()` 主动触发该页面。
 *
 * 当前用法：
 * - `/posts/[slug]` 中如果找不到对应 Markdown 文件，会在数据层返回 null，
 *   然后在页面路由里调用 `notFound()`，最终展示本文件内容。
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        404 - 页面不存在
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        你可能点错了链接，或者文章还没写出来。
      </p>
      <div className="mt-6">
        <Link
          href="/posts"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black/30 dark:text-zinc-50"
        >
          去文章列表
        </Link>
      </div>
    </main>
  );
}

