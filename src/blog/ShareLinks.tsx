import React from "react";

type SocialMediaLinks = {
  fb: string;
  twitter: string;
  linkedIn: string;
  reddit: string;
  whatsapp: string;
  telegram: string;
};

const ShareLinks: React.FC<{ shareLinks: SocialMediaLinks }> = ({
  shareLinks,
}) => {
  return (
    <div id="share-buttons">
      <a
        className="facebook"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["fb"]}
      >
        <i className="fab fa-facebook"></i>
      </a>
      <a
        className="twitter"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["twitter"]}
      >
        <i className="fab fa-twitter"></i>
      </a>
      <a
        className="linkedin"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["linkedIn"]}
      >
        <i className="fab fa-linkedin"></i>
      </a>
      <a
        className="reddit"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["reddit"]}
      >
        <i className="fab fa-reddit"></i>
      </a>
      <a
        className="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["whatsapp"]}
      >
        <i className="fab fa-whatsapp"></i>
      </a>
      <a
        className="telegram"
        target="_blank"
        rel="noopener noreferrer"
        href={shareLinks["telegram"]}
      >
        <i className="fab fa-telegram"></i>
      </a>
    </div>
  );
};

export default ShareLinks;
