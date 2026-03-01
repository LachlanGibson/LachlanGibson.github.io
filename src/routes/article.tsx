import Article from "../blog/Article";
import articleMetaData from "../blog/articleMetaData";

const siteRoot = "https://www.lachlangibson.dev";

export function meta(
  { params }: { params?: { slug?: string } } = {}
) {
  const slug = params?.slug;
  const article = slug ? articleMetaData[slug] : undefined;

  if (!article || !slug) {
    return [
      { title: "Article Not Found - Lachlan Gibson" },
      { name: "robots", content: "noindex, follow" },
    ];
  }

  const url = `${siteRoot}/blog/${slug}/`;
  const imageUrl = article.imageLink ? `${siteRoot}${article.imageLink}` : "";
  const modifiedDate = article.modifiedDateISO || article.publishedDateISO;

  return [
    { title: article.title },
    { name: "description", content: article.description },
    { name: "author", content: article.author },
    { name: "language", content: article.language },
    { property: "og:title", content: article.title },
    { property: "og:type", content: article.type },
    { property: "og:description", content: article.description },
    { property: "og:url", content: url },
    ...(imageUrl
      ? [
          { property: "og:image", content: imageUrl },
          { property: "og:image:width", content: article.imageResolution[0] },
          { property: "og:image:height", content: article.imageResolution[1] },
          { name: "twitter:image", content: imageUrl },
        ]
      : []),
    { property: "article:author", content: siteRoot },
    { property: "article:publisher", content: siteRoot },
    { property: "article:published_time", content: article.publishedDateISO },
    { property: "article:modified_time", content: modifiedDate },
    ...(article.metaTags?.map((tag) => ({
      property: "article:tag",
      content: tag,
    })) || []),
    ...(article.metaTags
      ? [{ name: "keywords", content: article.metaTags.join(", ") }]
      : []),
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: article.title },
    { name: "twitter:description", content: article.description },
    { name: "robots", content: "index, follow" },
  ];
}

export function links(
  { params }: { params?: { slug?: string } } = {}
) {
  const slug = params?.slug;
  if (!slug) return [];
  return [{ rel: "canonical", href: `${siteRoot}/blog/${slug}/` }];
}

export default function ArticleRoute() {
  return <Article />;
}
