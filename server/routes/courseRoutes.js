const express = require("express");
const router = express.Router();
const {
  getCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent
} = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Get user's own courses
router.get("/", authMiddleware, getCourses);

// Get all available courses (for student browsing)
router.get("/all", authMiddleware, getAllCourses);

// Create course (teacher only)
router.post("/", authMiddleware, checkRole("teacher"), createCourse);

// Update course (teacher only)
router.put("/:id", authMiddleware, checkRole("teacher"), updateCourse);

// Delete course (teacher only)
router.delete("/:id", authMiddleware, checkRole("teacher"), deleteCourse);

// Student self-enroll
router.post("/:id/enroll", authMiddleware, enrollStudent);

module.exports = router;
