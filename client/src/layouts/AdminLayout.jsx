import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/admin-layout.css";
import dypu from "../assets/dypulogo.jpg";
import toast from "react-hot-toast";
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
  const clearToken = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Token removed successfully");
    } catch (error) {
      toast.error("Error removing token:", error);
    }
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
            <h1 className="app-logo">
              <img src={dypu} />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon="fa-home" path="/admin" text="Home" />

            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/admin/profile">Admin Profile</Link>
                <Link to="/admin/settings">System Settings</Link>
                <Link to="/" onClick={clearToken}>
                  Sign Out
                </Link>
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
            icon="fa-user-graduate"
            path="/admin/eventCalender"
            text="Event Calendar"
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
            icon="fa-calendar-plus" // Calendar with a plus sign — for creating slots
            path="/admin/create-slot"
            text="Create Slot"
          />
          <SidebarLink
            icon="fa-calendar-check" // Calendar with a checkmark — for managing appointments
            path="/admin/appointments"
            text="Manage Appointments"
          />
          <SidebarLink
            icon="fa-file-signature" // Document with a signature — for LC/No Dues approval
            path="/admin/LcApproval"
            text="LC/No Dues Approval"
          />

          <SidebarLink
            icon="fa-envelope"
            path="/admin/messages"
            text="Messages"
          />

          <div className="admin-tools-section">
            <h3 className="tools-heading">Admin Tools</h3>

            <SidebarLink
              icon="fa-database"
              path="/admin/data-export"
              text="Data Export"
            />
            <SidebarLink
              icon="fa-database"
              path="/admin/mentorsAll"
              text="Our Mentors"
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
