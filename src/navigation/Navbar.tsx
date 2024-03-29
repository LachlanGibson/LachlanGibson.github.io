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
          src="/navbar/icons/LG_logo.svg"
          alt="Logo for Lachlan Gibson's website"
        />
        <span id="lachlan-nav-text">lachlangibson.dev</span>
      </div>
      <NavLink className={activeLink} to="/">
        Home
      </NavLink>
      <NavLink className={activeLink} to="/about/">
        About
      </NavLink>
      <NavLink className={activeLink} to="/blog/">
        Portfolio
      </NavLink>
    </nav>
  );
};

export default Navbar;
