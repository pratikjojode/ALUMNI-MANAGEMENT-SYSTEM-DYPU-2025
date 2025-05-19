import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Bubble, Scatter, Pie, Doughnut } from "react-chartjs-2";
import "../styles/AdminDashboard.css";
import AdminSessionForm from "../components/AdminSessionForm";
import AdminSessionList from "../components/AdminSessionList";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const storedUser = localStorage.getItem("user");
  const adminId = storedUser ? JSON.parse(storedUser).id : null;
  const [stats, setStats] = useState({
    alumni: 0,
    students: 0,
    admins: 0,
    events: 0,
    jobs: 0,
    discussions: 0,
    mentorships: 0,
    successStories: 0,
    applications: 0,
    messages: 0,
    mentors: 0,
    slots: 0,
    lcReq: 0,
    lcAppointment: 0,
    projects: 0,
  });

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const adminName = userInfo?.name || "Admin";
  const adminEmail = userInfo?.email || "Not Available";
  const adminRole = userInfo?.role || "Administrator";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const [
        alumniRes,
        studentsRes,
        adminsRes,
        eventRes,
        jobRes,
        discussionRes,
        successStoriesRes,
        mentorshipRes,
        messageRes,
        applicationsRes,
        slotsRes,
        lcRes,
        lcAppointmentRes,
        projectsRes,
      ] = await Promise.all([
        axios
          .get("/api/v1/alumni/all", config)
          .catch(() => ({ data: { alumni: [] } })),
        axios
          .get("api/v1/admin/allStudents", config)
          .catch(() => ({ data: { students: [] } })),
        axios
          .get("/api/v1/admin/allAdmin", config)
          .catch(() => ({ data: { admins: [] } })),
        axios
          .get("/api/v1/events/get", config)
          .catch(() => ({ data: { events: [] } })),
        axios
          .get("/api/v1/jobsPosting/job-posts", config)
          .catch(() => ({ data: { totalCount: 0 } })),
        axios
          .get("api/v1/discussions/getDis", config)
          .catch(() => ({ data: { discussions: [] } })),
        axios
          .get("/api/v1/success-stories/all", config)
          .catch(() => ({ data: [] })),
        axios
          .get("/api/v1/mentors/allMentor", config)
          .catch(() => ({ data: [] })),
        axios
          .get("/api/v1/notifications/admin", config)
          .catch(() => ({ data: { count: 0, data: [] } })),
        axios
          .get("/api/v1/job-applications/getAppliedJobs", config)
          .catch(() => ({ data: { data: [] } })),
        axios
          .get("/api/v1/slots/allSlots", config)
          .catch(() => ({ data: { slots: [] } })),
        axios.get("/api/v1/lc/getAllLc", config).catch(() => ({ data: [] })),
        axios
          .get("/api/v1/appointments/all", config)
          .catch(() => ({ data: [] })),
        axios
          .get("/api/v1/projects/getAllProjectsForAdmin", config)
          .catch(() => ({ data: { projects: [] } })),
      ]);

      setStats({
        alumni: Array.isArray(alumniRes.data.alumni)
          ? alumniRes.data.alumni.length
          : 0,
        students: Array.isArray(studentsRes.data.students)
          ? studentsRes.data.students.length
          : 0,
        admins: Array.isArray(adminsRes.data.admins)
          ? adminsRes.data.admins.length
          : 0,
        events: Array.isArray(eventRes.data.events)
          ? eventRes.data.events.length
          : 0,
        jobs: jobRes.data?.totalCount || 0,
        discussions: Array.isArray(discussionRes.data.discussions)
          ? discussionRes.data.discussions.length
          : 0,
        successStories: Array.isArray(successStoriesRes.data)
          ? successStoriesRes.data.length
          : 0,
        mentorships: Array.isArray(mentorshipRes.data)
          ? mentorshipRes.data.length
          : 0,
        applications: Array.isArray(applicationsRes.data.data)
          ? applicationsRes.data.data.length
          : 0,
        messages: Array.isArray(messageRes.data?.data)
          ? messageRes.data.data.length
          : 0,
        mentors: Array.isArray(mentorshipRes.data)
          ? mentorshipRes.data.length
          : 0,
        slots: Array.isArray(slotsRes.data.slots)
          ? slotsRes.data.slots.length
          : 0,
        lcReq: Array.isArray(lcRes.data) ? lcRes.data.length : 0,
        lcAppointment: Array.isArray(lcAppointmentRes.data)
          ? lcAppointmentRes.data.length
          : 0,
        projects: Array.isArray(projectsRes.data.projects)
          ? projectsRes.data.projects.length
          : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard stats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Verified Alumni",
      value: stats.alumni,
      icon: "👥",
      link: "/admin/alumni",
    },
    {
      title: "Enrolled Students",
      value: stats.students,
      icon: "🎓",
      link: "/admin/students",
    },
    {
      title: "Active Admins",
      value: stats.admins,
      icon: "🔑",
      link: "/admins",
    },
    {
      title: "Mentors Available",
      value: stats.mentors,
      icon: "👨‍🏫",
      link: "/admin/mentorsAll",
    },
    {
      title: "Upcoming Events",
      value: stats.events,
      icon: "📅",
      link: "/admin/eventCalender",
    },
    {
      title: "Job Postings",
      value: stats.jobs,
      icon: "💼",
      link: "/admin/job-posts",
    },
    {
      title: "Discussion Threads",
      value: stats.discussions,
      icon: "💬",
      link: "/admin/Discussions",
    },
    {
      title: "Published Success Stories",
      value: stats.successStories,
      icon: "🌟",
      link: "/admin/stories",
    },
    {
      title: "Notifications Sent",
      value: stats.messages,
      icon: "✉️",
      link: "/admin/messages",
    },
    {
      title: "Job Applications",
      value: stats.applications,
      icon: "📝",
      link: "/admin/job-applications",
    },
    {
      title: "Available LC Slots",
      value: stats.slots,
      icon: "⏳",
      link: "/admin/create-slot",
    },
    {
      title: "LC Requests",
      value: stats.lcReq,
      icon: "📄",
      link: "/admin/LcApproval",
    },
    {
      title: "LC Appointments Scheduled",
      value: stats.lcAppointment,
      icon: "✅",
      link: "/admin/appointments",
    },
    {
      title: "Student Projects",
      value: stats.projects,
      icon: "💡",
      link: "/admin/allProjects",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const userDistributionData = {
    labels: ["Alumni", "Students", "Admins", "Mentors"],
    datasets: [
      {
        label: "User Distribution",
        data: [stats.alumni, stats.students, stats.admins, stats.mentors],
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
      },
    ],
  };

  const contentOverviewData = {
    labels: ["Events", "Jobs", "Discussions", "Success Stories", "Messages"],
    datasets: [
      {
        label: "Content Overview",
        data: [
          stats.events,
          stats.jobs,
          stats.discussions,
          stats.successStories,
          stats.messages,
        ],
        backgroundColor: [
          "#1abc9c",
          "#9b59b6",
          "#f39c12",
          "#e67e22",
          "#34495e",
        ],
      },
    ],
  };

  const featureStatsData = {
    labels: ["Projects", "Applications", "LC Requests", "LC Appointments"],
    datasets: [
      {
        label: "Feature Overview",
        data: [
          stats.projects,
          stats.applications,
          stats.lcReq,
          stats.lcAppointment,
        ],
        backgroundColor: ["#8e44ad", "#2980b9", "#27ae60", "#c0392b"],
      },
    ],
  };

  const bubbleChartData = {
    datasets: [
      {
        label: "Engagement Metrics",
        data: [
          { x: stats.alumni, y: stats.students, r: 10 },
          { x: stats.events, y: stats.jobs, r: 15 },
          { x: stats.applications, y: stats.projects, r: 20 },
        ],
        backgroundColor: "#3498db",
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: "Activity Correlation",
        data: [
          { x: stats.alumni, y: stats.students },
          { x: stats.jobs, y: stats.events },
          { x: stats.discussions, y: stats.mentors },
        ],
        backgroundColor: "#e74c3c",
      },
    ],
  };

  if (loading) {
    return (
      <div className="unique-dashboard-loading">
        <div className="unique-spinner"></div>
        <p>Gathering insights for your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unique-dashboard-error">
        <div className="unique-error-icon">⚠️</div>
        <p>Oops! We encountered an issue. Please try again.</p>
        <button onClick={fetchStats} className="unique-retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="unique-dashboard-container">
      <AdminSessionForm adminId={adminId} />
      <AdminSessionList adminId={adminId} />
      <div className="unique-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1>Welcome back, {adminName}! 👋</h1>
              <p className="header-subtext">
                Let’s make today impactful. Here's your latest overview.
              </p>
            </div>
          </div>
          <div className="header-right">
            <span className="role-badge">{adminRole}</span>
            <p className="email-text">{adminEmail}</p>
          </div>
        </div>
      </div>

      <div className="unique-stats-container">
        {statCards.map((stat, index) => (
          <a key={index} href={stat.link} className="unique-stats-card">
            <div className="unique-stats-icon">{stat.icon}</div>
            <div className="unique-stats-content">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="unique-charts-container">
        <div className="unique-chart-wrapper">
          <h2>User Distribution</h2>
          <Pie data={userDistributionData} options={chartOptions} />
        </div>
        <div className="unique-chart-wrapper">
          <h2>Content Overview</h2>
          <Bar data={contentOverviewData} options={chartOptions} />
        </div>
        <div className="unique-chart-wrapper">
          <h2>Feature Overview</h2>
          <Doughnut data={featureStatsData} options={chartOptions} />
        </div>
        <div className="unique-chart-wrapper">
          <h2>Engagement Metrics</h2>
          <Bubble data={bubbleChartData} options={chartOptions} />
        </div>
        <div className="unique-chart-wrapper">
          <h2>Activity Correlation</h2>
          <Scatter data={scatterChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
