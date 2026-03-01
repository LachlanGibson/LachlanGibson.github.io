import Home from "../home/Home";

const title = "Lachlan Gibson";
const description =
  "Lachlan Gibson is a data scientist and developer with experience in AI, algorithmic design, scientific computing, and data analytics.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/";

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

export default function HomeRoute() {
  return <Home />;
}
