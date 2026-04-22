const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // body parser
app.use(cors()); // allow frontend requests

// ================= ROUTES =================

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Dashboard Routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Performance Routes
app.use("/api/performance", require("./routes/performanceRoutes"));

// Assignment Routes
app.use("/api/assignments", require("./routes/assignmentRoutes"));

// Attendance Routes
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Chat Routes
app.use("/api/chat", require("./routes/chatRoutes"));

// Course Routes
app.use("/api/courses", require("./routes/courseRoutes"));

// Class Routes
app.use("/api/classes", require("./routes/classRoutes"));

// Task Routes
app.use("/api/tasks", require("./routes/taskRoutes"));

// Event Routes
app.use("/api/events", require("./routes/eventRoutes"));

// ==========================================

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global Error Handler (optional but good)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});