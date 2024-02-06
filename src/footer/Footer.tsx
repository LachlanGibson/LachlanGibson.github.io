import React from "react";
import IconLinks from "../navigation/IconLinks";

const Footer: React.FC<{}> = () => {
  return (
    <footer className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">© 2024 Lachlan Gibson</span>
        <IconLinks />
      </div>
    </footer>
  );
};

export default Footer;
