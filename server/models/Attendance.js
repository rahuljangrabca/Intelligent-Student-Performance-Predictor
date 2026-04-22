const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Present"
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
