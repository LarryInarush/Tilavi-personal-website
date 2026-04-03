/**
 * File: `src/features/movies/lib/movies.ts`
 * Purpose:
 * - 电影模块的数据层（movies content layer）。
 *
 * 设计目标：
 * - 用一个“可维护的数据源”描述你看过/喜欢的电影（标题、年份、海报资源、简介等）。
 * - 提供分页与查询能力，供：
 *   - 首页“9张海报墙”预览区使用
 *   - `/movies` 完整电影页使用（分页）
 *
 * 重要约束：
 * - 当前项目没有独立数据库；电影数据与文章数据一致，采用“本地内容源”的方式维护。
 * - 海报资源放在 `public/movies/posters/` 下，通过 URL path 引用（`/movies/posters/<file>.svg`）。
 */

export type Movie = {
  /**
   * 稳定唯一 id，用于：
   * - React list key
   * - 点击打开详情卡片时的定位
   */
  id: string;
  titleZh: string;
  titleEn: string;
  year: number;
  /**
   * 海报资源路径（public 下的文件，以 / 开头）。
   */
  posterSrc: string;
  /**
   * 一句话简介：用于卡片与列表页快速扫读。
   */
  taglineZh: string;
  taglineEn: string;
  /**
   * 更详细的信息（可持续补充）。
   * - director/genres/rating 等你以后想加都可以扩展这里
   */
  notesZh: string;
  notesEn: string;
  genres: string[];
  /**
   * TMDB 电影 ID（可选）：
   * - 有值时可用 TMDB API 拉取海报与补充信息
   * - 无值时保留本地静态数据
   */
  tmdbId?: number;
  /**
   * TMDB 拉取后的扩展字段（无 key 或未请求时为 undefined）。
   */
  tmdbOverviewZh?: string;
  tmdbOverviewEn?: string;
  tmdbTaglineZh?: string;
  tmdbTaglineEn?: string;
  tmdbRuntimeMin?: number;
  tmdbVoteAverage?: number;
  tmdbVoteCount?: number;
  tmdbReleaseDate?: string;
  tmdbOriginalLanguage?: string;
  tmdbProductionCountries?: string[];
  directors?: string[];
  /** 主要演员（姓名 + 片中角色） */
  castTop?: { name: string; character: string }[];
};

/**
 * 电影数据源（你可以在这里持续维护）。
 *
 * 说明：
 * - 当前海报为“自制酸性风格 SVG 海报”，避免直接使用电影官方海报的版权风险。
 * - 你未来如果想替换成真实海报：只需把 `posterSrc` 指向你放进 public 的 jpg/png 即可。
 */
