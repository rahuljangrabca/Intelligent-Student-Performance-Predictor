const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Lecture", "Tutorial", "Lab", "Seminar", "Workshop"],
    default: "Lecture"
  },
  time: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming"
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);
