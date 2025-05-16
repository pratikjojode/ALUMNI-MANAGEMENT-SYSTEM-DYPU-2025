import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/dypulogo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <img src={logo} alt="DYP University Logo" />
      </NavLink>

      <button
        className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <i class="fa-solid fa-bars"></i>
      </button>

      <ul className={`navbar-list ${isMenuOpen ? "active" : ""}`}>
        <li className="navbar-item">
          <NavLink to="/" className="navbar-link" onClick={toggleMenu}>
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/unifiedLogin"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Login
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/alumni-map"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Alumni Map
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/studentRegister"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Student Register
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/alumniStories"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Alumni Stories
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/alumniRegister"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Alumni Register
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink to="/contact" className="navbar-link" onClick={toggleMenu}>
            Contact us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