export const MOVIES: Movie[] = [
  {
    id: "inception-2010",
    titleZh: "盗梦空间",
    titleEn: "Inception",
    year: 2010,
    posterSrc: "/movies/posters/inception.svg",
    taglineZh: "梦里套梦，规则像代码一样精确。",
    taglineEn: "Dreams inside dreams—precision like code.",
    notesZh:
      "喜欢它的结构感：层层递进、时间尺度变化、并发般的叙事节奏。每次重看都能发现新的细节。",
    notesEn:
      "I love its architecture: layered structure, shifting time scales, and a parallel narrative rhythm. Every rewatch reveals new details.",
    genres: ["Sci‑Fi", "Thriller"],
    tmdbId: 27205,
  },
  {
    id: "interstellar-2014",
    titleZh: "星际穿越",
    titleEn: "Interstellar",
    year: 2014,
    posterSrc: "/movies/posters/interstellar.svg",
    taglineZh: "把宇宙拍得像一段巨大的长镜头。",
    taglineEn: "The cosmos as a long take.",
    notesZh:
      "宏大但不空：科学设定 + 情感主线并行推进。配乐、镜头和节奏像是把人直接带进真空。",
    notesEn:
      "Grand yet grounded: scientific ideas and emotional arc move in parallel. The score and pacing pull you straight into the void.",
    genres: ["Sci‑Fi", "Drama"],
    tmdbId: 157336,
  },
  {
    id: "blade-runner-2049",
    titleZh: "银翼杀手 2049",
    titleEn: "Blade Runner 2049",
    year: 2017,
    posterSrc: "/movies/posters/blade-runner-2049.svg",
    taglineZh: "霓虹与孤独，像夜里写代码。",
    taglineEn: "Neon and loneliness—like coding at night.",
    notesZh:
      "视觉与氛围极强，赛博城市的空旷感很迷人。慢节奏反而更像在“走进一张照片”。",
    notesEn:
      "Visually and atmospherically powerful. The emptiness of the cyber city is hypnotic. The slow pace feels like stepping into a photograph.",
    genres: ["Sci‑Fi", "Neo‑Noir"],
    tmdbId: 335984,
  },
  {
    id: "whiplash-2014",
    titleZh: "爆裂鼓手",
    titleEn: "Whiplash",
    year: 2014,
    posterSrc: "/movies/posters/whiplash.svg",
    taglineZh: "节奏、压迫、极限训练。",
    taglineEn: "Rhythm, pressure, obsession.",
    notesZh: "它像滑板练动作：重复、摔倒、再来。你能感受到“想变强”的痛与爽。",
    notesEn:
      "It’s like drilling skate tricks: repetition, slams, and going again. You can feel the pain and thrill of getting better.",
    genres: ["Drama", "Music"],
    tmdbId: 244786,
  },
  {
    id: "parasite-2019",
    titleZh: "寄生虫",
    titleEn: "Parasite",
    year: 2019,
    posterSrc: "/movies/posters/parasite.svg",
    taglineZh: "阶层像一堵看不见的墙。",
    taglineEn: "Class is an invisible wall.",
    notesZh:
      "叙事刀法很准：你以为是喜剧，下一秒就变成惊悚；空间调度像在解一个现实世界的谜题。",
    notesEn:
      "Surgical storytelling: you think it’s comedy, then it flips into thriller. The spatial choreography feels like solving a real-world puzzle.",
    genres: ["Thriller", "Drama"],
    tmdbId: 496243,
  },
  {
    id: "spider-verse-2018",
    titleZh: "蜘蛛侠：平行宇宙",
    titleEn: "Spider‑Man: Into the Spider‑Verse",
    year: 2018,
    posterSrc: "/movies/posters/spider-verse.svg",
    taglineZh: "把漫画的颗粒感做成了动效。",
    taglineEn: "Comic grain turned into motion.",
    notesZh:
      "风格化到极致，色彩与节奏都像说唱的 flow：断点、重拍、层叠的视觉采样。",
    notesEn:
      "Maximal style. Colors and pacing feel like rap flow—breaks, hits, layered visual sampling.",
    genres: ["Animation", "Action"],
    tmdbId: 324857,
  },
  {
    id: "mad-max-fury-road-2015",
    titleZh: "疯狂的麦克斯：狂暴之路",
    titleEn: "Mad Max: Fury Road",
    year: 2015,
    posterSrc: "/movies/posters/mad-max-fury-road.svg",
    taglineZh: "纯粹的速度与动线。",
    taglineEn: "Pure speed and motion lines.",
    notesZh: "极致动作设计，镜头语言非常清晰，像把“动线”刻在视网膜上。",
    notesEn:
      "Peak action design with crystal-clear visual language—motion lines carved into your retina.",
    genres: ["Action", "Adventure"],
    tmdbId: 76341,
  },
  {
    id: "her-2013",
    titleZh: "她",
    titleEn: "Her",
    year: 2013,
    posterSrc: "/movies/posters/her.svg",
    taglineZh: "温柔的未来感。",
    taglineEn: "A gentle future.",
    notesZh:
      "配色与情绪都很克制，但后劲很强。它的“科技感”不是炫技，而是生活化的细节。",
    notesEn:
      "Restrained colors and emotions, but it lingers. Its ‘tech’ isn’t flashy—it’s in the everyday details.",
    genres: ["Romance", "Sci‑Fi"],
    tmdbId: 152601,
  },
  {
    id: "the-dark-knight-2008",
    titleZh: "黑暗骑士",
    titleEn: "The Dark Knight",
    year: 2008,
    posterSrc: "/movies/posters/the-dark-knight.svg",
    taglineZh: "秩序与混乱的对抗。",
    taglineEn: "Order vs. chaos.",
    notesZh:
      "人物张力与主题都很硬。它不只是英雄片，更像一场关于规则与人性的辩论。",
    notesEn:
      "Hard tension and themes. Not just a superhero film—more like a debate about rules and human nature.",
    genres: ["Action", "Crime"],
    tmdbId: 155,
  },
];

export type MoviesPage = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Movie[];
};

type TmdbCredits = {
  cast?: { name: string; character: string }[];
  crew?: { name: string; job: string }[];
};

type TmdbMovieDetailZh = {
  poster_path: string | null;
  overview?: string;
  tagline?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  original_language?: string;
  production_countries?: { name: string }[];
  credits?: TmdbCredits;
};

type TmdbMovieDetailEn = {
  overview?: string;
  tagline?: string;
};

function getTmdbApiKey(): string | null {
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key) return null;
  return key;
}

/**
 * 并行请求 zh-CN（含 credits）与 en-US（英文简介/tagline），合并为一条 enriched 记录。
 */
