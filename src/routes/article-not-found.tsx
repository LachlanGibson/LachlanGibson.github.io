import ArticleNotFound from "../blog/ArticleNotFound";

const title = "Article Not Found - Lachlan Gibson";
const pageUrl = "https://www.lachlangibson.dev/articles/article-not-found/";

export function meta() {
  return [{ title }, { name: "robots", content: "noindex, follow" }];
}

export function links() {
  return [{ rel: "canonical", href: pageUrl }];
}

export default function ArticleNotFoundRoute() {
  return <ArticleNotFound />;
}
