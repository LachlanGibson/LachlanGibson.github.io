import React from "react";
import { ArticleType } from "./articleMetaData";
import { Helmet } from "react-helmet";

const BlogMetaData: React.FC<{ slug: string; metaData: ArticleType }> = ({
  slug,
  metaData,
}) => {
  return (
    <Helmet>
      <title>{metaData.title}</title>
      <meta property="og:title" content={metaData.title} />
      <meta property="og:type" content={metaData.type} />
      <meta property="og:description" content={metaData.description} />
      <meta name="description" content={metaData.description} />
      <meta name="language" content={metaData.language}></meta>
      <meta name="author" content={metaData.author} />
      <meta
        property="article:author"
        content="https://www.lachlangibson.dev/"
      />
      <meta
        property="article:publisher"
        content="https://www.lachlangibson.dev/"
      />
      <meta
        property="og:url"
        content={`https://www.lachlangibson.dev/blog/${slug}`}
      />
      <link
        rel="canonical"
        href={`https://www.lachlangibson.dev/blog/${slug}`}
      />

      <meta
        property="article:published_time"
        content={metaData.publishedDateISO}
      />
      <meta
        property="article:modified_time"
        content={
          metaData.modifiedDateISO
            ? metaData.modifiedDateISO
            : metaData.publishedDateISO
        }
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={metaData.title} />
      <meta name="twitter:description" content={metaData.description} />
      {metaData.imageLink && [
        <meta
          key="og:image:width"
          property="og:image:width"
          content={metaData.imageResolution[0]}
        />,
        <meta
          key="og:image:height"
          property="og:image:height"
          content={metaData.imageResolution[1]}
        />,
        <meta
          key="og:image"
          property="og:image"
          content={`https://www.lachlangibson.dev${metaData.imageLink}`}
        />,
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`https://www.lachlangibson.dev${metaData.imageLink}`}
        />,
      ]}
      {metaData.metaTags && (
        <meta name="keywords" content={metaData.metaTags.join(", ")} />
      )}
      {metaData.metaTags?.map((tag, index) => (
        <meta key={`meta tag ${index}`} property="article:tag" content={tag} />
      ))}
      {metaData.otherMetaElements?.map((element, index) =>
        React.cloneElement(element, { key: index })
      )}
    </Helmet>
  );
};

export default BlogMetaData;
