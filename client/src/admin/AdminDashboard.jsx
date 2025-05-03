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
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
import "../styles/AdminDashboard.css";

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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

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
      ] = await Promise.all([
        axios.get("/api/v1/alumni/all", config),
        axios
          .get("api/v1/admin/allStudents", config)
          .catch(() => ({ data: { students: [] } })),
        axios
          .get("/api/v1/admin/allAdmin", config)
          .catch(() => ({ data: { admins: [] } })),
        axios.get("/api/v1/events/get", config),
        axios.get("/api/v1/jobsPosting/job-posts", config),
        axios
          .get("api/v1/discussions/getDis", config)
          .catch(() => ({ data: { discussions: [] } })),
        axios
          .get("/api/v1/success-stories/all", config)
          .catch(() => ({ data: { stories: [] } })),
        axios
          .get("/api/v1/mentors/allMentor", config)
          .catch(() => ({ data: { mentorships: [] } })),
        axios
          .get("/api/v1/notifications/admin", config)
          .catch(() => ({ data: { count: 0 } })),
        axios
          .get("/api/v1/job-applications/getAppliedJobs", config)
          .catch(() => ({ data: { applications: [] } })),
        axios
          .get("/api/v1/slots/allSlots", config)
          .catch(() => ({ data: { slots: [] } })),
        axios
          .get("/api/v1/lc/getAllLc", config)
          .catch(() => ({ data: { lcReq: [] } })),
        axios
          .get("/api/v1/appointments/all", config)
          .catch(() => ({ data: { lcAppointment: [] } })),
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
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const barData = {
    labels: ["Alumni", "Students", "Admins", "Mentors"],
    datasets: [
      {
        label: "User Count",
        data: [stats.alumni, stats.students, stats.admins, stats.mentors],
        backgroundColor: ["#9f1c33", "#3498db", "#2ecc71", "#f39c12"],
        borderRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Events", "Jobs", "Applications"],
    datasets: [
      {
        label: "Content Count",
        data: [stats.events, stats.jobs, stats.applications],
        backgroundColor: ["#9f1c33", "#3498db", "#2ecc71"],
        borderWidth: 0,
      },
    ],
  };

  const [regTrends, setRegTrends] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [5, 15, 10, 20],
  });

  const [branchDistribution, setBranchDistribution] = useState({
    labels: ["IT", "ECE", "Mechanical", "Civil", "Other"],
    data: [10, 8, 6, 3, 2],
  });

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const trendsRes = await axios.get(
          "/api/v1/analytics/registration-trends",
          config
        );
        if (trendsRes.data.success && trendsRes.data.trends) {
          setRegTrends({
            labels: trendsRes.data.trends.map((item) => item.period),
            data: trendsRes.data.trends.map((item) => item.count),
          });
        }
      } catch (error) {
        console.error("Error fetching registration trends:", error);
      }

      try {
        const branchRes = await axios.get(
          "/api/v1/analytics/alumni-branches",
          config
        );
        if (branchRes.data.success && branchRes.data.distribution) {
          setBranchDistribution({
            labels: branchRes.data.distribution.map((item) => item.branch),
            data: branchRes.data.distribution.map((item) => item.count),
          });
        }
      } catch (error) {
        console.error("Error fetching branch distribution:", error);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const lineData = {
    labels: regTrends.labels,
    datasets: [
      {
        label: "Registrations",
        data: regTrends.data,
        borderColor: "#9f1c33",
        backgroundColor: "rgba(159, 28, 51, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const engagementData = {
    labels: ["Discussions", "Messages", "Mentorships", "Success Stories"],
    datasets: [
      {
        label: "Engagement Count",
        data: [
          stats.discussions,
          stats.messages,
          stats.mentorships,
          stats.successStories,
        ],
        backgroundColor: ["#9f1c33", "#3498db", "#2ecc71", "#f39c12"],
        borderRadius: 4,
      },
    ],
  };

  const polarData = {
    labels: branchDistribution.labels,
    datasets: [
      {
        label: "Branch Distribution",
        data: branchDistribution.data,
        backgroundColor: [
          "#9f1c33",
          "#3498db",
          "#2ecc71",
          "#f39c12",
          "#2c3e50",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const statCards = [
    {
      title: "Total Alumni in DYPASS",
      value: stats.alumni,
      icon: "👥",
      color: "#9f1c33",
    },
    {
      title: "Total Students in DYPASS",
      value: stats.students,
      icon: "🎓",
      color: "#3498db",
    },
    {
      title: "Total Admins in DYPASS",
      value: stats.admins,
      icon: "🔑",
      color: "#2ecc71",
    },
    {
      title: "Total Events",
      value: stats.events,
      icon: "📅",
      color: "#f39c12",
    },
    {
      title: "Total Job Postings",
      value: stats.jobs,
      icon: "💼",
      color: "#9b59b6",
    },
    {
      title: "Total Job Applications",
      value: stats.applications,
      icon: "📝",
      color: "#e74c3c",
    },
    {
      title: "Total Discussions",
      value: stats.discussions,
      icon: "💬",
      color: "#1abc9c",
    },
    {
      title: "Alumni Success Stories",
      value: stats.successStories,
      icon: "🌟",
      color: "#f1c40f",
    },
    {
      title: "Active Mentorships",
      value: stats.mentorships,
      icon: "🤝",
      color: "#34495e",
    },
    {
      title: "Admin Notifications",
      value: stats.messages,
      icon: "✉️",
      color: "#16a085",
    },
    {
      title: "Alumni Mentors",
      value: stats.mentors,
      icon: "👨‍🏫",
      color: "#8e44ad",
    },
    {
      title: "All LC/No Dues Booking Slots",
      value: stats.slots,
      icon: "📆",
      color: "#8e44ad",
    },
    {
      title: "All LC/No Dues Requests",
      value: stats.lcReq,
      icon: "📋",
      color: "#8e44ad",
    },
    {
      title: "All LC/No Dues Appointments",
      value: stats.lcAppointment,
      icon: "📋",
      color: "#8e44ad",
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard loading-state">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard error-state">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="retry-button" onClick={fetchStats}>
          Try Again
        </button>
      </div>
    );
  }

  const refreshAllData = () => {
    fetchStats();
    fetchAnalytics();
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Admin</h1>
        <p>Here's what's happening with your platform today</p>
        <button className="refresh-button" onClick={refreshAllData}>
          Refresh Data
        </button>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderBottom: `4px solid ${stat.color}` }}
          >
            <div
              className="stat-icon"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h2>User Overview</h2>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Content Overview</h2>
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Registration Trends</h2>
          </div>
          <div className="chart-container">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Alumni Branches</h2>
          </div>
          <div className="chart-container">
            <PolarArea data={polarData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Engagement Metrics</h2>
          </div>
          <div className="chart-container">
            <Bar data={engagementData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
