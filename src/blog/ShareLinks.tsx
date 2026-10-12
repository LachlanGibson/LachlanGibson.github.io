import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/Button";

export type SocialMediaLinks = {
  fb: string;
  twitter: string;
  linkedIn: string;
  reddit: string;
  whatsapp: string;
  telegram: string;
};

type ShareItem = {
  label: string;
  icon: string;
  url: string;
};

const ShareLinks: React.FC<{ shareLinks: SocialMediaLinks }> = ({
  shareLinks,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const items = useMemo<ShareItem[]>(
    () => [
      { label: "Facebook", icon: "pi pi-facebook", url: shareLinks.fb },
      { label: "Twitter", icon: "pi pi-twitter", url: shareLinks.twitter },
      { label: "LinkedIn", icon: "pi pi-linkedin", url: shareLinks.linkedIn },
      { label: "Reddit", icon: "pi pi-reddit", url: shareLinks.reddit },
      { label: "WhatsApp", icon: "pi pi-whatsapp", url: shareLinks.whatsapp },
      { label: "Telegram", icon: "pi pi-send", url: shareLinks.telegram },
    ],
    [shareLinks]
  );

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        containerRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[role=menuitem]"));
    const current = links.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    links[(current + step + links.length) % links.length]?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        label="Share"
        icon="pi pi-share-alt"
        size="small"
        outlined
        className="min-w-20"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <ul
          role="menu"
          ref={menuRef}
          onKeyDown={handleMenuKeyDown}
          className="absolute top-full left-0 z-50 w-50 rounded-md bg-(--site-surface) py-(--ui-overlay-padding) shadow-(--ui-overlay-shadow) [border:var(--ui-overlay-border)]"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <a
                role="menuitem"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center px-5 py-3 leading-none text-(--ui-text) outline-none select-none hover:bg-(--site-surface-alt) hover:no-underline focus:bg-(--ui-menu-focus)"
              >
                <span className={`${item.icon} mr-2 text-(--ui-text-secondary)`} aria-hidden="true" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShareLinks;
