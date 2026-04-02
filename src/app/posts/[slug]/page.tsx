/**
 * `/posts/[slug]` 路由入口（Next.js App Router 强制文件名）。
 *
 * - `generateStaticParams()` 告诉 Next.js：构建时要为哪些 slug 生成静态页面。
 * - 真正的 UI 与数据读取逻辑在 `PostDetailsRoute.tsx` 中。
 *
 * 这个文件的设计目标：
 * - 保持“入口极薄”：让你在未来更改详情页 UI/数据读取时只需要改 `PostDetailsRoute.tsx`。
 */
import { getAllPosts } from "@/lib/posts";
import PostDetailsRoute from "./PostDetailsRoute";

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostDetailsRoutePage({
	params,
}: {
	params: { slug: string };
}) {
	// 把路由参数转交给业务组件
	return <PostDetailsRoute slug={params.slug} />;
}
