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
// Register chart components
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
    applications: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [alumniRes, eventRes, jobRes] = await Promise.all([
        axios.get("/api/v1/alumni/all", config),
        axios.get("/api/v1/events/get", config),
        axios.get("/api/v1/jobsPosting/job-posts", config),
      ]);

      setStats({
        alumni: alumniRes.data.alumni?.length || 0,
        students: 5,
        admins: 2,
        events: eventRes.data.events?.length || 0,
        jobs: jobRes.data.length || 0,
        applications: 12,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Chart data configurations
  const barData = {
    labels: ["Alumni", "Students", "Admins"],
    datasets: [
      {
        label: "User Count",
        data: [stats.alumni, stats.students, stats.admins],
        backgroundColor: ["#9f1c33", "#3498db", "#2ecc71"],
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

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Registrations",
        data: [5, 15, 10, 20],
        borderColor: "#9f1c33",
        backgroundColor: "rgba(159, 28, 51, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const polarData = {
    labels: ["IT", "ECE", "Mechanical", "Civil", "Other"],
    datasets: [
      {
        label: "Branch Distribution",
        data: [10, 8, 6, 3, 2],
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

  // Chart options
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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Admin</h1>
        <p>Here's what's happening with your platform today</p>
      </div>

      <div className="dashboard-stats">
        {[
          {
            title: "Total Alumni",
            value: stats.alumni,
            icon: "👥",
            color: "#9f1c33",
          },
          {
            title: "Total Students",
            value: stats.students,
            icon: "🎓",
            color: "#3498db",
          },
          {
            title: "Total Admins",
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
            title: "Total Applications",
            value: stats.applications,
            icon: "📝",
            color: "#e74c3c",
          },
        ].map((stat, index) => (
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
      </div>
    </div>
  );
};

export default AdminDashboard;
