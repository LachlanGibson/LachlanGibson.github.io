import React from "react";
import { Card } from "primereact/card";

type ProjectSectionProps = {
  children?: React.ReactNode;
  title: string;
};

const ProjectSection: React.FC<ProjectSectionProps> = ({ children, title }) => {
  return (
    <Card
      className="mt-5 w-full rounded-xl border border-(--site-border) bg-(--site-surface)"
      pt={{
        body: { className: "p-4 md:p-5" },
        content: { className: "p-0" },
      }}
    >
      <h3 className="mb-2 text-left text-2xl leading-tight font-bold tracking-wide md:text-3xl">
        {title}
      </h3>
      {children}
    </Card>
  );
};

export default ProjectSection;
