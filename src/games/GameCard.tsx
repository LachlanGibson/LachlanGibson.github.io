import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({
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
        <Link to={`/games/${slug}`}>{imageElement}</Link>
      </div>
      <div className="blog-section-caption-div">
        <p>
          <Link to={`/games/${slug}`}>{title}</Link>
        </p>
        <span>{timeElement}</span>
      </div>
    </div>
  );
};

export default GameCard;
