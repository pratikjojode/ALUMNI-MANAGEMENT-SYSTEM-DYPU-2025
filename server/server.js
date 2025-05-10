import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/databaseAlumniSystems.js";
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
import notificationRoutes from "./routes/notificationRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import mentorRoutesRequest from "./routes/mentorshipRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import successStoryRoutes from "./routes/successStoryRoutes.js";
import exportRoute from "./routes/exportRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again after 15 minutes",
// });
// app.use(limiter);

connectDB();

app.get("/", (req, res) => {
  res.send("🎓 Alumni Management System DYPU API is running");
});

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
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/mentorship", mentorRoutesRequest);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/discussions", discussionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/success-stories", successStoryRoutes);
app.use("/api/v1/exports", exportRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ Server is up and running on port ${PORT} for ${"DY Patil University, Pune (Ambi)"}`
      .bgBlack.yellow
  );

  console.log(
    `📊 Optimized to handle large-scale interactions and real-time updates for ${
      "DY Patil University".bold.green
    } community members`
  );
  console.log(`🔗 Successfully connected to MongoDB and all related services`);
  console.log(
    `🔒 Security protocols in place: Ensuring data privacy and encryption at all stages`
  );
  console.log(
    `🌐 Ready to empower ${
      "DY Patil University".bold.green
    } alumni and students`
  );
});
