/**
 * Next.js App Router 的根路由入口。
 *
 * 重要说明：
 * - 对于 `src/app/page.tsx`，Next.js 规定它必须叫 `page.tsx`，
 *   才会把它作为 `/` 路由渲染入口。
 * - 因此这里保持“极薄”，把真正的 UI 逻辑拆到语义化文件名：
 *   `HomeLandingRoute.tsx`，从而满足你“减少无意义重名”的可读性诉求。
 */
import HomeLandingRoute from "./HomeLandingRoute";

export default HomeLandingRoute;
