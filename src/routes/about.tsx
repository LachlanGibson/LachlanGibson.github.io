import About from "../about/About";

const title = "Lachlan Gibson - About";
const description =
  "Lachlan Gibson is a software engineer with a background in physics, simulation, machine learning, and scientific computing.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/about/";

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

export default function AboutRoute() {
  return <About />;
}
