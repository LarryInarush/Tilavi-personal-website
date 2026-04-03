/**
 * File: `src/features/posts/routes/PostsIndexRoute.tsx`
 * Purpose:
 * - 渲染 `/posts`（文章列表页）。
 *
 * 为什么不是写在 `page.tsx`？
 * - Next.js App Router 强制 `src/app/posts/page.tsx` 作为路由入口文件名。
 * - 为了让入口更薄、更好读，我们把主要 UI 拆到这里。
 *
 * 数据：
 * - 调用 `getAllPosts()`（读取 `content/posts/*.md` 的 frontmatter），用于列表卡片。
 */
import Link from "next/link";
import { getAllPosts } from "@/features/posts/lib/posts";

/**
 * `/posts` 路由的“文章列表内容组件”（route business logic）。
 */
export default async function PostsIndexRoute() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Posts
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            用 Markdown 写内容，自动生成文章列表与详情页。
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            还没有文章，先在 `content/posts/` 里添加 `.md` 文件吧。
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-black/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-xl font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(post.date).toLocaleDateString()}
                    {post.tags && post.tags.length > 0 ? (
                      <span className="ml-2 text-zinc-500 dark:text-zinc-500">
                        · {post.tags.join(" / ")}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              {post.excerpt ? (
                <p className="mt-3 text-zinc-700 dark:text-zinc-300">
                  {post.excerpt}
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
