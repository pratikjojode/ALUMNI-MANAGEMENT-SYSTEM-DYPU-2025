import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/databaseAlumniSystems.js";

// Route Imports
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobPostRoutes from "./routes/jobPostRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import lcRoutes from "./routes/lcRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";

dotenv.config();
const app = express();

// ✅ Fully open CORS
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Connect DB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("🎓 Alumni Management System DYPU API is running");
});

// API Routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/alumni", alumniRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/jobsPosting", jobPostRoutes);
app.use("/api/v1/job-applications", jobApplicationRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/lc", lcRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/slots", slotRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
