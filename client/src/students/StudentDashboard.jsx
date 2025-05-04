import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../styles/StudentDashboard.css";

import EventIcon from "@mui/icons-material/Event";
import ForumIcon from "@mui/icons-material/Forum";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircularProgress from "@mui/material/CircularProgress";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ icon, title, value, linkText, linkUrl }) => (
  <div className="stat-card">
    <div className="icon-wrapper">{icon}</div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p>{value}</p>
      <a href={linkUrl} className="stat-link">
        {linkText}
        <ArrowForwardIcon fontSize="small" className="link-arrow" />
      </a>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="chart-card">
    <h3>{title}</h3>
    <div className="chart-content">{children}</div>
  </div>
);

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    events: [],
    discussions: [],
    mentors: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [events, discussions, mentors] = await Promise.all([
        axios.get("/api/v1/events/get", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/v1/discussions/getDis", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("/api/v1/mentors/allMentor", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      setDashboardData({
        events: events.data.events || [],
        discussions: discussions.data.discussions || [],
        mentors: Array.isArray(mentors.data) ? mentors.data : [],
      });
      setError(null);
    } catch {
      toast.error("Failed to load dashboard data");
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const barData = {
    labels: ["Events", "Discussions", "Mentors"],
    datasets: [
      {
        label: "Count",
        data: [
          dashboardData.events.length,
          dashboardData.discussions.length,
          dashboardData.mentors.length,
        ],
        backgroundColor: ["#9f1c33", "#d32f2f", "#ff5252"],
        borderRadius: 8,
        hoverBackgroundColor: ["#821525", "#b22424", "#e04848"],
      },
    ],
  };

  const pieData = {
    labels: ["Events", "Discussions", "Mentors"],
    datasets: [
      {
        data: [
          dashboardData.events.length,
          dashboardData.discussions.length,
          dashboardData.mentors.length,
        ],
        backgroundColor: ["#9f1c33", "#d32f2f", "#ff5252"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.9)",
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
    },
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your academic progress and engagement
        </p>
      </header>

      {loading ? (
        <div className="loading-overlay">
          <CircularProgress style={{ color: "#9f1c33" }} />
          <p>Loading Dashboard...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
        <>
          <section className="stat-section">
            <StatCard
              icon={<EventIcon fontSize="large" className="stat-icon" />}
              title="Upcoming Events"
              value={dashboardData.events.length}
              linkText="View Calendar"
              linkUrl="/student/events"
            />
            <StatCard
              icon={<ForumIcon fontSize="large" className="stat-icon" />}
              title="Active Discussions"
              value={dashboardData.discussions.length}
              linkText="Join Conversation"
              linkUrl="/student/discussions"
            />
            <StatCard
              icon={<SchoolIcon fontSize="large" className="stat-icon" />}
              title="Available Mentors"
              value={dashboardData.mentors.length}
              linkText="Connect Now"
              linkUrl="/student/mentors"
            />
          </section>

          <section className="charts-section">
            <ChartCard title="Engagement Overview">
              <Bar data={barData} options={chartOptions} />
            </ChartCard>
            <ChartCard title="Resource Distribution">
              <Pie
                data={pieData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: "bottom",
                    },
                  },
                }}
              />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
