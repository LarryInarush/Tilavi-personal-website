/**
 * File: `src/app/HomeHeroLanding.tsx`
 * Purpose:
 * - 首页顶部“英雄区（Hero）”的动效实现（方案 C：切片式纯视觉动效）。
 *
 * Hero 区实现目标：
 * - 使用 `public/hero/hero-bg-01.jpg` 作为单一背景图片
 * - 将图片切成若干“从左到右的垂直切片”
 * - 页面首次加载时，使用 `framer-motion` 让切片与文字：
 *   - 从模糊/位移到稳定
 *   - 切片按从左到右顺序逐个滑入（stagger）
 * - 同时提供中英双语文案（中文为主，英文为副文案）
 *
 * 约束说明：
 * - 本组件需要在客户端执行动画，因此使用 `use client`
 * - 切片通过 `background-image` 与精确的 `background-size/background-position` 进行裁切
 */
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import TheTilaviLogoMark from "./TheTilaviLogoMark";

const HERO_IMAGE_SRC = "/hero/hero-bg-01.jpg";

// 切片数量：越多切片越细，但动画节奏会更“碎”。
const SLICE_COUNT = 4;

export default function HomeHeroLanding() {
	return (
		<section
			aria-label="Homepage hero"
			className="relative h-[520px] w-full overflow-hidden bg-zinc-950 sm:h-[580px] md:h-[660px]"
		>
			{/* 图片切片层：按 x 方向切片，并按从左到右 stagger 动画。 */}
			<div className="absolute inset-0" aria-hidden="true">
				{Array.from({ length: SLICE_COUNT }).map((_, index) => {
					// 每个切片占据 hero 宽度的 1/SLICE_COUNT。
					const sliceLeftPercent = (index * 100) / SLICE_COUNT;
					const sliceWidthPercent = 100 / SLICE_COUNT;

					// 裁切实现：
					// - 每个切片使用同一张背景图
					// - backgroundSize 的宽度设为 sliceCount*100%，使背景横向“可被切片”
					// - backgroundPositionX 采用公式 p = 100*i/SLICE_COUNT，
					//   保证第 i 个切片视窗对应整张背景的第 i 段
					const backgroundSize = `${SLICE_COUNT * 100}% 100%`;
					const backgroundPositionX = `${(index * 100) / SLICE_COUNT}%`;

					return (
						<motion.div
							key={index}
							className="absolute top-0 h-full overflow-hidden"
							style={{
								left: `${sliceLeftPercent}%`,
								width: `${sliceWidthPercent}%`,
								backgroundImage: `url("${HERO_IMAGE_SRC}")`,
								backgroundSize,
								backgroundPositionX,
								backgroundPositionY: "center",
								backgroundRepeat: "no-repeat",
							}}
							initial={{
								x: -28,
								opacity: 0,
								filter: "blur(10px)",
							}}
							animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
							transition={{
								// 从左到右：index 越小 delay 越小
								delay: index * 0.12,
								duration: 0.8,
								ease: [0.22, 1, 0.36, 1],
							}}
						/>
					);
				})}
			</div>

			{/* 深色蒙版：提升文字可读性，并把摄影质感“压”到背景层。 */}
			<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-zinc-950/0" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_15%_0%,rgba(57,255,20,0.12),transparent_60%),radial-gradient(900px_360px_at_85%_0%,rgba(191,0,255,0.12),transparent_60%)]" />

			{/* 内容层：首次进入动画（CSS）由 class + delay 控制。 */}
			<div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-14">
				<motion.div
					initial={{ x: -18, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{
						delay: SLICE_COUNT * 0.12 + 0.08,
						duration: 0.7,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="max-w-3xl"
				>
					{/* 品牌组：把站点名/定位融入 Hero，弱化“传统导航栏的死板感” */}
					<div className="flex items-center gap-3">
						<div className="rounded-2xl border border-white/10 bg-black/20 p-2.5 backdrop-blur">
							<TheTilaviLogoMark size={40} />
						</div>
						<div className="leading-tight">
							<div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200">
								TheTilavi
							</div>
							<div className="mt-1 text-xs text-zinc-300">
								coder · photographer · rap · skate
							</div>
						</div>
					</div>

					<h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
						用照片与动作
						<span className="block text-zinc-200">
							记录街头与生活
						</span>
					</h1>

					<p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base">
						程序员 / 摄影师 / 滑手 /
						说唱爱好者。这里更新构图练习、器材小结、动作复盘，以及一些随笔。
						<span className="mt-2 block text-xs leading-6 text-zinc-300 sm:text-sm">
							I build with code, shoot with a lens, and learn on a
							board—sharing composition studies, gear notes, trick
							breakdowns, and thoughts.
						</span>
					</p>

					<div className="mt-9 flex flex-wrap items-center gap-3">
						<Link
							href="/posts"
							className="rounded-xl bg-[#39ff14] px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#2ee80e]"
						>
							进入文章 / Posts
						</Link>
						<Link
							href="#interests"
							className="rounded-xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
						>
							兴趣 / Interests
						</Link>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
