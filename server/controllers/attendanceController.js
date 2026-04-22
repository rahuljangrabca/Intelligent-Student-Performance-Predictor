const Attendance = require("../models/Attendance");
const Performance = require("../models/Performance");
const Class = require("../models/Class");

// Get attendance logs for a student (Student perspective)
exports.getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ studentId: req.user.id })
      .populate('classId', 'name type')
      .sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Mark attendance for multiple students (Teacher perspective)
exports.updateAttendance = async (req, res) => {
  try {
    const { classId, attendanceData } = req.body; // attendanceData: [{ studentId, status }]
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    const results = [];

    for (const item of attendanceData) {
      const { studentId, status } = item;

      // 1. Create or update daily attendance record
      let record = await Attendance.findOneAndUpdate(
        { studentId, classId, date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) } },
        { status },
        { upsert: true, new: true }
      );
      results.push(record);

      // 2. Recalculate overall attendance percentage for performance predictor
      const totalClasses = await Attendance.countDocuments({ studentId });
      const presentClasses = await Attendance.countDocuments({ studentId, status: 'Present' });
      const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

      await Performance.findOneAndUpdate(
        { studentId },
        { attendance: attendancePercentage },
        { upsert: true }
      );
    }

    res.json({ msg: "Attendance updated successfully", count: results.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};