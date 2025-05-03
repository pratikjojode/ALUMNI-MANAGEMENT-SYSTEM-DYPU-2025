import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/admin-layout.css";
import dypu from "../assets/dypulogo.jpg";
import toast from "react-hot-toast";

// Icon mapping to avoid repetition
const ICONS = {
  HOME: "fa-home",
  DASHBOARD: "fa-tachometer-alt",
  USERS: "fa-users",
  GRADUATE: "fa-user-graduate",
  BRIEFCASE: "fa-briefcase",
  CALENDAR_CHECK: "fa-calendar-check",
  CALENDAR_PLUS: "fa-calendar-plus",
  FILE: "fa-file-signature",
  ENVELOPE: "fa-envelope",
  DATABASE: "fa-database",
  CHAT: "fa-comments",
  ADMIN: "fa-user-shield",
  BARS: "fa-bars",
  TIMES: "fa-times",
  STAR: "fa-star",
  SETTINGS: "fa-cog",
};

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
            <i className={`fas ${ICONS.BARS}`}></i>
          </button>

          <div className="brand">
            <h1 className="app-logo">
              <img src={dypu} alt="DYPU Logo" />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon={ICONS.HOME} path="/admin" text="Home" />

            <div className="user-menu">
              <button className="user-btn">
                <i className={`fas ${ICONS.ADMIN}`}></i>
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
            <i className={`fas ${ICONS.TIMES}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink icon={ICONS.DASHBOARD} path="/admin" text="Dashboard" />
          <SidebarLink
            icon={ICONS.USERS}
            path="/admin/alumni"
            text="Alumni Management"
          />
          <SidebarLink
            icon={ICONS.GRADUATE}
            path="/admin/students"
            text="Student Management"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/eventCalender"
            text="Event Calendar"
          />
          <SidebarLink
            icon={ICONS.BRIEFCASE}
            path="/admin/job-posts"
            text="Job Posts"
          />
          <SidebarLink
            icon={ICONS.CHAT}
            path="/admin/Discussions"
            text="All discussions"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/events"
            text="Events Management"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_PLUS}
            path="/admin/create-slot"
            text="Create Slot"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/appointments"
            text="Manage Appointments"
          />
          <SidebarLink
            icon={ICONS.FILE}
            path="/admin/LcApproval"
            text="LC/No Dues Approval"
          />
          <SidebarLink
            icon={ICONS.STAR}
            path="/admin/stories"
            text="All Alumni Stories"
          />
          <SidebarLink
            icon={ICONS.ENVELOPE}
            path="/admin/messages"
            text="Messages"
          />
          <SidebarLink
            icon={ICONS.ENVELOPE}
            path="/admin/job-applications"
            text="Job Applications"
          />

          <div className="admin-tools-section">
            <h3 className="tools-heading">Admin Tools</h3>

            <SidebarLink
              icon={ICONS.DATABASE}
              path="/admin/DataExport"
              text="Data Export"
            />
            <SidebarLink
              icon={ICONS.USERS}
              path="/admin/mentorsAll"
              text="Our Mentors"
            />
          </div>
        </nav>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>

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
