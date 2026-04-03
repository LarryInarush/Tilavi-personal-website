/**
 * File: `src/components/layout/TheTilaviLogoMark.tsx`
 * Purpose:
 * - 提供站点品牌 `TheTilavi` 的 Logo Mark（可复用的 SVG 图形组件）。
 *
 * 设计方向（与你给的风格关键词对齐）：
 * - Dark Neon：深色底 + 霓虹绿/青色的发光边缘
 * - Acid Graphics：略带“酸性”的高对比渐变、硬朗几何形状
 *
 * 使用方式：
 * - 通常用于 header 左侧的品牌区，配合站点名 `TheTilavi` 文本一起展示
 * - 这个组件只负责图形，不负责文字（避免耦合）
 */
export default function TheTilaviLogoMark({
  size = 34,
}: {
  /**
   * Logo 的显示尺寸（宽高相同）。
   * 说明：为了让 header 视觉更稳定，我们默认 34px。
   */
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TheTilavi logo"
    >
      <defs>
        <linearGradient id="tt-neon" x1="8" y1="8" x2="56" y2="56">
          <stop stopColor="#39ff14" />
          <stop offset="0.55" stopColor="#00ffff" />
          <stop offset="1" stopColor="#bf00ff" />
        </linearGradient>
        <filter id="tt-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.8 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背板：深色圆角方形，减少“纯黑块”的廉价感 */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="14"
        fill="#050608"
        stroke="rgba(255,255,255,0.08)"
      />

      {/* 斜切高光：酸性图形的“塑料感” */}
      <path
        d="M14 22C16 14 22 10 32 10C42 10 48 14 50 22"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* TT：用几何线条构造，避免过细导致发光糊 */}
      <g filter="url(#tt-glow)" stroke="url(#tt-neon)" strokeWidth="4.5" strokeLinecap="round">
        {/* T (left) */}
        <path d="M18 22H30" />
        <path d="M24 22V44" />
        {/* T (right) */}
        <path d="M34 22H46" />
        <path d="M40 22V44" />
      </g>
    </svg>
  );
}

