import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/admin-layout.css";
import dypu from "../assets/dypulogo.jpg";
import toast from "react-hot-toast";

const ICONS = {
  HOME: "fa-solid fa-house",
  DASHBOARD: "fa-solid fa-gauge",
  USERS: "fa-solid fa-users",
  GRADUATE: "fa-solid fa-user-graduate",
  BRIEFCASE: "fa-solid fa-briefcase",
  CALENDAR_CHECK: "fa-solid fa-calendar-check",
  CALENDAR_PLUS: "fa-solid fa-calendar-plus",
  FILE: "fa-solid fa-file-signature",
  ENVELOPE: "fa-solid fa-envelope-open-text",
  DATABASE: "fa-solid fa-database",
  CHAT: "fa-solid fa-comments",
  ADMIN: "fa-solid fa-user-shield",
  BARS: "fa-solid fa-bars",
  TIMES: "fa-solid fa-xmark",
  STAR: "fa-solid fa-star",
  SETTINGS: "fa-solid fa-gear",
  EXPAND: "fa-solid fa-maximize",
  COMPRESS: "fa-solid fa-minimize",
  PROJECT: "fa-solid fa-diagram-project",
};

const AdminLayout = () => {
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
    if (isMobile) setSidebarOpen(false);
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
      toast.success("Signed Out Successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Error removing token:", error);
    }
  };

  return (
    <div className={`admin-app ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <header className="app-header">
        <div className="header-container">
          {isMobile && (
            <button className="menu-toggle" onClick={toggleSidebar}>
              <i className={`fas ${ICONS.BARS}`}></i>
            </button>
          )}

          <div className="brand">
            <h1 className="app-logo">
              <Link to="/admin">
                <img src={dypu} alt="DYPU Logo" />
              </Link>
            </h1>
            {document.fullscreenEnabled && (
              <button
                className="fullscreen-toggle"
                onClick={handleFullscreenToggle}
              >
                <i
                  className={`fas ${
                    isFullscreen ? ICONS.COMPRESS : ICONS.EXPAND
                  }`}
                ></i>
              </button>
            )}
          </div>

          <nav className="main-nav">
            {!isMobile && (
              <NavLink icon={ICONS.HOME} path="/admin" text="Home" />
            )}

            <div className="user-menu">
              <button className="user-btn">
                <i className={`fas ${ICONS.ADMIN}`}></i>
                <span>Admin</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/admin/profile">Admin Profile</Link>
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
          <h2 className="sidebar-title">Admin Navigation</h2>
          {isMobile && (
            <button className="sidebar-close" onClick={toggleSidebar}>
              <i className={`fas ${ICONS.TIMES}`}></i>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <SidebarLink
            icon={ICONS.DASHBOARD}
            path="/admin"
            text="Admin Dashboard"
          />
          <SidebarLink
            icon={ICONS.USERS}
            path="/admin/alumni"
            text="Alumni Directory"
          />
          <SidebarLink
            icon={ICONS.USERS}
            path="/admin/alumni-exel-upload"
            text="Bulk Alumni Upload"
          />
          <SidebarLink
            icon={ICONS.GRADUATE}
            path="/admin/students"
            text="Student Records"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/eventCalender"
            text="Institution Calendar"
          />
          <SidebarLink
            icon={ICONS.BRIEFCASE}
            path="/admin/job-posts"
            text="Manage Job Posts"
          />
          <SidebarLink
            icon={ICONS.CHAT}
            path="/admin/Discussions"
            text="Discussion Forum"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/events"
            text="Event Management"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_PLUS}
            path="/admin/create-slot"
            text="Create LC/No Dues Slots"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_PLUS}
            path="/admin/scheduleMentorshipSession"
            text="Schedule Mentorship"
          />
          <SidebarLink
            icon={ICONS.CALENDAR_CHECK}
            path="/admin/appointments"
            text="Manage LC Appointments"
          />
          <SidebarLink
            icon={ICONS.FILE}
            path="/admin/LcApproval"
            text="LC / No-Dues Clearance"
          />
          <SidebarLink
            icon={ICONS.STAR}
            path="/admin/stories"
            text="Alumni Success Stories"
          />
          <SidebarLink
            icon={ICONS.ENVELOPE}
            path="/admin/messages"
            text="Inbox & Messages"
          />
          <SidebarLink
            icon={ICONS.PROJECT}
            path="/admin/allProjects"
            text="Student Projects & Grants"
          />
          <SidebarLink
            icon={ICONS.ENVELOPE}
            path="/admin/job-applications"
            text="Job Applications"
          />

          <div className="admin-tools-section">
            <h3 className="tools-heading">Administrator Tools</h3>
            <SidebarLink
              icon={ICONS.DATABASE}
              path="/admin/DataExport"
              text="Export System Data"
            />
            <SidebarLink
              icon={ICONS.USERS}
              path="/admin/mentorsAll"
              text="Mentor Directory"
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