async function fetchTmdbMovieEnriched(tmdbId: number, apiKey: string) {
  const base = `https://api.themoviedb.org/3/movie/${tmdbId}`;
  const [zhRes, enRes] = await Promise.all([
    fetch(
      `${base}?api_key=${apiKey}&language=zh-CN&append_to_response=credits`,
      { next: { revalidate: 60 * 60 * 24 } },
    ),
    fetch(`${base}?api_key=${apiKey}&language=en-US`, {
      next: { revalidate: 60 * 60 * 24 },
    }),
  ]);
  if (!zhRes.ok) return null;
  const zh = (await zhRes.json()) as TmdbMovieDetailZh;
  const en = enRes.ok ? ((await enRes.json()) as TmdbMovieDetailEn) : {};

  const crew = zh.credits?.crew ?? [];
  const directors = crew
    .filter((c) => c.job === "Director")
    .map((c) => c.name)
    .filter(Boolean);

  const castTop = (zh.credits?.cast ?? []).slice(0, 12).map((c) => ({
    name: c.name,
    character: c.character || "—",
  }));

  const countries = (zh.production_countries ?? [])
    .map((c) => c.name)
    .filter(Boolean);

  return {
    poster: zh.poster_path,
    tmdbOverviewZh: zh.overview?.trim() || undefined,
    tmdbOverviewEn: en.overview?.trim() || undefined,
    tmdbTaglineZh: zh.tagline?.trim() || undefined,
    tmdbTaglineEn: en.tagline?.trim() || undefined,
    tmdbRuntimeMin: typeof zh.runtime === "number" ? zh.runtime : undefined,
    tmdbVoteAverage: zh.vote_average,
    tmdbVoteCount: zh.vote_count,
    tmdbReleaseDate: zh.release_date,
    tmdbOriginalLanguage: zh.original_language,
    tmdbProductionCountries: countries.length ? countries : undefined,
    directors: directors.length ? directors : undefined,
    castTop: castTop.length ? castTop : undefined,
  };
}

function toTmdbPosterUrl(pathname: string | null): string | null {
  if (!pathname) return null;
  return `https://image.tmdb.org/t/p/w780${pathname}`;
}

/**
 * 获取“可供 UI 使用”的电影列表（优先 TMDB 海报，失败自动回退本地海报）。
 *
 * 行为策略：
 * - 若未配置 `TMDB_API_KEY`：直接返回本地 MOVIES（无网络依赖）
 * - 若配置了 key：逐条尝试拉取海报；任何失败都只影响单条，不中断整体渲染
 */
export async function getMoviesCatalog(): Promise<Movie[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return MOVIES;

  const enriched = await Promise.all(
    MOVIES.map(async (movie) => {
      if (!movie.tmdbId) return movie;
      try {
        const detail = await fetchTmdbMovieEnriched(movie.tmdbId, apiKey);
        if (!detail) return movie;
        const poster = toTmdbPosterUrl(detail.poster ?? null);
        return {
          ...movie,
          posterSrc: poster ?? movie.posterSrc,
          tmdbOverviewZh: detail.tmdbOverviewZh,
          tmdbOverviewEn: detail.tmdbOverviewEn,
          tmdbTaglineZh: detail.tmdbTaglineZh,
          tmdbTaglineEn: detail.tmdbTaglineEn,
          tmdbRuntimeMin: detail.tmdbRuntimeMin,
          tmdbVoteAverage: detail.tmdbVoteAverage,
          tmdbVoteCount: detail.tmdbVoteCount,
          tmdbReleaseDate: detail.tmdbReleaseDate,
          tmdbOriginalLanguage: detail.tmdbOriginalLanguage,
          tmdbProductionCountries: detail.tmdbProductionCountries,
          directors: detail.directors,
          castTop: detail.castTop,
        };
      } catch {
        return movie;
      }
    }),
  );

  return enriched;
}

/**
 * 读取“首页电影预览”数据：固定 9 个。
 */
export async function getHomeMoviePosters(): Promise<Movie[]> {
  const catalog = await getMoviesCatalog();
  return catalog.slice(0, 9);
}

/**
 * 获取分页电影数据。
 *
 * 重要细节：
 * - page 从 1 开始（对 URL 更自然：`/movies?page=2`）
 * - 任何非法 page 输入都会被收敛到有效范围（避免页面崩溃）
 */
export async function getMoviesPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<MoviesPage> {
  const catalog = await getMoviesCatalog();
  const safePageSize = Math.max(1, Math.min(pageSize, 48));
  const totalItems = catalog.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));

  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const items = catalog.slice(start, end);

  return {
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    items,
  };
}

/**
 * 根据 id 获取电影详情（用于 modal）。
 */
export function getMovieById(id: string): Movie | null {
  return MOVIES.find((m) => m.id === id) ?? null;
}
