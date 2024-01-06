import React from "react";
import { Helmet } from "react-helmet";
import GameCard from "./GameCard";
import gameMetaData from "./gameMetaData";

const Games: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Lachlan Gibson - Games</title>
      </Helmet>
      <h1>Games</h1>
      <div className="blog-list-div">
        {Object.keys(gameMetaData).map((slug) => (
          <GameCard
            slug={slug}
            title={gameMetaData[slug].title}
            timeElement={gameMetaData[slug].timeElement}
            imageElement={gameMetaData[slug].imageElement}
          />
        ))}
      </div>
    </>
  );
};

export default Games;
