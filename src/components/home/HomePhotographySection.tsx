/**
 * File: `src/components/home/HomePhotographySection.tsx`
 * Purpose:
 * - 首页「摄影作品」栏目：服务端取数后交给 `PhotographyCarouselClient` 渲染。
 */

import PhotographyCarouselClient from "./PhotographyCarouselClient";
import { getPhotographyItems } from "@/lib/photography";

export default async function HomePhotographySection() {
  const items = await getPhotographyItems();

  return (
    <PhotographyCarouselClient
      items={items}
      title="摄影作品 / Photography"
      subtitle="横向浏览；中间三张为清晰焦点，仅最外侧渐隐模糊。点击图片可全屏查看（当前为电影海报占位）。"
    />
  );
}
