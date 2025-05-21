import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/StudentLayout.css";
import dypu from "../assets/dypulogo.jpg";
import toast from "react-hot-toast";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserGraduate,
  FaUser,
  FaCalendarDay,
  FaChalkboardTeacher,
  FaCommentMedical,
  FaComments,
  FaCalendarCheck,
  FaBriefcase,
  FaBookOpen,
  FaQuestionCircle,
  FaTachometerAlt,
  FaSignOutAlt,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

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
      <header className="app-header">
        <div className="header-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>

          <div className="brand">
            <h1 className="app-logo">
              <img src={dypu} alt="DYPU Logo" />
            </h1>
          </div>

          <nav className="main-nav">
            <NavLink icon={<FaHome size={18} />} path="/student" text="Home" />
            <NavLink path="/commonInbox" text="Inbox" />

            <div className="user-menu">
              <button className="user-btn">
                <FaUserGraduate size={18} />
                <span>Student</span>
              </button>
              <div className="dropdown-panel">
                <Link to="/student/profile">My Profile</Link>
                <Link to="/" onClick={clearToken}>
                  <FaSignOutAlt size={16} className="icon-margin" />
                  Sign Out
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <aside className={`app-sidebar ${sidebarOpen ? "visible" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Student Navigation</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink
            icon={<FaTachometerAlt size={18} />}
            path="/student"
            text="Dashboard"
          />
          <SidebarLink
            icon={<FaUser size={18} />}
            path="/student/profile"
            text="My Profile"
          />
          <SidebarLink
            icon={<FaCalendarDay size={18} />}
            path="/student/events"
            text="Upcoming Events"
          />
          <SidebarLink
            icon={<FaChalkboardTeacher size={18} />}
            path="/student/mentors"
            text="Find Mentors"
          />
          <SidebarLink
            icon={<FaUsers size={18} />}
            path="/student/all"
            text="Find Alumni"
          />
          <SidebarLink
            icon={<FaFileAlt size={18} />}
            path="/student/projects"
            text="Projects"
          />
          <SidebarLink
            icon={<FaCommentMedical size={18} />}
            path="/student/discussionFormAll"
            text="Post Discussion"
          />
          <SidebarLink
            icon={<FaComments size={18} />}
            path="/student/discussions"
            text="All Discussions"
          />
          <SidebarLink
            icon={<FaCalendarCheck size={18} />}
            path="/student/appointments"
            text="My Applications"
          />
          <SidebarLink
            icon={<FaBriefcase size={18} />}
            path="/student/apply"
            text="Apply for Jobs"
          />

          <div className="student-tools-section">
            <h3 className="tools-heading">Resources</h3>
            <SidebarLink
              icon={<FaBookOpen size={18} />}
              path="/student/resources"
              text="Learning Resources"
            />
            <SidebarLink
              icon={<FaQuestionCircle size={18} />}
              path="/student/help"
              text="Help Center"
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
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const SidebarLink = ({ icon, path, text }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className={`sidebar-item ${isActive ? "active" : ""}`}>
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default StudentLayout;
