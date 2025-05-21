import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/dypulogo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const token = localStorage.getItem("token");

  const handleSignout = () => {
    localStorage.removeItem("token"); // remove token on signout
    setIsMenuOpen(false);
    navigate("/"); // redirect to home after signout
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
        <i className="fa-solid fa-bars"></i>
      </button>

      <ul className={`navbar-list ${isMenuOpen ? "active" : ""}`}>
        <li className="navbar-item">
          <NavLink to="/" className="navbar-link" onClick={toggleMenu}>
            Home
          </NavLink>
        </li>

        {!token && (
          <li className="navbar-item">
            <NavLink
              to="/unifiedLogin"
              className="navbar-link"
              onClick={toggleMenu}
            >
              Login
            </NavLink>
          </li>
        )}

        {token && (
          <li className="navbar-item">
            <button
              onClick={handleSignout}
              className="navbar-link signout-button"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </li>
        )}

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
            to="/commonInbox"
            className="navbar-link"
            onClick={toggleMenu}
          >
            My Inbox
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
