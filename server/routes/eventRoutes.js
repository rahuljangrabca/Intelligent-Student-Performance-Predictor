const express = require("express");
const router = express.Router();
const { getEvents, addEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getEvents);
router.post("/", authMiddleware, addEvent);

module.exports = router;
