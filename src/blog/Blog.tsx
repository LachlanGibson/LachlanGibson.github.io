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
      <h1>Blog</h1>
      <div className="blog-list-div">
        {Object.keys(articleMetaData).map((slug) => (
          <ArticleCard
            title={articleMetaData[slug].title}
            timeElement={articleMetaData[slug].timeElement}
            imageElement={articleMetaData[slug].imageElement}
          />
        ))}
      </div>
    </>
  );
};

export default Blog;
