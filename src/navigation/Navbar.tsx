import React from "react";
import { NavLink } from "react-router";
import { useTheme } from "../theme/useTheme";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-0.5 text-sm font-semibold tracking-[0.02em] whitespace-nowrap text-(--site-text) no-underline transition-colors ${isActive ? "border-(--site-link)" : "border-transparent hover:border-(--site-border)"}`;

const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const effectiveMode = isHydrated ? mode : "light";

  return (
    <nav className="flex min-h-12 items-center px-3 py-4 text-(--site-text) sm:px-4">
      <div className="mr-auto flex items-center gap-3">
        <img src="/navbar/icons/LG_logo.svg" alt="Logo for Lachlan Gibson's website" className="h-7 w-7" />
        <span className="text-sm font-medium tracking-[0.01em] max-[460px]:hidden">lachlangibson.dev</span>
      </div>
      <div className="flex items-center gap-5 max-[580px]:gap-3">
        <NavLink className={navLinkClass} to="/">
          Home
        </NavLink>
        <NavLink className={navLinkClass} to="/about/">
          About
        </NavLink>
        <NavLink className={navLinkClass} to="/articles/">
          Articles
        </NavLink>
        <button
          type="button"
          onClick={toggleTheme}
          className={`relative h-7 w-[3.9rem] rounded-full border border-(--site-border) p-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.16),0_3px_8px_rgba(0,0,0,0.16)] transition-all duration-300 hover:border-(--site-link) ${
            effectiveMode === "dark"
              ? "bg-linear-to-br from-[#364a6b] to-[#1e2c44]"
              : "bg-linear-to-br from-(--site-surface-alt) to-(--site-surface)"
          }`}
          aria-label={`Switch to ${effectiveMode === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${effectiveMode === "dark" ? "light" : "dark"} mode`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-1/2 left-[0.14rem] grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-sm leading-none font-bold shadow-[0_1px_2px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
              effectiveMode === "dark"
                ? "translate-x-[2.1rem] bg-[#121a2a] text-[#e7edf8]"
                : "bg-[#f8fafc] text-[#f4c93f]"
            }`}
          >
            {effectiveMode === "dark" ? "\u263e" : "\u2600"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
