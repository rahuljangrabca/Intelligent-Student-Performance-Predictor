const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: ""
  },
  description: {
    type: String
  },
  syllabusStatus: {
    type: String,
    enum: ["Uploaded", "Pending"],
    default: "Pending"
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
