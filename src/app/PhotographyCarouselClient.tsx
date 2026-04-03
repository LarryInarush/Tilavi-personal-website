/**
 * File: `src/app/PhotographyCarouselClient.tsx`
 * Purpose:
 * - 首页「摄影作品」横向陈列：竖版画幅（高大于宽）；每张宽度不超过视口约 30% 且一行约五张落在视口内；
 *   中间三张清晰、仅最外侧卡片模糊；左右箭头切换时整条轨道平移（轮播），避免逐项从左侧滑入；
 * - 卡片 hover 霓虹风格反馈；点击后全屏查看，使用 `layoutId` 做共享元素过渡（仅当前居中张启用 layoutId，避免重复 id）。
 * - 标题使用全站注入的 `--font-photo-display`（Cormorant Garamond），滚动入场动画。
 */

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import type { PhotographyItem } from "@/lib/photography";

type Props = {
  items: PhotographyItem[];
  title: string;
  subtitle?: string;
};

/** 卡片间距（px），略大于原先 gap-2，使陈列更透气 */
const TRACK_GAP_PX = 24;

type Measure = {
  vpW: number;
  cardW: number;
};

function computeX(m: Measure, physicalCenter: number): number {
  const step = m.cardW + TRACK_GAP_PX;
  return m.vpW / 2 - m.cardW / 2 - physicalCenter * step;
}

function computeCardW(vpW: number): number {
  const gaps = 4 * TRACK_GAP_PX;
  return Math.min(vpW * 0.3, (vpW - gaps) / 5);
}

export default function PhotographyCarouselClient({
  items,
  title,
  subtitle,
}: Props) {
  const n = items.length;
  const extended = useMemo(
    () => (n > 0 ? [...items, ...items, ...items] : []),
    [items, n],
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  /** 物理滑道索引：始终在三倍数组的中间一段 [n, 2n-1]，仅在绕圈时用动画衔接并重置 */
  const [physicalCenter, setPhysicalCenter] = useState(() =>
    Math.max(0, n),
  );
  const [measure, setMeasure] = useState<Measure | null>(null);
  const measureRef = useRef<Measure | null>(null);
  measureRef.current = measure;
  /** 平移进行中时不给非居中副本挂 layoutId，避免 Framer 冲突 */
  const [isSlideAnimating, setIsSlideAnimating] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const remeasure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const vpW = vp.clientWidth;
    const cardW = computeCardW(vpW);
    setMeasure((prev) =>
      prev && prev.vpW === vpW && prev.cardW === cardW
        ? prev
        : { vpW, cardW },
    );
  }, []);

  useLayoutEffect(() => {
    remeasure();
  }, [remeasure, n, extended.length]);

  useEffect(() => {
    const ro = new ResizeObserver(() => remeasure());
    const el = viewportRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [remeasure]);

  /** 条目数变化时回到中间段起点 */
  useLayoutEffect(() => {
    if (n <= 0) return;
    setPhysicalCenter(n);
  }, [n]);

  useLayoutEffect(() => {
    if (!measure || n <= 0) return;
    x.set(computeX(measure, physicalCenter));
  }, [measure, n, physicalCenter, x]);

  useEffect(() => {
    if (!lightboxId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxId]);

  const runSlide = useCallback(
    (nextPhysical: number, onCompleteExtra?: () => void) => {
      if (!measure || n <= 0) return;
      animRef.current?.stop();
      setIsSlideAnimating(true);
      const target = computeX(measure, nextPhysical);
      animRef.current = animate(x, target, {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          if (onCompleteExtra) {
            onCompleteExtra();
          } else {
            setPhysicalCenter(nextPhysical);
          }
          setIsSlideAnimating(false);
        },
      });
    },
    [measure, n, x],
  );

  const goNext = useCallback(() => {
    if (!measure || n <= 1) return;
    if (physicalCenter >= 2 * n - 1) {
      runSlide(2 * n, () => {
        setPhysicalCenter(n);
        const m = measureRef.current;
        if (m) x.set(computeX(m, n));
      });
      return;
    }
    runSlide(physicalCenter + 1);
  }, [measure, n, physicalCenter, runSlide, x]);

  const goPrev = useCallback(() => {
    if (!measure || n <= 1) return;
    if (physicalCenter <= n) {
      runSlide(n - 1, () => {
        setPhysicalCenter(2 * n - 1);
        const m = measureRef.current;
        if (m) x.set(computeX(m, 2 * n - 1));
      });
      return;
    }
    runSlide(physicalCenter - 1);
  }, [measure, n, physicalCenter, runSlide, x]);

  const lightboxItem = lightboxId
    ? items.find((x) => x.id === lightboxId) ?? null
    : null;

  if (n === 0) {
    return null;
  }

  const cardWidthPx = measure?.cardW;

  return (
    <section className="w-full max-w-none">
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
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {subtitle}
          </motion.p>
        ) : null}
      </motion.div>

      <div
        ref={viewportRef}
        className="relative mt-10 w-full max-w-full overflow-x-hidden py-8"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={n <= 1}
          className="absolute left-1 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-100 shadow-lg backdrop-blur-md transition hover:border-[#39ff14]/50 hover:bg-black/60 hover:text-[#39ff14] disabled:pointer-events-none disabled:opacity-30 sm:left-3 md:left-5"
          aria-label="上一张"
        >
          <span className="text-2xl leading-none">‹</span>
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={n <= 1}
          className="absolute right-1 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-100 shadow-lg backdrop-blur-md transition hover:border-[#00ffff]/50 hover:bg-black/60 hover:text-[#00ffff] disabled:pointer-events-none disabled:opacity-30 sm:right-3 md:right-5"
          aria-label="下一张"
        >
          <span className="text-2xl leading-none">›</span>
        </button>

        <div className="px-14 py-2">
          <motion.div
            ref={trackRef}
            className="flex will-change-transform"
            style={{
              x,
              columnGap: TRACK_GAP_PX,
            }}
          >
            {extended.map((item, i) => {
              const dist = Math.abs(i - physicalCenter);
              const isEdgeBlurred = n >= 5 && dist >= 2;
              const blurPx = isEdgeBlurred ? 12 : 0;
              const scale =
                n >= 5
                  ? isEdgeBlurred
                    ? 0.88
                    : dist <= 1
                      ? 1
                      : 0.95
                  : 1;
              const opacity = isEdgeBlurred
                ? 0.52
                : dist <= 1
                  ? 1
                  : 0.88;

              const useLayout =
                !isSlideAnimating &&
                i === physicalCenter &&
                lightboxId !== item.id;

              return (
                <motion.button
                  key={`${item.id}-track-${i}`}
                  layoutId={useLayout ? `photo-${item.id}` : undefined}
                  type="button"
                  onClick={() => setLightboxId(item.id)}
                  className="group relative aspect-[2/3] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]/70"
                  style={{
                    filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
                    width:
                      cardWidthPx != null
                        ? cardWidthPx
                        : "min(30vw, calc((100% - 96px) / 5))",
                    /** 100% 相对视口容器；96px ≈ 4×24px gap 的降级估算，测量完成后改为精确像素宽 */
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
          </motion.div>
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
