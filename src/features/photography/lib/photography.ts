/**
 * File: `src/features/photography/lib/photography.ts`
 * Purpose:
 * - 摄影作品模块的数据层：为首页横向陈列与全屏查看提供条目列表。
 *
 * 当前策略：
 * - 真实摄影作品尚未提供时，复用电影模块的数据源作为占位图。
 * - 之后你只需改本文件的数据源（或改为读取 Markdown / CMS），UI 无需大改。
 */

import { getMoviesCatalog } from "@/features/movies/lib/movies";

export type PhotographyItem = {
  id: string;
  /** 展示标题（中文） */
  titleZh: string;
  /** 副标题（英文或说明） */
  titleEn?: string;
  /** 图片 URL（public 路径或远程） */
  imageSrc: string;
};

/**
 * 首页摄影条使用的条目数量（与电影占位数量一致即可按需调整）。
 */
const HOME_PHOTO_COUNT = 9;

/**
 * 返回摄影陈列数据（当前为电影海报占位）。
 */
export async function getPhotographyItems(): Promise<PhotographyItem[]> {
  const movies = await getMoviesCatalog();
  return movies.slice(0, HOME_PHOTO_COUNT).map((movie) => ({
    id: `ph-${movie.id}`,
    titleZh: movie.titleZh,
    titleEn: movie.titleEn,
    imageSrc: movie.posterSrc,
  }));
}
