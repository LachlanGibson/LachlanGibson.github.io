import React from "react";
import IconLinks from "../navigation/IconLinks";

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

const Home: React.FC<{}> = () => {
  return (
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
  );
};

export default Home;
