const express = require("express");
const router = express.Router();
const { getPerformance, getStudentStats, updateStudentMetrics } = require("../controllers/performanceController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Get full performance analysis
router.get("/", authMiddleware, getPerformance);

// Get summary stats for Student Overview
router.get("/stats", authMiddleware, getStudentStats);

// Update student performance (Teachers only)
router.post("/update", authMiddleware, checkRole("teacher"), updateStudentMetrics);

module.exports = router;