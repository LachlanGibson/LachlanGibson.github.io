import React from "react";

const IconLinks = ({ className }: { className?: string }) => {
  const defaultClassName = "m-4 flex w-20 items-center justify-between";
  const resolvedClassName = className
    ? `${className} items-center`
    : defaultClassName;
  const linkClassName =
    "m-0 inline-flex h-4 w-4 items-center justify-center p-0 text-(--site-text-muted) leading-none transition-colors hover:text-(--site-text)";
  return (
    <div className={resolvedClassName}>
      <a
        href="https://www.linkedin.com/in/lachlan-james-gibson/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Lachlan's LinkedIn profile"
        className={linkClassName}
      >
        <i
          className="pi pi-linkedin inline-flex h-4 w-4 items-center justify-center text-sm leading-none"
          aria-hidden="true"
        />
      </a>
      <a
        href="https://github.com/LachlanGibson"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Lachlan's GitHub profile"
        className={linkClassName}
      >
        <i
          className="pi pi-github inline-flex h-4 w-4 items-center justify-center text-sm leading-none"
          aria-hidden="true"
        />
      </a>
      <a
        href="https://scholar.google.com/citations?user=NeEMSU0AAAAJ&hl=en"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Lachlan's Google Scholar profile"
        className={linkClassName}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z" />
        </svg>
      </a>
    </div>
  );
};

export default IconLinks;
