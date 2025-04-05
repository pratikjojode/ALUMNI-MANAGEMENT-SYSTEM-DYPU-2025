import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/admin-layout.css";

const AdminLayout = () => {
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
    <div className="admin-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="brand">
            <h1 className="app-logo">DYPAAS Admin Portal</h1>
          </div>

          <nav className="main-nav">
            <NavLink icon="fa-home" path="/admin" text="Home" />
            <NavLink icon="fa-bell" path="/admin/notifications" text="Alerts" />
            <NavLink icon="fa-cog" path="/admin/settings" text="Settings" />

            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/admin/profile">Admin Profile</Link>
                <Link to="/admin/settings">System Settings</Link>
                <Link to="/logout">Sign Out</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? "visible" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Navigation</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink
            icon="fa-tachometer-alt"
            path="/admin"
            text="Dashboard"
          />
          <SidebarLink
            icon="fa-users"
            path="/admin/alumni"
            text="Alumni Management"
          />
          <SidebarLink
            icon="fa-user-graduate"
            path="/admin/students"
            text="Student Management"
          />
          <SidebarLink
            icon="fa-briefcase"
            path="/admin/job-posts"
            text="Job Posts"
          />
          <SidebarLink
            icon="fa-calendar-check"
            path="/admin/events"
            text="Events Management"
          />
          <SidebarLink
            icon="fa-chart-bar"
            path="/admin/analytics"
            text="Analytics"
          />
          <SidebarLink
            icon="fa-envelope"
            path="/admin/messages"
            text="Messages"
          />

          <div className="admin-tools-section">
            <h3 className="tools-heading">Admin Tools</h3>
            <SidebarLink
              icon="fa-cogs"
              path="/admin/system-settings"
              text="System Settings"
            />
            <SidebarLink
              icon="fa-user-cog"
              path="/admin/user-roles"
              text="User Roles"
            />
            <SidebarLink
              icon="fa-database"
              path="/admin/data-export"
              text="Data Export"
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
const NavLink = ({ icon, path, text }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className={`nav-item ${isActive ? "active" : ""}`}>
      <i className={`fas ${icon}`}></i>
      <span>{text}</span>
    </Link>
  );
};

// Reusable SidebarLink Component
const SidebarLink = ({ icon, path, text }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className={`sidebar-item ${isActive ? "active" : ""}`}>
      <i className={`fas ${icon}`}></i>
      <span>{text}</span>
    </Link>
  );
};

export default AdminLayout;
