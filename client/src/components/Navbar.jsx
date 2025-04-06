import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/dypulogo.jpg"; // Ensure the path is correct

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="DYP University Logo" />
      </Link>

      <button
        className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      <ul className={`navbar-list ${isMenuOpen ? "active" : ""}`}>
        <li className="navbar-item">
          <Link to="/" className="navbar-link" onClick={toggleMenu}>
            Home
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/unifiedLogin" className="navbar-link" onClick={toggleMenu}>
            Login
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/studentRegister"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Student Register
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/alumniRegister"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Alumni Register
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/adminRegister"
            className="navbar-link"
            onClick={toggleMenu}
          >
            Admin Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
