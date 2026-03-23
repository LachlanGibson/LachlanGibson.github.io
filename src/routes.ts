import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("articles", "routes/blog.tsx"),
    route("articles/article-not-found", "routes/article-not-found.tsx"),
    route("articles/:slug", "routes/article.tsx"),
  ]),
] satisfies RouteConfig;
