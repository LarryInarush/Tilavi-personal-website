/**
 * File: `src/components/home/HomeModulePlaceholderSection.tsx`
 * Purpose:
 * - 首页「未来模块」占位：宽版、加高区块 + 大号标题文案，便于先定版心与锚点，后续再替换为真实内容。
 * - 由 `HomeLandingRoute` 挂载；`id` 与 `HomeSectionStepperClient` 中的步骤一一对应。
 */

type Props = {
  id: string;
  title: string;
  titleEn?: string;
  kicker?: string;
};

export default function HomeModulePlaceholderSection({
  id,
  title,
  titleEn,
  kicker = "敬请期待",
}: Props) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(12,14,18,0.92),rgba(6,8,12,0.88))] px-8 py-20 shadow-[0_0_0_1px_rgba(0,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm md:px-14 md:py-28 min-h-[min(520px,85vw)] md:min-h-[560px]"
    >
      <div className="mx-auto flex min-h-[min(320px,50vh)] max-w-4xl flex-col items-center justify-center text-center md:min-h-[360px]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#39ff14]/75">
          {kicker}
        </p>
        <h2 className="font-photo-display mt-6 text-4xl font-medium italic leading-[1.1] tracking-[0.02em] text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
          <span
            className="bg-[linear-gradient(92deg,#f4f4f5_0%,#a1a1aa_45%,#e4e4e7_100%)] bg-clip-text text-transparent"
            style={{
              textShadow:
                "0 0 60px rgba(0,255,255,0.08), 0 0 100px rgba(57,255,20,0.06)",
            }}
          >
            {title}
          </span>
        </h2>
        {titleEn ? (
          <p className="mt-5 max-w-xl font-sans text-sm font-medium text-zinc-500 md:text-base">
            {titleEn}
          </p>
        ) : null}
        <p className="mt-10 max-w-md text-sm leading-relaxed text-zinc-500">
          内容开发中 — 模块区域已预留，后续可接列表、时间线或第三方服务。
        </p>
        <div className="mt-12 h-px w-full max-w-sm bg-[linear-gradient(90deg,transparent,rgba(57,255,20,0.35),rgba(0,255,255,0.35),transparent)]" />
      </div>
    </section>
  );
}
