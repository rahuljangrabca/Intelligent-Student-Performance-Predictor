const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  title: String,
  marks: Number,
  status: String // pending / completed
});

module.exports = mongoose.model("Assignment", assignmentSchema);