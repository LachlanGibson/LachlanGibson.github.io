import React from "react";

type LinkListProps = {
  links: [string, string][];
};

const LinkList: React.FC<LinkListProps> = ({ links }) => {
  return (
    <div className="mt-2">
      <h4 className="text-xs font-semibold tracking-[0.14em] text-(--site-text-muted) uppercase">
        Links
      </h4>
      <ul className="mt-1 space-y-1">
        {links.map((link, index) => (
          <li key={index}>
            <a
              className="text-sm font-medium text-(--site-link)"
              href={link[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link[1]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkList;
