/**
 * File: `src/app/movies/MoviesBackgroundBackdrop.tsx`
 * Purpose:
 * - `/movies` 页面专属的“背景氛围层”（Server Component）。
 *
 * 为什么做成 Server Component：
 * - 你希望“随机轮换”背景海报，但 client 端随机会导致 SSR/CSR 选到不同海报，
 *   从而触发 hydration mismatch（开发环境会报错/警告）。
 * - 这里在服务端每次请求时决定一张海报，并直接把背景作为静态 DOM 输出，
 *   这样页面不会出现“背景跳变/水合报错”。
 *
 * 视觉目标（与你描述一致）：
 * - 海报不是生硬贴图：用强遮罩 + 模糊 + 降饱和 + 混合模式，让它像被“塞进”暗黑霓虹背景里
 * - 只提供氛围，不抢正文内容
 */

import type { Movie } from "@/lib/movies";

function pickRandomPosterSrc(movies: Movie[]): string | null {
  if (!movies.length) return null;
  const idx = Math.floor(Math.random() * movies.length);
  return movies[idx]?.posterSrc ?? null;
}

export default function MoviesBackgroundBackdrop({
  movies,
}: {
  movies: Movie[];
}) {
  const posterSrc = pickRandomPosterSrc(movies);
  if (!posterSrc) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* 海报氛围层：blur + 低饱和 + 低对比，避免扎眼 */}
      <div
        className="absolute inset-0 scale-[1.06] bg-center"
        style={{
          backgroundImage: `url("${posterSrc}")`,
          backgroundSize: "cover",
          filter: "blur(34px) saturate(0.75) contrast(0.9)",
          opacity: 0.22,
          mixBlendMode: "screen",
          animation: "moviesBackdropFadeIn 600ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      />

      {/* 暗化遮罩：把海报塞进“夜色” */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(0,0,0,0.25),transparent_60%),linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.75))]" />

      {/* 霓虹点缀：与全站背景同语汇，保证统一 */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_18%_0%,rgba(57,255,20,0.10),transparent_60%),radial-gradient(900px_360px_at_82%_0%,rgba(0,255,255,0.08),transparent_60%),radial-gradient(900px_420px_at_70%_110%,rgba(191,0,255,0.07),transparent_62%)]" />
    </div>
  );
}

