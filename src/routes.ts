import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/article-not-found", "routes/article-not-found.tsx"),
    route("blog/:slug", "routes/article.tsx"),
  ]),
] satisfies RouteConfig;
