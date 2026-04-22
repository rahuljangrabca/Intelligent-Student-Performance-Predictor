const Event = require("../models/Event");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add event (Teacher/Admin only potentially)
exports.addEvent = async (req, res) => {
  try {
    const { title, description, date, type } = req.body;
    const newEvent = new Event({ title, description, date, type });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
