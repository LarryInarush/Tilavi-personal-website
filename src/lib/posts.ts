/**
 * File: `src/lib/posts.ts`
 * Purpose:
 * - 这是“文章数据层 / content layer”的核心实现。
 *
 * 背景：
 * - 你希望用本地维护的 Markdown 文件（`content/posts/*.md`）来扩展个人主页内容。
 * - Next.js 在渲染 `/posts` 与 `/posts/[slug]` 时，需要读取这些 Markdown，并把它们转换成可展示的数据结构。
 *
 * 主要职责：
 * - `getAllPosts()`：读取目录下所有 `.md`，解析 frontmatter，返回文章 meta 列表（用于列表页和首页最新文章）。
 * - `getPostBySlug()`：根据 slug 读取单篇 `.md`，解析 frontmatter，并把 Markdown 正文转换成 HTML（用于详情页）。
 *
 * 实现细节（重要）：
 * - 使用 `gray-matter` 解析 frontmatter。
 * - 使用 `remark` + `remark-html` 把 Markdown 转为 HTML。
 * - 上层页面用 `dangerouslySetInnerHTML` 渲染 HTML。
 *   因此未来如果你允许用户输入不可信 Markdown，需要增加更严格的 HTML/Markdown 过滤策略。
 */
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * Posts data layer (server-side only).
 *
 * 这个文件负责把你本地维护的 Markdown 内容转换成前端需要的数据结构：
 * - 读取 `content/posts/*.md`
 * - 解析 frontmatter（gray-matter）
 * - 把 Markdown 正文转换成 HTML（remark + remark-html）
 * - 提供给 App Router 路由（`/posts`、`/posts/[slug]`）使用
 *
 * 设计选择：
 * - `getAllPosts()`：只返回文章列表需要的 meta（不包含 contentHtml），避免不必要的转换开销。
 * - `getPostBySlug()`：在详情页按需读取并渲染 Markdown。
 *
 * 注意点：
 * - 这里是服务端读取文件，因此函数必须是 server 环境才能运行（Next.js 默认 App Router 的 server component 支持）。
 * - 使用 `dangerouslySetInnerHTML` 的上层页面会信任 `remark-html` 输出。
 *   你后续如果要更严格的安全策略，可以扩展 remark 的渲染/过滤规则。
 */
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // keep as string from frontmatter
  excerpt?: string;
  tags?: string[];
};

export type Post = PostMeta & {
  contentHtml: string;
};

/**
 * 文章目录绝对路径。
 *
 * 采用 `process.cwd()` 的原因：
 * - 当 Next.js 跑在不同目录时（开发/构建），我们仍希望相对项目根目录读取固定路径。
 * - 由于你把内容放在 `site/content/posts/`，所以只要保持目录不变，这个逻辑就稳定。
 */
const postsDir = path.join(process.cwd(), "content/posts");

/**
 * frontmatter -> PostMeta（除 contentHtml 之外的部分）
 *
 * 为了让类型更安全：
 * - 我们要求 `title` 必须是字符串
 * - `date` 必须是字符串（用于排序）
 *
 * 如果你未来 frontmatter 变复杂，可以在这里扩展校验规则。
 */
function parseFrontmatter(frontmatter: unknown): Omit<Post, "contentHtml"> {
  // gray-matter 的 parsed.data 类型是 unknown，这里做手动校验/收敛类型。
  const fm = frontmatter as Partial<PostMeta>;
  if (!fm || typeof fm !== "object") {
    throw new Error("Invalid frontmatter");
  }

  // title：用于列表展示和详情页标题。
  if (typeof fm.title !== "string") {
    throw new Error("Post frontmatter missing `title`");
  }

  // date：用于排序（最新优先）。这里保持 string，最终用 `new Date(date)` 转换。
  if (typeof fm.date !== "string") {
    throw new Error("Post frontmatter missing `date`");
  }

  // 返回一个“未填 slug”的 meta（slug 由文件名推导出来）。
  return {
    title: fm.title,
    date: fm.date,
    excerpt: fm.excerpt,
    tags: fm.tags,
    slug: "", // filled later
  };
}

/**
 * 读取所有文章的 meta 列表。
 *
 * 使用场景：
 * - `/posts`：只需要 meta，不需要把 Markdown 全部转 HTML（更省时）。
 * - 首页：取最新 N 篇（这里复用这个函数拿到排序结果）。
 * - `generateStaticParams()`：构建时需要知道所有 slug。
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  // 读取目录文件名列表，例如：["welcome-my-site.md", ...]
  const filenames = await fs.readdir(postsDir);

  // 并行处理每个文件：
  // - 过滤 .md
  // - 读取文件内容
  // - parse frontmatter
  // - 生成 slug
  const posts = await Promise.all(
    filenames
      .filter((name) => name.endsWith(".md"))
      .map(async (filename) => {
        // slug 就是文件名去掉 .md 后的部分
        const slug = filename.replace(/\.md$/, "");

        const filePath = path.join(postsDir, filename);

        // 读取 Markdown 原文
        const raw = await fs.readFile(filePath, "utf8");

        // gray-matter：把 `--- ... ---` frontmatter 与正文分离
        const parsed = matter(raw);

        // 将 frontmatter 提取成 meta
        const meta = parseFrontmatter(parsed.data);
        return {
          ...meta,
          slug,
        };
      }),
  );

  // newest first（date 字符串排序的前提是你保持 ISO-8601 风格的日期）
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 根据 slug 读取并渲染单篇文章。
 *
 * 使用场景：
 * - `/posts/[slug]`：详情页需要完整 contentHtml。
 *
 * 错误处理策略：
 * - 如果文件读取失败/解析失败：返回 null，让上层触发 Next.js 404。
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 详情页的 slug 对应文件名：content/posts/${slug}.md
  const filePath = path.join(postsDir, `${slug}.md`);

  try {
    // 读取 Markdown
    const raw = await fs.readFile(filePath, "utf8");

    // 解析 frontmatter + 正文
    const parsed = matter(raw);

    const meta = parseFrontmatter(parsed.data);

    // 正文（不包含 frontmatter）
    const content = parsed.content ?? "";

    // Markdown -> HTML
    // remark 是 Markdown AST 工具，remark-html 把 AST 转成 HTML 字符串。
    const contentHtml = await remark()
      .use(remarkHtml)
      .process(content)
      .then((file) => String(file));

    // 合并 meta + contentHtml，返回给详情页渲染
    return {
      ...meta,
      slug,
      contentHtml,
    };
  } catch {
    // 任何异常都认为“文章不存在/不可解析”
    return null;
  }
}

