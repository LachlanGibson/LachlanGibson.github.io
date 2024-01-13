import React from "react";
import { Helmet } from "react-helmet";
import articleMetaData from "./articleMetaData";
import ArticleCard from "./ArticleCard";
import "./Blog.css";

const Blog: React.FC<{}> = () => {
  return (
    <>
      <Helmet>
        <title>Lachlan Gibson - Blog</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-3">Blog</h1>
      <div className="blog-list-div">
        {Object.keys(articleMetaData).map((slug) => (
          <ArticleCard
            key={slug}
            slug={slug}
            title={articleMetaData[slug].title}
            timeElement={articleMetaData[slug].timeElement}
            imageLink={articleMetaData[slug].imageLink}
          />
        ))}
      </div>
    </>
  );
};

export default Blog;
