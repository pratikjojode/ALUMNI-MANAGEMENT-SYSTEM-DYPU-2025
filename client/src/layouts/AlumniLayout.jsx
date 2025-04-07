import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/alumni-layout.css";
import dypu from "../images/DYPU-removebg-preview.png";

const AlumniLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location, isMobile]);

  return (
    <div className="alumni-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="brand">
            <h1 className="app-logo">
              <img src={dypu} />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon="fa-home" path="/alumni" text="Home" />
            <NavLink
              icon="fa-bell"
              path="/alumni/notifications"
              text="Alerts"
            />
            <NavLink icon="fa-envelope" path="/alumni/messages" text="Inbox" />

            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-circle"></i>
                <span>Account</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/alumni/profile">My Profile</Link>
                <Link to="/alumni/settings">Settings</Link>
                <Link to="/logout">Sign Out</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? "visible" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink icon="fa-home" path="/alumni" text="Dashboard" />
          <SidebarLink
            icon="fa-user"
            path="/alumni/profile"
            text="My Profile"
          />
          <SidebarLink
            icon="fa-edit"
            path="/alumni/update-profile"
            text="Edit Profile"
          />
          <SidebarLink
            icon="fa-search"
            path="/alumni/search"
            text="Find Alumni"
          />
          <SidebarLink icon="fa-users" path="/alumni/all" text="Network" />
          <SidebarLink
            icon="fa-briefcase"
            path="/alumni/post-job"
            text="Post Jobs"
          />
          <SidebarLink
            icon="fa-user-graduate"
            path="/alumni/eventCalender"
            text="Event Calendar"
          />
          <SidebarLink
            icon="fa-user-graduate"
            path="/alumni/LcRequest"
            text="LC request/No dues request"
          />
          <SidebarLink icon="fa-calendar" path="/alumni/events" text="Events" />
          <SidebarLink
            icon="fa-book"
            path="/alumni/resources"
            text="Resources"
          />

          <div className="premium-section">
            <h3 className="premium-heading">Premium Tools</h3>
            <SidebarLink
              icon="fa-handshake"
              path="/alumni/mentorship"
              text="Mentorship"
              premium
            />
            <SidebarLink
              icon="fa-chart-line"
              path="/alumni/career-services"
              text="Career Coach"
              premium
            />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

// Reusable NavLink Component
const NavLink = ({ icon, path, text }) => (
  <Link
    to={path}
    className={`nav-item ${window.location.pathname === path ? "active" : ""}`}
  >
    <i className={`fas ${icon}`}></i>
    <span>{text}</span>
  </Link>
);

// Reusable SidebarLink Component
const SidebarLink = ({ icon, path, text, premium = false }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`sidebar-item ${isActive ? "active" : ""} ${
        premium ? "premium" : ""
      }`}
    >
      <i className={`fas ${icon}`}></i>
      <span>{text}</span>
      {premium && <span className="premium-marker"></span>}
    </Link>
  );
};

export default AlumniLayout;
