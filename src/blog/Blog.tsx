import React from "react";
import articleMetaData from "./articleMetaData";
import ArticleCard from "./ArticleCard";

const name = "Lachlan Gibson";
const title = "Lachlan Gibson - Blog";
const description =
  "My blog is where I show off some of my projects and write about topics that interest me.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/blog/";
const keyWords = `Lachlan Gibson, data scientist, developer, AI, simulation, 
machine learning, deep learning, reinforcement learning, dimensionality reduction, 
algorithmic design, neural network architecture, Q-Learning, dynamic programming, 
numerical methods, scientific computing, MATLAB, finite element method, 
finite difference method, discrete event simulation, data analytics, 
Python, R, SQL, PyTorch, pandas, Matplotlib, physics, mathematics, statistics, 
blog, articles, projects, portfolio, projects, tic-tac-toe, connect four, 
chatGPT, GPT-2, GPT-3, OpenAI, Google, TensorFlow`;

const Blog: React.FC = () => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="author" content={name} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content={keyWords} />
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
