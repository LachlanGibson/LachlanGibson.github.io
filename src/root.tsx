import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import stylesheet from "./index.css?url";
import primeReactStyles from "primereact/resources/primereact.min.css?url";
import primeIconsStyles from "primeicons/primeicons.css?url";
import { lightThemeHref } from "./theme/themeHrefs";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#182536" />
        <link rel="icon" href="/navbar/icons/LG_logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href={stylesheet} />
        <link rel="stylesheet" href={primeReactStyles} />
        <link rel="stylesheet" href={primeIconsStyles} />
        <link
          id="app-theme"
          rel="stylesheet"
          href={lightThemeHref}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
