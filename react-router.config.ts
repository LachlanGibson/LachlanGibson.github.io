import type { Config } from "@react-router/dev/config";
import articleSlugs from "./src/blog/articleSlugs";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: async () => {
    const staticRoutes = ["/", "/about/", "/articles/", "/articles/article-not-found/"];
    const articleRoutes = articleSlugs.map((slug) => `/articles/${slug}/`);
    return [...staticRoutes, ...articleRoutes];
  },
} satisfies Config;
