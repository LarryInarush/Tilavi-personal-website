/**
 * Next.js App Router 的根路由入口。
 *
 * 重要说明：
 * - 对于 `src/app/page.tsx`，Next.js 规定它必须叫 `page.tsx`，
 *   才会把它作为 `/` 路由渲染入口。
 * - 因此这里保持“极薄”，把真正的 UI 逻辑拆到按功能区域组织的
 *   `src/features/home/routes/HomeLandingRoute.tsx`。
 */
import HomeLandingRoute from "@/features/home/routes/HomeLandingRoute";

export default HomeLandingRoute;
