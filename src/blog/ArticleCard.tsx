import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({
  slug,
  title,
  timeElement,
  imageElement,
}: {
  slug: string;
  title: string;
  timeElement: JSX.Element;
  imageElement: JSX.Element;
}) => {
  return (
    <div className="blog-section-div">
      <div>
        <Link to={`/blog/${slug}`}>{imageElement}</Link>
      </div>
      <div className="blog-section-caption-div">
        <p>
          <Link to={`/blog/${slug}`}>{title}</Link>
        </p>
        <span>{timeElement}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
