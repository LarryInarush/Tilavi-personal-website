/**
 * File: `src/app/movies/MoviePosterWallClient.tsx`
 * Purpose:
 * - 电影海报墙的“交互层”组件（Client Component）。
 *
 * 负责的能力（对应你的需求）：
 * 1) 当页面滚动到电影区域时：整块区域与海报 grid 做炫酷入场动画（whileInView + stagger）
 * 2) hover 海报：海报有霓虹/酸性风格的浮起、微旋转、发光边框效果
 * 3) 点击海报：弹出详情卡片（modal），展示电影的详细信息
 *
 * 设计取舍：
 * - 动画实现用 `framer-motion`（项目已引入），避免“纯 CSS 不触发/不稳定”的体验问题
 * - Modal 使用可访问性友好的结构：遮罩层 + card + 关闭按钮 + Esc 关闭
 *
 * 注意：
 * - 这个组件只负责 UI/交互；电影数据由上层（Server Component）传入，保持数据层与展示层解耦。
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Movie } from "@/lib/movies";
import Link from "next/link";

type Props = {
  /**
   * 当前要渲染的电影列表（首页预览 / 分页页 都可复用）。
   */
  movies: Movie[];
  /**
   * 区域标题（中英双语由上层决定怎么拼）。
   */
  title: string;
  subtitle?: string;
  /**
   * 标题跳转地址（例如：首页跳转到 `/movies`）。
   * - 传入后标题变为 Link
   * - 不传则展示为纯标题（不可点击）
   */
  titleHref?: string;
  /** 外层 `<section>` 的 class（首页通栏时可去掉默认 `mt-12`）。 */
  sectionClassName?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MoviePosterWallClient({
  movies,
  title,
  subtitle,
  titleHref,
  sectionClassName,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeMovie = useMemo(() => {
    if (!activeId) return null;
    return movies.find((m) => m.id === activeId) ?? null;
  }, [activeId, movies]);

  // Esc 关闭 modal
  useEffect(() => {
    if (!activeId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId]);

  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  return (
    <section className={sectionClassName ?? "mt-12"}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {titleHref ? (
            <Link
              href={titleHref}
              className="group inline-flex max-w-full items-baseline gap-2 text-left"
            >
              <h2 className="truncate text-2xl font-semibold text-zinc-50 transition group-hover:text-[#39ff14]">
                {title}
              </h2>
              <span className="shrink-0 text-sm font-medium text-zinc-300 transition group-hover:text-zinc-50">
                →
              </span>
            </Link>
          ) : (
            <div className="inline-flex max-w-full items-baseline gap-2">
              <h2 className="truncate text-2xl font-semibold text-zinc-50">
                {title}
              </h2>
            </div>
          )}

          {subtitle ? (
            <p className="mt-2 text-sm text-zinc-300">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {/* 进场动画：当滚动进入视口时触发一次 */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {movies.map((movie, index) => {
          // hover 动效微差异：让每张海报 hover 时的旋转角不完全一致，观感更“手工”
          const tilt = (index % 3) - 1; // -1,0,1
          const hoverRotate = clamp(tilt * 1.2, -1.4, 1.4);

          return (
            <motion.button
              key={movie.id}
              type="button"
              variants={itemVariants}
              onClick={() => setActiveId(movie.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/15 text-left backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14]/70"
              whileHover={{
                y: -6,
                rotate: hoverRotate,
                transition: { duration: 0.18 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 海报图 */}
              <div className="aspect-[2/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.posterSrc}
                  alt={`${movie.titleZh} poster`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* 霓虹边框光晕 */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[#39ff14]/30" />
                {/* hover 背景：与全站背景同风格，但更“亮”且加入紫色点缀，形成明确交互差异 */}
                <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_12%_8%,rgba(57,255,20,0.30),transparent_60%),radial-gradient(700px_260px_at_88%_92%,rgba(0,255,255,0.22),transparent_60%),radial-gradient(680px_240px_at_80%_10%,rgba(191,0,255,0.16),transparent_62%)]" />
              </div>

              {/* 信息条：hover 时浮出 */}
              <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))] p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="text-sm font-semibold text-zinc-50">
                  {movie.titleZh}
                </div>
                <div className="mt-0.5 text-xs text-zinc-300">
                  {movie.titleEn} · {movie.year}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* 点击弹出详情卡片 */}
      <AnimatePresence>
        {activeMovie ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            {/* 背景遮罩 */}
            <motion.button
              type="button"
              className="absolute inset-0 cursor-pointer bg-black/70"
              onClick={() => setActiveId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close movie details"
            />

            {/* 卡片 */}
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[min(88vh,920px)] overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(180deg,rgba(5,6,8,0.92),rgba(5,6,8,0.72))] shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur"
              initial={{ y: 22, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 22, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {/*
                海报列使用 flex + object-contain：避免窄 grid 列（如 200px）+ object-cover 把竖版海报裁切或「夹扁」。
                桌面端给足宽度与内边距，整张海报在侧栏内完整可见。
              */}
              <div className="flex max-h-[min(88vh,920px)] flex-col overflow-hidden sm:h-[min(88vh,920px)] sm:flex-row sm:items-stretch">
                <aside className="flex shrink-0 flex-col items-center justify-center border-b border-white/10 bg-gradient-to-b from-black/45 to-black/25 px-4 py-6 sm:w-[min(42%,380px)] sm:max-w-[400px] sm:border-b-0 sm:border-r sm:border-white/10 sm:py-8">
                  <div className="flex w-full max-w-[300px] items-center justify-center sm:max-h-[min(82vh,860px)] sm:max-w-[min(100%,360px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeMovie.posterSrc}
                      alt={`${activeMovie.titleZh} poster`}
                      className="h-auto max-h-[min(70vh,720px)] w-full rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:rounded-2xl"
                    />
                  </div>
                </aside>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <div className="shrink-0 border-b border-white/10 p-5 sm:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeMovie.posterSrc}
                      alt={`${activeMovie.titleZh} poster`}
                      className="mx-auto max-h-48 rounded-xl object-contain"
                    />
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-zinc-50">
                          {activeMovie.titleZh}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-300">
                          {activeMovie.titleEn} · {activeMovie.year}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveId(null)}
                        className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:border-white/18 hover:bg-white/10"
                      >
                        关闭 / Close
                      </button>
                    </div>

                    {/* TMDB / 本地 元信息 */}
                    <dl className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                      {activeMovie.directors?.length ? (
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-semibold uppercase tracking-wider text-[#39ff14]/85">
                            导演 / Director
                          </dt>
                          <dd className="mt-0.5 text-zinc-200">
                            {activeMovie.directors.join(" · ")}
                          </dd>
                        </div>
                      ) : null}
                      {activeMovie.tmdbRuntimeMin != null ? (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            片长
                          </dt>
                          <dd className="text-zinc-200">
                            {activeMovie.tmdbRuntimeMin} min
                          </dd>
                        </div>
                      ) : null}
                      {activeMovie.tmdbReleaseDate ? (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            上映
                          </dt>
                          <dd className="text-zinc-200">
                            {activeMovie.tmdbReleaseDate}
                          </dd>
                        </div>
                      ) : null}
                      {activeMovie.tmdbVoteAverage != null ? (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            TMDB 评分
                          </dt>
                          <dd className="text-zinc-200">
                            {activeMovie.tmdbVoteAverage.toFixed(1)}
                            {activeMovie.tmdbVoteCount != null
                              ? ` · ${activeMovie.tmdbVoteCount} votes`
                              : ""}
                          </dd>
                        </div>
                      ) : null}
                      {activeMovie.tmdbOriginalLanguage ? (
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            原始语言
                          </dt>
                          <dd className="text-zinc-200">
                            {activeMovie.tmdbOriginalLanguage.toUpperCase()}
                          </dd>
                        </div>
                      ) : null}
                      {activeMovie.tmdbProductionCountries?.length ? (
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            制片国家/地区
                          </dt>
                          <dd className="text-zinc-200">
                            {activeMovie.tmdbProductionCountries.join(" · ")}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    <div className="mt-5">
                      <div className="text-xs font-semibold uppercase tracking-widest text-[#39ff14]/90">
                        Tagline
                      </div>
                      <div className="mt-1 text-sm text-zinc-200">
                        {activeMovie.tmdbTaglineZh ?? activeMovie.taglineZh}
                        <span className="mt-1 block text-xs text-zinc-400">
                          {activeMovie.tmdbTaglineEn ?? activeMovie.taglineEn}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-xs font-semibold uppercase tracking-widest text-[#00ffff]/80">
                        影片简介 / Overview
                      </div>
                      <div className="mt-2 space-y-3 text-sm leading-relaxed text-zinc-200">
                        <p>
                          {activeMovie.tmdbOverviewZh ?? activeMovie.notesZh}
                        </p>
                        <p className="text-xs leading-relaxed text-zinc-400">
                          {activeMovie.tmdbOverviewEn ?? activeMovie.notesEn}
                        </p>
                      </div>
                    </div>

                    {activeMovie.castTop?.length ? (
                      <div className="mt-5">
                        <div className="text-xs font-semibold uppercase tracking-widest text-[#bf00ff]/85">
                          主要演员 / Cast
                        </div>
                        <ul className="mt-2 space-y-1.5 text-sm text-zinc-300">
                          {activeMovie.castTop.map((c) => (
                            <li key={`${c.name}-${c.character}`}>
                              <span className="text-zinc-100">{c.name}</span>
                              <span className="text-zinc-500"> — </span>
                              <span className="text-zinc-400">{c.character}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {activeMovie.tmdbOverviewZh ? (
                      <div className="mt-5">
                        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                          本地笔记 / Personal notes
                        </div>
                        <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                          <p>{activeMovie.notesZh}</p>
                          <p className="mt-2 text-xs text-zinc-500">
                            {activeMovie.notesEn}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {activeMovie.genres.map((g) => (
                        <span
                          key={g}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部霓虹线条 */}
              <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(57,255,20,0.65),rgba(0,255,255,0.45),rgba(191,0,255,0.35),transparent)]" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

