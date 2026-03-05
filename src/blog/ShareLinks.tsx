import React, { useMemo, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";

export type SocialMediaLinks = {
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
  const menuRef = useRef<Menu>(null);
  const items = useMemo<MenuItem[]>(
    () => [
      {
        label: "Facebook",
        icon: "pi pi-facebook",
        url: shareLinks.fb,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "Twitter",
        icon: "pi pi-twitter",
        url: shareLinks.twitter,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "LinkedIn",
        icon: "pi pi-linkedin",
        url: shareLinks.linkedIn,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "Reddit",
        icon: "pi pi-reddit",
        url: shareLinks.reddit,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "WhatsApp",
        icon: "pi pi-whatsapp",
        url: shareLinks.whatsapp,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        label: "Telegram",
        icon: "pi pi-send",
        url: shareLinks.telegram,
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ],
    [shareLinks]
  );

  return (
    <div className="relative">
      <Button
        type="button"
        label="Share"
        icon="pi pi-share-alt"
        iconPos="left"
        size="small"
        outlined
        className="min-w-20"
        onClick={(event) => menuRef.current?.toggle(event)}
      />
      <Menu model={items} popup ref={menuRef} />
    </div>
  );
};

export default ShareLinks;
