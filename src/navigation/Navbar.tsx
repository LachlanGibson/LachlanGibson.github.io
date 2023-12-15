import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const activeLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active-link" : "";

const Navbar: React.FC<{}> = () => {
  return (
    <nav>
      <div>
        <img
          id="navbar-icon"
          src="/navbar/icons/logo.svg"
          alt="Logo for Lachlan Gibson's website"
        />
        <span id="lachlan-nav-text">Lachlan Gibson</span>
      </div>
      <NavLink className={activeLink} to="/">
        Home
      </NavLink>
      <NavLink className={activeLink} to="/about">
        About
      </NavLink>
      <NavLink className={activeLink} to="/games">
        Games
      </NavLink>
      <NavLink className={activeLink} to="/blog/">
        Blog
      </NavLink>
      <div className="icon-container">
        <a
          href="https://www.linkedin.com/in/lachlan-james-gibson/"
          className="icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Lachlan's LinkedIn profile"
        >
          <img src="/navbar/icons/linkedin_icon.svg" alt="LinkedIn" />
        </a>
        <a
          href="https://github.com/LachlanGibson"
          className="icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Lachlan's GitHub profile"
        >
          <img
            src="/navbar/icons/github_icon.svg"
            alt="GitHub"
            id="github-icon"
          />
        </a>
        <a
          href="https://scholar.google.com/citations?user=NeEMSU0AAAAJ&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Lachlan's Google Scholar profile"
        >
          <img
            src="/navbar/icons/googlescholar_icon.svg"
            alt="Google Scholar"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
