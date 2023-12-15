import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({
  title,
  timeElement,
  imageElement,
}: {
  title: string;
  timeElement: JSX.Element;
  imageElement: JSX.Element;
}) => {
  return (
    <div className="blog-section-div">
      <div>
        <Link to="/blog/evil-genius-minion-ready">{imageElement}</Link>
      </div>
      <div className="blog-section-caption-div">
        <p>
          <Link to="/blog/evil-genius-minion-ready">{title}</Link>
        </p>
        <span>{timeElement}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
