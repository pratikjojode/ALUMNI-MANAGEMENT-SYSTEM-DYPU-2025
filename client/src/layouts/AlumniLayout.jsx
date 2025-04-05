// src/layouts/AlumniLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/alumni-layout.css"; // Importing CSS file

const AlumniLayout = () => {
  return (
    <div className="alumni-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Alumni Portal</h2>
        <nav className="sidebar-nav">
          <Link to="/alumni" className="nav-link">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link to="/alumni/profile" className="nav-link">
            <i className="fas fa-user"></i> View Profile
          </Link>
          <Link to="/alumni/update-profile" className="nav-link">
            <i className="fas fa-edit"></i> Update Profile
          </Link>
          <Link to="/alumni/search" className="nav-link">
            <i className="fas fa-search"></i> Search Alumni
          </Link>
          <Link to="/alumni/all" className="nav-link">
            <i className="fas fa-users"></i> All Alumni
          </Link>
          <Link to="/alumni/post-job" className="nav-link">
            <i className="fas fa-briefcase"></i> Post a Job
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AlumniLayout;
