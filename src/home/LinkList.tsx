import React from "react";

type LinkListProps = {
  links: [string, string][];
};

const LinkList: React.FC<LinkListProps> = ({ links }) => {
  return (
    <div className="mt-2">
      <h4 className="italic opacity-60">Links</h4>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link[0]} target="_blank" rel="noopener noreferrer">
              {link[1]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkList;
