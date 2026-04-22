const Assignment = require("../models/Assignment");
const Performance = require("../models/Performance");
const { analyzeStudent } = require("../utils/predictor");

// Get all assignments (For teachers to manage)
exports.getAllAssignments = async (req, res) => {
  try {
    const data = await Assignment.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get my assignments (For students)
exports.getAssignments = async (req, res) => {
  try {
    const data = await Assignment.find({ studentId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add assignment
exports.addAssignment = async (req, res) => {
  try {
    const newAssignment = new Assignment({
      studentId: req.user.id,
      title: req.body.title,
      marks: req.body.marks,
      status: req.body.status
    });

    await newAssignment.save();
    res.json(newAssignment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Submit grade and update performance analysis
exports.submitGrade = async (req, res) => {
  try {
    const { assignmentId, marks } = req.body;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    assignment.marks = marks;
    assignment.status = 'completed';
    await assignment.save();

    // Update Student Performance aggregate
    const studentId = assignment.studentId;
    let perf = await Performance.findOne({ studentId });
    
    if (perf) {
      // Logic to recalculate average exam/assignment score
      // For now, let's just update the assignmentScore field with the latest grade
      perf.assignmentScore = marks; 
      const analysis = analyzeStudent(perf);
      perf.riskLevel = analysis.risk.charAt(0).toUpperCase() + analysis.risk.slice(1).toLowerCase();
      await perf.save();
    }

    res.json({ assignment, performanceUpdated: !!perf });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};