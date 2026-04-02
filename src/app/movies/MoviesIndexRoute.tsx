/**
 * File: `src/app/movies/MoviesIndexRoute.tsx`
 * Purpose:
 * - `/movies` 页面的主要实现（Server Component）。
 *
 * 职责：
 * - 根据 URL 查询参数 `page` 做分页
 * - 把当前页的电影列表传给 `MoviePosterWallClient`（负责动画、hover、点击详情卡片）
 * - 渲染分页导航（上一页/下一页/页码）
 *
 * 设计要点：
 * - 分页逻辑在 `src/lib/movies.ts`，这里仅做“路由层组合”
 * - 这样未来换数据源（例如从 CMS/API）不会牵连 UI 组件
 */

import Link from "next/link";
import MoviePosterWallClient from "./MoviePosterWallClient";
import { getMoviesCatalog, getMoviesPage } from "@/lib/movies";
import MoviesBackgroundBackdrop from "./MoviesBackgroundBackdrop";

function toInt(value: string | string[] | undefined): number | null {
  if (!value) return null;
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

export default async function MoviesIndexRoute({
  searchParams,
}: {
  searchParams: { page?: string | string[] };
}) {
  // page 从 1 开始；非法输入会 fallback 到 1
  const page = toInt(searchParams.page) ?? 1;

  // 这里决定每页展示数量：为了“海报墙视觉”，用 18（6x3 或 3x6）更均衡
  const pageSize = 18;
  const [catalog, data] = await Promise.all([
    getMoviesCatalog(),
    getMoviesPage({ page, pageSize }),
  ]);

  return (
    <main className="relative mx-auto w-full max-w-5xl px-6 py-14">
      {/* 背景氛围层：随机挑选一张海报“塞进”霓虹暗背景里 */}
      <MoviesBackgroundBackdrop movies={catalog} />

      {/* 内容层需要更高 z-index，避免被混合层影响点击 */}
      <div className="relative z-10">
        <MoviePosterWallClient
          movies={data.items}
          title="全部电影 / Movies"
          subtitle={`第 ${data.page} / ${data.totalPages} 页 · 共 ${data.totalItems} 部`}
        />

        {/* 分页导航 */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/movies?page=${Math.max(1, data.page - 1)}`}
            aria-disabled={data.page <= 1}
            className={[
              "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 backdrop-blur transition",
              data.page <= 1
                ? "pointer-events-none opacity-40"
                : "hover:border-white/18 hover:bg-white/10",
            ].join(" ")}
          >
            上一页 / Prev
          </Link>
          <Link
            href={`/movies?page=${Math.min(data.totalPages, data.page + 1)}`}
            aria-disabled={data.page >= data.totalPages}
            className={[
              "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 backdrop-blur transition",
              data.page >= data.totalPages
                ? "pointer-events-none opacity-40"
                : "hover:border-white/18 hover:bg-white/10",
            ].join(" ")}
          >
            下一页 / Next
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: data.totalPages }).map((_, idx) => {
            const p = idx + 1;
            const isActive = p === data.page;
            return (
              <Link
                key={p}
                href={`/movies?page=${p}`}
                className={[
                  "rounded-xl border px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-[#39ff14]/60 bg-[#39ff14]/15 text-zinc-50"
                    : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/18 hover:bg-white/10",
                ].join(" ")}
              >
                {p}
              </Link>
            );
          })}
        </div>
        </div>
      </div>
    </main>
  );
}

