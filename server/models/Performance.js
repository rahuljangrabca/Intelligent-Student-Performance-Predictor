const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  attendance: { type: Number, default: 0 },
  assignmentScore: { type: Number, default: 0 },
  examScore: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  trend: { type: Number, default: 0 },
  goodPoints: [{ type: String }],
  badPoints: [{ type: String }],
  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  detailedAnalysis: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);