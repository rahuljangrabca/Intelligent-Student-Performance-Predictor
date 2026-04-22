const User = require("../models/User");
const Performance = require("../models/Performance");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Event = require("../models/Event");
const Assignment = require("../models/Assignment");
const Task = require("../models/Task");
const { analyzeStudent } = require("../utils/predictor");

// ============ STUDENT DASHBOARD ============
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Performance stats
    let perf = await Performance.findOne({ studentId });
    if (!perf) {
      perf = new Performance({
        studentId,
        attendance: 80,
        assignmentScore: 75,
        examScore: 70,
        studyHours: 4,
        trend: 1
      });
      await perf.save();
    }
    const analysis = analyzeStudent(perf);

    // 2. Enrolled courses count
    const courseCount = await Course.countDocuments({ students: studentId });

    // 3. Enrolled classes count
    const classCount = await Class.countDocuments({ students: studentId });

    // 4. Tasks summary
    const allTasks = await Task.find({ studentId });
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;

    // 5. Upcoming assignments (pending)
    const assignments = await Assignment.find({ studentId, status: 'pending' })
      .sort({ createdAt: -1 }).limit(3);

    // 6. Recent events / announcements
    const events = await Event.find().sort({ date: -1 }).limit(5);

    // 7. Upcoming classes (today)
    const enrolledClasses = await Class.find({ students: studentId, status: 'Upcoming' })
      .populate('teacherId', 'name')
      .sort({ day: 1 }).limit(4);

    // 8. Recent tasks
    const recentTasks = await Task.find({ studentId }).sort({ createdAt: -1 }).limit(3);

    res.json({
      stats: {
        attendance: perf.attendance,
        studyHours: perf.studyHours,
        avgGrade: perf.examScore >= 90 ? 'A' : perf.examScore >= 80 ? 'B' : perf.examScore >= 70 ? 'C' : perf.examScore >= 60 ? 'D' : 'F',
        examScore: perf.examScore,
        assignmentScore: perf.assignmentScore,
        riskLevel: analysis.risk,
        courseCount,
        classCount,
        totalTasks,
        completedTasks,
        pendingTasks
      },
      upcomingDeadlines: assignments,
      announcements: events,
      upcomingClasses: enrolledClasses.map(c => ({
        _id: c._id,
        name: c.name,
        type: c.type,
        time: c.time,
        room: c.room,
        day: c.day,
        teacherName: c.teacherId?.name || 'Faculty'
      })),
      recentTasks: recentTasks.map(t => ({
        _id: t._id,
        title: t.title,
        status: t.status,
        dueDate: t.dueDate
      })),
      analysis: {
        risk: analysis.risk,
        goodPoints: analysis.goodPoints,
        badPoints: analysis.badPoints,
        suggestions: analysis.suggestions
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ============ TEACHER DASHBOARD ============
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const myCourses = await Course.find({ teacherId }).select('name code students syllabusStatus');
    const myClasses = await Class.find({ teacherId }).select('name type time room day status students');
    const totalEventsCount = await Event.countDocuments();

    // 2. Unique enrolled students count (across all teacher's courses and classes)
    const courseStudentIds = new Set();
    myCourses.forEach(c => c.students?.forEach(s => courseStudentIds.add(s.toString())));
    myClasses.forEach(c => c.students?.forEach(s => courseStudentIds.add(s.toString())));
    const myStudentCount = courseStudentIds.size;

    // 3. Performance analysis for teacher's students
    const studentIds = Array.from(courseStudentIds);
    const performanceData = await Performance.find({ studentId: { $in: studentIds } });
    const students = await User.find({ _id: { $in: studentIds } }).select('name email');

    const studentsList = students.map(student => {
      let perf = performanceData.find(p => p.studentId.toString() === student._id.toString());
      let risk = "LOW";
      let analysis = {};
      if (perf) {
        analysis = analyzeStudent(perf);
        risk = analysis.risk;
      }
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        risk,
        attendance: perf ? perf.attendance : 0,
        avgScore: perf ? perf.examScore : 0,
        studyHours: perf ? perf.studyHours : 0,
        goodPoints: analysis.goodPoints || [],
        badPoints: analysis.badPoints || [],
        suggestions: analysis.suggestions || []
      };
    });

    const highRiskCount = studentsList.filter(s => s.risk === 'HIGH').length;
    const mediumRiskCount = studentsList.filter(s => s.risk === 'MEDIUM').length;

    // 4. Recent assignments
    const recentAssignments = await Assignment.find().sort({ createdAt: -1 }).limit(5);

    // 5. Recent events
    const recentEvents = await Event.find().sort({ date: -1 }).limit(5);

    // 6. Active classes
    const activeClasses = myClasses.filter(c => c.status === 'Upcoming');

    res.status(200).json({
      totalStudents,
      myStudentCount,
      totalCourses: myCourses.length,
      totalClasses: myClasses.length,
      activeClasses: activeClasses.length,
      totalEvents: totalEventsCount,
      highRiskCount,
      mediumRiskCount,
      courses: myCourses.map(c => ({
        _id: c._id,
        name: c.name,
        code: c.code || '',
        studentCount: c.students?.length || 0,
        syllabusStatus: c.syllabusStatus || 'Pending'
      })),
      classes: myClasses.map(c => ({
        _id: c._id,
        name: c.name,
        type: c.type,
        time: c.time,
        room: c.room,
        day: c.day,
        status: c.status,
        studentCount: c.students?.length || 0
      })),
      recentEvents,
      recentAssignments,
      studentsList
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { getStudentDashboard, getTeacherDashboard };
