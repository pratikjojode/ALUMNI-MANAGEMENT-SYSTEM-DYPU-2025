import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/alumni-layout.css";
import dypu from "../assets/dypulogo.jpg";

const AlumniLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFullscreenToggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    }
  };

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
      <header className="app-header">
        <div className="header-container">
          {isMobile && (
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          )}

          <div className="brand">
            <h1 className="app-logo">
              <Link to="/alumni">
                <img src={dypu} alt="DY Patil Logo" />
              </Link>
            </h1>
          </div>
          {document.fullscreenEnabled && (
            <button
              className="fullscreen-toggle"
              onClick={handleFullscreenToggle}
            >
              <i
                className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"}`}
              ></i>
            </button>
          )}

          <nav className="main-nav">
            {!isMobile && (
              <>
                <NavLink icon="fa-home" path="/alumni" text="Home" />
                <NavLink
                  icon="fa-envelope"
                  path="/alumni/messages"
                  text="Inbox"
                />
              </>
            )}

            <div className="user-menu">
              <button className="user-btn">
                <i className="fas fa-user-circle"></i>
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

      <aside
        className={`app-sidebar ${sidebarOpen ? "visible" : ""} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          {isMobile && (
            <button className="sidebar-close" onClick={toggleSidebar}>
              <i className="fas fa-times"></i>
            </button>
          )}
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
            icon="fa-calendar-check"
            path="/alumni/events"
            text="Events"
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
            icon="fa-file-alt"
            path="/alumni/sessions"
            text="My Scheduled Mentorship Sessions"
          />
          <SidebarLink
            icon="fa-calendar-check"
            path="/alumni/bookAppointment"
            text="Book Appointment for LC"
          />
          <SidebarLink
            icon="fa-comments"
            path="/alumni/discussionFormAll"
            text="Post Discussion"
          />
          <SidebarLink
            icon="fa-book-open"
            path="/alumni/stories"
            text="My Stories"
          />
          <SidebarLink
            icon="fa-comment-dots"
            path="/alumni/discussions"
            text="All Discussions"
          />
          <SidebarLink
            icon="fa-handshake"
            path="/alumni/mentorshiprequest"
            text="Mentorship Requests"
          />

          <div className="premium-section">
            <h3 className="premium-heading">Premium Tools</h3>
            <SidebarLink
              icon="fa-hands-helping"
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

      <main className="app-content">
        <Outlet />
      </main>

      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

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
      {premium && <span className="premium-marker">P</span>}
    </Link>
  );
};

export default AlumniLayout;
