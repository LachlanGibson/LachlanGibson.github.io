import React from "react";
import articleMetaData from "./articleMetaData";
import ArticleCard from "./ArticleCard";

const Blog: React.FC = () => {
  return (
    <section className="pt-2 pb-4">
      <div className="border-b border-(--site-border) pb-3">
        <h1 className="text-4xl font-semibold tracking-[0.015em] text-(--site-text)">
          Blog
        </h1>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-4 md:gap-5">
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
    </section>
  );
};

export default Blog;
