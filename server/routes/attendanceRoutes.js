const express = require("express");
const router = express.Router();
const {
  getAttendance,
  updateAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");

// Get attendance
router.get("/", authMiddleware, getAttendance);

// Update attendance
router.post("/", authMiddleware, updateAttendance);

module.exports = router;