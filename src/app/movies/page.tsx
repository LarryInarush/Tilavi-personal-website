/**
 * `/movies` 路由入口（Next.js App Router 强制文件名）。
 *
 * 说明：
 * - 入口保持极薄：主要实现放在 `src/components/movies/MoviesIndexRoute.tsx`
 * - 支持 `?page=` 查询参数分页
 */

import MoviesIndexRoute from "@/components/movies/MoviesIndexRoute";

export default async function MoviesPage({
  searchParams,
}: {
  /**
   * Next.js 16+ 在部分场景会把 `searchParams` 作为 Promise 传入。
   * 为了避免 sync-dynamic-apis 报错，这里统一 await 后再传给下层。
   */
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const resolved = await searchParams;
  return <MoviesIndexRoute searchParams={resolved} />;
}

