import React, { useEffect, useRef, useState } from "react";

export type SocialMediaLinks = {
  fb: string;
  twitter: string;
  linkedIn: string;
  reddit: string;
  whatsapp: string;
  telegram: string;
};

const linkClassName =
  "flex items-center gap-2 w-full whitespace-nowrap bg-transparent px-3 py-2 text-sm font-normal active:text-neutral-800 disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 text-neutral-200 hover:bg-slate-600";
const iconClassName = "h-4";

const ShareLinks: React.FC<{ shareLinks: SocialMediaLinks }> = ({
  shareLinks,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // document.addEventListener("mousedown", handleClickOutside);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center whitespace-nowrap rounded bg-slate-700 p-3 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-slate-600 focus:bg-primary-600 active:bg-slate-500 motion-reduce:transition-none"
        type="button"
        id="dropdownMenuButton1"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-4"
          fill="currentColor"
        >
          <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
        </svg>
      </button>
      {isDropdownOpen && (
        <ul
          className="absolute sm:left-0 right-0 z-[1000] float-left m-0 min-w-max list-none overflow-hidden rounded-lg bg-clip-padding text-left text-base shadow-lg bg-slate-700"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <a
              className={linkClassName}
              href={shareLinks["fb"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
              </svg>
              Facebook
            </a>
          </li>
          <li>
            <a
              className={linkClassName}
              href={shareLinks["twitter"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
              Twitter
            </a>
          </li>
          <li>
            <a
              className={linkClassName}
              href={shareLinks["linkedIn"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
              </svg>
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className={linkClassName}
              href={shareLinks["reddit"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34c-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1c-10.1-7.8-22.8-12.5-36.5-12.5c-33 0-59.8 26.8-59.8 59.8c0 24 14.1 44.6 34.4 54.1c2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54c0-33-26.8-59.8-59.8-59.8c-13.7 0-26.3 4.6-36.4 12.4c-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9l0 0c4.4 18.8 21.3 32.8 41.5 32.8zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6s-31.4-8.8-30.4-30.5s15.4-38.3 32.1-38.3zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6c-1-21.7 11.8-39.3 28.5-39.3s31.2 16.6 32.1 38.3zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5c18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z" />
              </svg>
              Reddit
            </a>
          </li>
          <li>
            <a
              className={linkClassName}
              href={shareLinks["whatsapp"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              WhatsApp
            </a>
          </li>
          <li>
            <a
              className={linkClassName}
              href={shareLinks["telegram"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                fill="currentColor"
                className={iconClassName}
              >
                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
              </svg>
              Telegram
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ShareLinks;
