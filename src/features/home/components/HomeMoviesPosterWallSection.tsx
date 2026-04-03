/**
 * File: `src/features/home/components/HomeMoviesPosterWallSection.tsx`
 * Purpose:
 * - 首页中的“电影海报墙”栏目（预览版：固定展示 9 张）。
 *
 * 设计目标：
 * - 首页只展示一个精致的电影预览区，作为“兴趣内容”的扩展（电影品味）
 * - 标题可点击跳转到 `/movies`（完整电影墙）
 * - 海报尺寸与摄影区竖版卡片保持接近，保证首页两个区域的视觉节奏统一
 * - 具体交互（滚动入场、hover、点击弹出详情卡片）由 client 组件负责
 */

import MoviePosterWallClient from "@/features/movies/components/MoviePosterWallClient";
import { getHomeMoviePosters } from "@/features/movies/lib/movies";

export default async function HomeMoviesPosterWallSection() {
  const movies = await getHomeMoviePosters();

  return (
    <MoviePosterWallClient
      movies={movies}
      title="电影海报墙 / Films"
      subtitle="我喜欢的 9 部电影，卡片尺寸与下方摄影区保持统一。"
      titleHref="/movies"
      sectionClassName="mt-0"
    />
  );
}
