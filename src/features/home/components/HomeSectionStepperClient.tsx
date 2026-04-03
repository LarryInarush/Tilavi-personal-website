/**
 * File: `src/features/home/components/HomeSectionStepperClient.tsx`
 * Purpose:
 * - 首页「步骤条式」区块导航：非传统下拉菜单，以竖/横向节点 + 连线表达顺序；点击平滑滚动到对应 `id`。
 * - 随滚动高亮当前大致所在区块（`scroll` + `offsetTop` 估算）。
 */

"use client";

import { useCallback, useEffect, useState } from "react";

export type HomeSectionStep = {
  id: string;
  label: string;
};

/** 与 `HomeLandingRoute` 中各区块 `id` 保持一致 */
export const HOME_PAGE_STEPS: HomeSectionStep[] = [
  { id: "section-intro", label: "简介" },
  { id: "section-movies", label: "电影" },
  { id: "section-photography", label: "摄影" },
  { id: "module-travel", label: "旅行" },
  { id: "module-books", label: "书单" },
  { id: "module-jaychou", label: "杰伦" },
  { id: "module-guestbook", label: "留言" },
  { id: "module-todos", label: "想做" },
  { id: "interests", label: "兴趣" },
  { id: "section-posts", label: "文章" },
];

const SCROLL_OFFSET = 96;

export default function HomeSectionStepperClient() {
  const [activeId, setActiveId] = useState<string>(HOME_PAGE_STEPS[0]!.id);

  const refreshActive = useCallback(() => {
    const y = window.scrollY + SCROLL_OFFSET;
    let current = HOME_PAGE_STEPS[0]!.id;
    for (const step of HOME_PAGE_STEPS) {
      const el = document.getElementById(step.id);
      if (el && el.offsetTop <= y) current = step.id;
    }
    setActiveId(current);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(refreshActive);
    window.addEventListener("scroll", refreshActive, { passive: true });
    window.addEventListener("resize", refreshActive);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", refreshActive);
      window.removeEventListener("resize", refreshActive);
    };
  }, [refreshActive]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET + 4;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* 桌面：右侧竖向步骤条 */}
      <nav
        aria-label="页面区块导航"
        className="pointer-events-none fixed top-[28%] right-2 z-40 hidden -translate-y-1/2 xl:block 2xl:right-6"
      >
        <ol className="pointer-events-auto flex flex-col items-end gap-0 rounded-2xl border border-white/10 bg-black/45 px-2 py-3 shadow-lg backdrop-blur-md">
          {HOME_PAGE_STEPS.map((step, i) => {
            const active = step.id === activeId;
            const last = i === HOME_PAGE_STEPS.length - 1;
            return (
              <li key={step.id} className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(step.id)}
                    className={`group flex items-center gap-2 rounded-full py-1 pl-2 text-right transition ${
                      active
                        ? "text-[#39ff14]"
                        : "text-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    <span
                      className={`max-w-[5.5rem] text-[11px] leading-tight font-medium tracking-wide ${
                        active ? "text-zinc-100" : ""
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition ${
                        active
                          ? "border-[#39ff14]/70 bg-[#39ff14]/15 text-[#39ff14]"
                          : "border-white/15 bg-white/5 text-zinc-400 group-hover:border-[#00ffff]/40"
                      }`}
                    >
                      {i + 1}
                      {active ? (
                        <span className="absolute inset-0 rounded-full bg-[#39ff14]/20 blur-md" />
                      ) : null}
                    </span>
                  </button>
                </div>
                {!last ? (
                  <div
                    className="my-1 mr-[13px] h-5 w-px shrink-0 bg-gradient-to-b from-white/25 to-white/5"
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* 小屏：底部横向可滚动步骤条 */}
      <nav
        aria-label="页面区块导航"
        className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 border-t border-white/10 bg-black/55 px-2 py-2 backdrop-blur-lg xl:hidden"
      >
        <div className="pointer-events-auto mx-auto flex max-w-full gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HOME_PAGE_STEPS.map((step, i) => {
            const active = step.id === activeId;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => go(step.id)}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "border-[#39ff14]/60 bg-[#39ff14]/15 text-[#39ff14]"
                    : "border-white/12 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-100"
                }`}
              >
                <span className="text-[10px] text-zinc-500">{i + 1}.</span>{" "}
                {step.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
