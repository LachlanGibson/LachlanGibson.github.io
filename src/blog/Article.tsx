import React from "react";
import { Navigate, useParams } from "react-router-dom";

const articles = ["evil-genius-minion-ready", "google-foobar-challenge"];

function articleExists(slug: string | undefined): boolean {
  if (slug) {
    return articles.includes(slug);
  }
  return false;
}

const Article = () => {
  const { slug } = useParams();

  return (
    <>
      {!articleExists(slug) ? (
        <Navigate to="/blog/article-not-found" />
      ) : (
        <h1>Article: {slug}</h1>
      )}
    </>
  );
};

export default Article;
