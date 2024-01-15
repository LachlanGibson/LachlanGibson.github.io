import React from "react";
import IconLinks from "../navigation/IconLinks";

const Home: React.FC<{}> = () => {
  return (
    <div className=" w-full flex flex-col items-center">
      <div className="max-w-48 max-h-48 w-full aspect-square bg-slate-200 overflow-hidden rounded-full relative border-sky-600 border-solid border-3">
        <img
          className="w-auto object-cover h-full absolute"
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
      <div className="h-96"></div>
    </div>
  );
};

export default Home;
