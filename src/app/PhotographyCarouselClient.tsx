/**
 * File: `src/app/PhotographyCarouselClient.tsx`
 * Purpose:
 * - 首页「摄影作品」横向陈列：竖版画幅（高大于宽）；每张宽度不超过视口约 30% 且一行五张不撑出横向滚动；
 *   中间三张清晰、仅最外侧卡片模糊；左右箭头切换焦点；
 * - 卡片 hover 霓虹风格反馈；点击后全屏查看，使用 `layoutId` 做共享元素过渡。
 * - 标题使用全站注入的 `--font-photo-display`（Cormorant Garamond），滚动入场动画。
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PhotographyItem } from "@/lib/photography";

type Props = {
  items: PhotographyItem[];
  title: string;
  subtitle?: string;
};

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

/**
 * 根据条目数量决定展示几张（最多 5 张），避免条目过少时出现重复 layoutId。
 */
function slotOffsetsForCount(n: number) {
  const count = Math.min(5, Math.max(1, n));
  const half = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => i - half);
}

export default function PhotographyCarouselClient({
  items,
  title,
  subtitle,
}: Props) {
  const [active, setActive] = useState(0);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const n = items.length;
  const safeN = Math.max(1, n);

  const go = useCallback(
    (delta: number) => {
      setActive((a) => wrapIndex(a + delta, safeN));
    },
    [safeN],
  );

  useEffect(() => {
    if (!lightboxId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxId]);

  const slots = useMemo(() => {
    const offsets = slotOffsetsForCount(safeN);
    return offsets.map((off) => {
      const idx = wrapIndex(active + off, safeN);
      return {
        offset: off,
        item: items[idx],
        abs: Math.abs(off),
      };
    });
  }, [active, items, safeN]);

  const lightboxItem = lightboxId
    ? items.find((x) => x.id === lightboxId) ?? null
    : null;

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-none">
      {/* 标题：居中、大字、滚动入场 */}
      <motion.div
        className="relative z-10 px-4"
        initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="font-photo-display text-center text-4xl font-medium italic tracking-[0.02em] text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{
            textShadow:
              "0 0 80px rgba(57,255,20,0.12), 0 0 120px rgba(0,255,255,0.08)",
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </motion.div>

      <div className="relative mt-10 w-full max-w-full overflow-x-hidden py-8">
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-1 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-100 shadow-lg backdrop-blur-md transition hover:border-[#39ff14]/50 hover:bg-black/60 hover:text-[#39ff14] sm:left-3 md:left-5"
          aria-label="上一张"
        >
          <span className="text-2xl leading-none">‹</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-1 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-100 shadow-lg backdrop-blur-md transition hover:border-[#00ffff]/50 hover:bg-black/60 hover:text-[#00ffff] sm:right-3 md:right-5"
          aria-label="下一张"
        >
          <span className="text-2xl leading-none">›</span>
        </button>

        {/*
          宽度：单张不超过 30vw，且均分剩余宽度（减去 gap），避免整页横向滚动条。
          画幅：竖版 aspect 2/3（宽:高），即高度大于宽度。
        */}
        <div className="mx-auto flex w-full max-w-full items-center justify-center gap-2 px-14 py-2">
          {slots.map(({ item, offset }, slotIndex) => {
            const len = slots.length;
            /** 仅当展示 5 张时：最左与最右两张模糊，中间三张清晰 */
            const isEdgeBlurred = len >= 5 && (slotIndex === 0 || slotIndex === len - 1);
            const blurPx = isEdgeBlurred ? 12 : 0;
            const centerIdx = (len - 1) / 2;
            const distFromCenter = Math.abs(slotIndex - centerIdx);
            const scale =
              len >= 5
                ? isEdgeBlurred
                  ? 0.88
                  : distFromCenter <= 1
                    ? 1
                    : 0.95
                : 1;
            const opacity = isEdgeBlurred ? 0.52 : distFromCenter <= 1 ? 1 : 0.88;
            const layoutId =
              lightboxId === item.id ? undefined : `photo-${item.id}`;

            /** 与容器 `gap-2`（0.5rem）一致，保证 N 张卡片 + (N-1) 道缝刚好占满 100% */
            const cardWidth = `min(30vw, calc((100% - ${(len - 1) * 0.5}rem) / ${len}))`;

            return (
              <motion.button
                key={`${item.id}-${offset}`}
                type="button"
                layoutId={layoutId}
                onClick={() => setLightboxId(item.id)}
                className="group relative aspect-[2/3] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]/70"
                style={{
                  filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
                  width: cardWidth,
                }}
                animate={{ scale, opacity }}
                whileHover={{
                  scale: scale * 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: scale * 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <div className="h-full w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageSrc}
                    alt={item.titleZh}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-[#00ffff]/35" />
                  <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_20%_0%,rgba(0,255,255,0.22),transparent_55%),radial-gradient(500px_200px_at_100%_100%,rgba(57,255,20,0.18),transparent_55%)]" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightboxItem ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-black/80 backdrop-blur-sm"
              onClick={() => setLightboxId(null)}
              aria-label="关闭"
            />
            <motion.div
              layoutId={`photo-${lightboxItem.id}`}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-zinc-950/90 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="aspect-[2/3] w-full max-h-[min(85vh,900px)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxItem.imageSrc}
                  alt={lightboxItem.titleZh}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-t border-white/10 px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-50">
                      {lightboxItem.titleZh}
                    </h3>
                    {lightboxItem.titleEn ? (
                      <p className="mt-1 text-sm text-zinc-400">
                        {lightboxItem.titleEn}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-zinc-500">
                      占位图来自电影海报；替换真实作品后仅改数据源即可。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxId(null)}
                    className="shrink-0 rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-white/20 hover:bg-white/10"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
