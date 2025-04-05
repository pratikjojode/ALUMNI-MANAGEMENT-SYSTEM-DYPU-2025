// layouts/AdminLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/job-posts">Review Job Posts</Link>
          </li>
          <li>
            <Link to="/admin/students">Manage Students</Link>
          </li>
          <li>
            <Link to="/admin/alumni">Manage Alumni</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
