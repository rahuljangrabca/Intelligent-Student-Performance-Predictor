const express = require("express");
const router = express.Router();
const {
  getAssignments,
  getAllAssignments,
  addAssignment,
  submitGrade
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Get my assignments (Students)
router.get("/", authMiddleware, getAssignments);

// Get all assignments (Teachers)
router.get("/all", authMiddleware, checkRole("teacher"), getAllAssignments);

// Add assignment (Teachers)
router.post("/", authMiddleware, checkRole("teacher"), addAssignment);

// Submit grade (Teachers)
router.post("/grade", authMiddleware, checkRole("teacher"), submitGrade);

module.exports = router;