const express = require("express");
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  addStudent,
  enrollStudent,
  getAllClasses,
  getClassStudents
} = require("../controllers/classController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Get user's classes (teacher or student)
router.get("/", authMiddleware, getClasses);

// Get all available classes (for student browsing)
router.get("/all", authMiddleware, getAllClasses);

// Create a class (teacher only)
router.post("/", authMiddleware, checkRole("teacher"), createClass);

// Update a class (teacher only)
router.put("/:id", authMiddleware, checkRole("teacher"), updateClass);

// Delete a class (teacher only)
router.delete("/:id", authMiddleware, checkRole("teacher"), deleteClass);

// Add student to class (teacher only)
router.post("/:id/add-student", authMiddleware, checkRole("teacher"), addStudent);

// Student self-enroll
router.post("/:id/enroll", authMiddleware, enrollStudent);

// Get students for attendance (teacher only)
router.get("/:id/students", authMiddleware, checkRole("teacher"), getClassStudents);

module.exports = router;
