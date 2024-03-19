import React from "react";

type ProjectSectionProps = {
  children?: React.ReactNode;
  title: string;
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ children, title }) => {
  return (
    <div className="w-full p-4 mt-4 bg-slate-800">
      <h3 className="font-bold tracking-widest text-xl text-left mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ProjectSection;
