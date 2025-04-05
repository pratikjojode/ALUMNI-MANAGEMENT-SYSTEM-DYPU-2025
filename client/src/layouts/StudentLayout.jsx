// layouts/StudentLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/StudentLayout.css"; // Importing CSS file

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="/student">Dashboard</Link>
            </li>
            <li>
              <Link to="/student/profile">Profile</Link>
            </li>
            <li>
              <Link to="/student/apply">Apply for Jobs</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
