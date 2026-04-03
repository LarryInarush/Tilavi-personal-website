/**
 * Next.js App Router：`/posts` 路由入口。
 *
 * 注意：
 * - Next.js 规定这里必须叫 `page.tsx` 才会成为路由入口。
 * - 这里保持极薄：真正的 UI 逻辑放在 `src/features/posts/routes/PostsIndexRoute.tsx` 中。
 */
import PostsIndexRoute from "@/features/posts/routes/PostsIndexRoute";

export default PostsIndexRoute;
