const express = require("express");
const router = express.Router();
const { register, login, getUsersByRole, googleLogin } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Google Auth
router.post("/google", googleLogin);

// Get users (by role)
router.get("/users", authMiddleware, getUsersByRole);

module.exports = router;