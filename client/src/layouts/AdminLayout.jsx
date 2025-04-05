import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/admin-layout.css"; // Import the CSS for styling

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-title">Admin Portal</h2>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            Dashboard
          </Link>
          <Link to="/admin/job-posts" className="admin-nav-link">
            Review Job Posts
          </Link>
          <Link to="/admin/students" className="admin-nav-link">
            Manage Students
          </Link>
          <Link to="/admin/alumni" className="admin-nav-link">
            Manage Alumni
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
