import React from "react";
import IconLinks from "../navigation/IconLinks";
import { Helmet } from "react-helmet";

const SkillCard: React.FC<{ title: string; items: string[] }> = ({
  title,
  items,
}) => {
  return (
    <div className="flex flex-col items-left">
      <h3 className="text-base">{title}</h3>
      <ul className="flex flex-col items-left list-outside list-none m-0 text-slate-400 text-left text-xs">
        {items.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};

const name = "Lachlan Gibson";
const description =
  "Lachlan Gibson is a data scientist and developer with experience in AI, algorithmic design, scientific computing, and data analytics.";
const imageUrl =
  "https://www.lachlangibson.dev/images/home/lachlan_gibson.webp";
const pageUrl = "https://www.lachlangibson.dev/";
const keyWords = `Lachlan Gibson, data scientist, developer, AI, simulation, 
machine learning, deep learning, reinforcement learning, dimensionality reduction, 
algorithmic design, neural network architecture, Q-Learning, dynamic programming, 
numerical methods, scientific computing, MATLAB, finite element method, 
finite difference method, discrete event simulation, data analytics, 
Python, R, SQL, PyTorch, pandas, Matplotlib, physics, mathematics, statistics`;

const Home: React.FC<{}> = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={name} />
        <meta name="twitter:title" content={name} />
        <meta name="author" content={name} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={keyWords} />
      </Helmet>

      <div className=" w-full flex flex-col items-center">
        <div className="max-w-48 max-h-48 w-full aspect-square bg-slate-200 overflow-hidden rounded-full relative border-sky-600 border-solid border-2">
          <img
            className="h-full"
            src="/images/home/lachlan_gibson.webp"
            alt="Lachlan Gibson"
          />
        </div>
        <div className="my-1 font-bold tracking-widest text-2xl">
          Lachlan Gibson
        </div>
        <p className="text-sky-700 max-w-48 text-center text-sm leading-[0.9rem]">
          Data scientist & Developer
          <br />
          AI & Simulation
        </p>
        <IconLinks className="m-4 h-4 flex gap-5 justify-center w-fit" />
        <div className="md2:pl-4 mt-4 w-full gap-4 grid grid-cols-2 md2:grid-cols-4 md2:max-w-3xl max-w-sm">
          <SkillCard
            title="Artificial Intelligence"
            items={[
              "Machine learning",
              "Deep learning",
              "Reinforcement learning",
              "Dimensionality reduction",
            ]}
          />
          <SkillCard
            title="Algorithmic Design"
            items={[
              "Neural network architecture",
              "Q-Learning",
              "Dynamic programming",
              "Numerical methods",
            ]}
          />
          <SkillCard
            title="Scientific Computing"
            items={[
              "MATLAB",
              "Finite element method",
              "Finite difference method",
              "Discrete event simulation",
            ]}
          />
          <SkillCard
            title="Data Analytics"
            items={["Python, R, SQL", "PyTorch", "pandas", "Matplotlib"]}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
