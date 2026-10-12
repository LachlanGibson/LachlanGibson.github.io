import React from "react";
import IconLinks from "../navigation/IconLinks";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-4">
      <hr className="my-5 border-(--ui-divider)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-(--site-text-muted)">
          {"\u00A9"} {year} Lachlan Gibson
        </span>
        <IconLinks />
      </div>
    </footer>
  );
};

export default Footer;
