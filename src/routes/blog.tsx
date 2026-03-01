import Blog from "../blog/Blog";

const title = "Lachlan Gibson - Blog";
const description =
  "My blog is where I show off some of my projects and write about topics that interest me.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/blog/";

export function meta() {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: imageUrl },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "robots", content: "index, follow" },
  ];
}

export function links() {
  return [{ rel: "canonical", href: pageUrl }];
}

export default function BlogRoute() {
  return <Blog />;
}
