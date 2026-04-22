const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

// Send message
router.post("/", authMiddleware, sendMessage);

// Get chat with specific user
router.get("/:userId", authMiddleware, getMessages);

module.exports = router;