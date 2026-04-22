const express = require("express");
const router = express.Router();
const { getStudentDashboard, getTeacherDashboard } = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get student dashboard data
router.get("/student", authMiddleware, roleMiddleware("student"), getStudentDashboard);

// Get teacher dashboard data
router.get("/teacher", authMiddleware, roleMiddleware("teacher"), getTeacherDashboard);

module.exports = router;
