import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import gameMetaData from "./gameMetaData";

const games = Object.keys(gameMetaData);

function gameExists(slug: string | undefined): boolean {
  if (slug) {
    return games.includes(slug);
  }
  return false;
}

const Game: React.FC = () => {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/games/game-not-found" />;
  }
  if (!gameExists(slug)) {
    return <Navigate to="/games/game-not-found" />;
  }

  return (
    <>
      <Helmet>
        <title>{gameMetaData[slug].title}</title>
      </Helmet>

      <div className="blog-title-div">
        <h1>{gameMetaData[slug].title}</h1>
        <span className="author-date-span">
          By {gameMetaData[slug].author}, {gameMetaData[slug].timeElement}
          {gameMetaData[slug].lastModifiedElement ? (
            <>, updated {gameMetaData[slug].lastModifiedElement}</>
          ) : (
            ""
          )}
          .
        </span>
      </div>
      {gameMetaData[slug].gameElement}
    </>
  );
};

export default Game;
