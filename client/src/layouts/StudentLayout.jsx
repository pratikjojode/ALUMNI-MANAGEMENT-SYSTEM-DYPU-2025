import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/StudentLayout.css";
import dypu from "../assets/dypulogo.jpg";
import toast from "react-hot-toast";

const StudentLayout = () => {
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
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location, isMobile]);

  return (
    <div className="student-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="brand">
            <h1 className="app-logo">
              <img src={dypu} alt="DYPU Logo" />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon="fa-home" path="/student" text="Home" />

            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-graduate"></i>
                <span>Student</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/student/profile">My Profile</Link>

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
          <h2 className="sidebar-title">Student Navigation</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink
            icon="fa-tachometer-alt"
            path="/student"
            text="Dashboard"
          />
          <SidebarLink
            icon="fa-user"
            path="/student/profile"
            text="My Profile"
          />

          <SidebarLink
            icon="fa-calendar"
            path="/student/events"
            text="Upcoming Events"
          />
          <SidebarLink
            icon="fa-users"
            path="/student/mentors"
            text="Find Mentors"
          />
          <SidebarLink
            icon="fa-calendar-check"
            path="/student/appointments"
            text="My Appointments"
          />
          <SidebarLink
            icon="fa-file-alt"
            path="/student/apply"
            text="Apply for Jobs"
          />

          <div className="student-tools-section">
            <h3 className="tools-heading">Resources</h3>
            <SidebarLink
              icon="fa-book"
              path="/student/resources"
              text="Learning Resources"
            />
            <SidebarLink
              icon="fa-question-circle"
              path="/student/help"
              text="Help Center"
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

export default StudentLayout;
