import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/alumni-layout.css";
import dypu from "../assets/dypulogo.jpg";

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

  const clearToken = () => {
    try {
      localStorage.removeItem("token");
      console.log("Token removed successfully");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return (
    <div className="alumni-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i> {/* Hamburger Menu Icon */}
          </button>

          <div className="brand">
            <h1 className="app-logo">
              <img src={dypu} alt="DY Patil Logo" />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon="fa-home" path="/alumni" text="Home" />
            <NavLink icon="fa-envelope" path="/alumni/messages" text="Inbox" />
            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-circle"></i> {/* User Icon */}
                <span>Account</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/alumni/profile">My Profile</Link>
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
          <h2 className="sidebar-title">Navigation</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times"></i> {/* Close Icon */}
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
            icon="fa-calendar-alt"
            path="/alumni/eventCalender"
            text="Event Calendar"
          />
          <SidebarLink
            icon="fa-file-alt"
            path="/alumni/LcRequest"
            text="LC request/No dues request"
          />
          <SidebarLink
            icon="fa-calendar-check"
            path="/alumni/bookAppointment"
            text="Book Appintment fo LC"
          />
          <SidebarLink
            icon="fa-comments"
            path="/alumni/discussionFormAll"
            text="Post Discussion"
          />
          <SidebarLink
            icon="fa-book-open" // Icon for stories/narratives
            path="/alumni/stories"
            text="My Stories"
          />
          <SidebarLink
            icon="fa-comment-dots" // Another icon option for discussions
            path="/alumni/discussions"
            text="All Discussions"
          />
          <SidebarLink
            icon="fa-handshake" // Icon for mentorship requests
            path="/alumni/mentorshiprequest"
            text="MentorShips requests"
          />

          <div className="premium-section">
            <h3 className="premium-heading">Premium Tools</h3>
            <SidebarLink
              icon="fa-hands-helping" // More specific mentorship icon
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
