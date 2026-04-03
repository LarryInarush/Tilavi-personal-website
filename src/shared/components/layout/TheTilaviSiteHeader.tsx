/**
 * File: `src/shared/components/layout/TheTilaviSiteHeader.tsx`
 * Purpose:
 * - 首页顶部 Header（叠加在 Hero 上的导航/快捷入口层）。
 *
 * 设计目标：
 * - Header 与 Hero “共享同一张背景”，所以 Header 本身保持克制：
 *   - 只提供导航/快捷入口
 *   - 不再承担大段品牌介绍（品牌介绍交由 Hero 承载）
 * - 以 Dark Neon + Acid 的细节（霓虹线/高亮边框）做点缀，但避免压过摄影大图
 *
 * 结构说明：
 * - 左侧：Logo mark（可点击回首页）
 * - 右侧：导航按钮（文章）
 */
import Link from "next/link";
import TheTilaviLogoMark from "@/shared/components/brand/TheTilaviLogoMark";

export default function TheTilaviSiteHeader() {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pt-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-2.5 py-2 backdrop-blur transition hover:border-white/18"
          aria-label="Back to home"
        >
          <TheTilaviLogoMark size={30} />
          <span className="hidden text-sm font-semibold tracking-wide text-zinc-50 sm:inline">
            TheTilavi
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/posts"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-100 backdrop-blur transition hover:border-[#39ff14]/50 hover:bg-white/10"
          >
            文章 / Posts
          </Link>
        </nav>
      </div>

      <div className="mt-4 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(57,255,20,0.70),rgba(0,255,255,0.45),rgba(191,0,255,0.35),transparent)]" />
    </header>
  );
}
