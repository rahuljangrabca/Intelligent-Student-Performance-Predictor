const Performance = require("../models/Performance");
const { analyzeStudent } = require("../utils/predictor");

exports.getPerformance = async (req, res) => {
  try {
    const studentId = req.user.id;

    let data = await Performance.findOne({ studentId });

    if (!data) {
      data = new Performance({
        studentId,
        attendance: 80,
        assignmentScore: 75,
        examScore: 70,
        studyHours: 4,
        trend: 1
      });
      await data.save();
    }

    const analysis = analyzeStudent(data);

    // Generate simulated historical trends for working UI
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = months.map((month, i) => ({
      month,
      score: Math.max(50, data.examScore - (months.length - 1 - i) * 2 + Math.floor(Math.random() * 5)) 
    }));

    // Generate simulated mastery data
    const masteryData = [
      { subject: 'Math', A: data.examScore, fullMark: 100 },
      { subject: 'Physics', A: data.assignmentScore, fullMark: 100 },
      { subject: 'Comp Sci', A: 85, fullMark: 100 },
      { subject: 'History', A: 70, fullMark: 100 },
      { subject: 'English', A: 75, fullMark: 100 },
    ];

    res.json({
      performance: data,
      analysis,
      trend: trendData,
      mastery: masteryData
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get summary stats for Student Overview
exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    let data = await Performance.findOne({ studentId });
    
    if (!data) {
      data = new Performance({
        studentId,
        attendance: 80,
        assignmentScore: 75,
        examScore: 70,
        studyHours: 4,
        trend: 1
      });
      await data.save();
    }

    const analysis = analyzeStudent(data);

    res.json({
      attendance: data.attendance,
      avgGrade: data.examScore >= 90 ? 'A' : data.examScore >= 80 ? 'B' : data.examScore >= 70 ? 'C' : 'D',
      riskLevel: analysis.risk,
      goodPointsCount: analysis.goodPoints.length,
      badPointsCount: analysis.badPoints.length,
      studyHours: data.studyHours
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// [Teacher Only] Update student metrics (feeds into the predictor)
exports.updateStudentMetrics = async (req, res) => {
  try {
    const { studentId, attendance, examScore, assignmentScore, studyHours, trend } = req.body;

    let perf = await Performance.findOne({ studentId });

    if (!perf) {
      perf = new Performance({ studentId });
    }

    if (attendance !== undefined) perf.attendance = attendance;
    if (examScore !== undefined) perf.examScore = examScore;
    if (assignmentScore !== undefined) perf.assignmentScore = assignmentScore;
    if (studyHours !== undefined) perf.studyHours = studyHours;
    if (trend !== undefined) perf.trend = trend;

    // The logic in analyzeStudent will catch the changes on next fetch, 
    // but let's pre-analyze and save the results for explicit storage
    const analysis = analyzeStudent(perf);
    perf.riskLevel = analysis.risk.charAt(0).toUpperCase() + analysis.risk.slice(1).toLowerCase(); // Normalize e.g. "Low"
    perf.goodPoints = analysis.goodPoints;
    perf.badPoints = analysis.badPoints;

    await perf.save();
    res.json(perf);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};