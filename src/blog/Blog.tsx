import React from "react";
import articleMetaData from "./articleMetaData";
import ArticleCard from "./ArticleCard";

const Blog: React.FC = () => {
  return (
    <>
      <h1 className="text-xl font-bold mb-3">Blog</h1>
      <div
        className="grid gap-4 justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))" }}
      >
        {Object.keys(articleMetaData).map((slug) => (
          <ArticleCard
            key={slug}
            slug={slug}
            title={`${
              articleMetaData[slug].titleShort
                ? articleMetaData[slug].titleShort
                : articleMetaData[slug].title
            }`}
            publishedDateISO={articleMetaData[slug].publishedDateISO}
            publishedDateLabel={articleMetaData[slug].publishedDateLabel}
            svgLink={articleMetaData[slug].svgLink}
          />
        ))}
      </div>
    </>
  );
};

export default Blog;
