const Class = require("../models/Class");

// Get classes (Teacher: owned classes; Student: enrolled classes)
exports.getClasses = async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'teacher') {
      classes = await Class.find({ teacherId: req.user.id })
        .populate('teacherId', 'name')
        .populate('courseId', 'name code')
        .sort({ day: 1 });
    } else {
      classes = await Class.find({ students: req.user.id })
        .populate('teacherId', 'name')
        .populate('courseId', 'name code')
        .sort({ day: 1 });
    }
    const result = classes.map(c => ({
      ...c.toObject(),
      teacherName: c.teacherId?.name || 'Faculty Member',
      courseName: c.courseId?.name || '',
      studentCount: c.students?.length || 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new class (Teacher only)
exports.createClass = async (req, res) => {
  try {
    const { name, type, time, room, day, courseId } = req.body;
    const newClass = new Class({
      name,
      type: type || 'Lecture',
      time,
      room,
      day,
      courseId: courseId || undefined,
      teacherId: req.user.id,
      status: 'Upcoming'
    });
    await newClass.save();
    const populated = await Class.findById(newClass._id)
      .populate('teacherId', 'name')
      .populate('courseId', 'name code');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      courseName: populated.courseId?.name || '',
      studentCount: 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a class (Teacher only)
exports.updateClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: "Class not found" });
    if (cls.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { name, type, time, room, day, status, courseId } = req.body;
    if (name) cls.name = name;
    if (type) cls.type = type;
    if (time) cls.time = time;
    if (room) cls.room = room;
    if (day) cls.day = day;
    if (status) cls.status = status;
    if (courseId !== undefined) cls.courseId = courseId || undefined;

    await cls.save();
    const populated = await Class.findById(cls._id)
      .populate('teacherId', 'name')
      .populate('courseId', 'name code');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      courseName: populated.courseId?.name || '',
      studentCount: populated.students?.length || 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a class (Teacher only)
exports.deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: "Class not found" });
    if (cls.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await Class.findByIdAndDelete(req.params.id);
    res.json({ msg: "Class deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add a student to a class (Teacher only)
exports.addStudent = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: "Class not found" });
    if (cls.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    const { studentId } = req.body;
    if (!cls.students.includes(studentId)) {
      cls.students.push(studentId);
      await cls.save();
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Enroll current student to a class
exports.enrollStudent = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ msg: "Class not found" });
    if (!cls.students.includes(req.user.id)) {
      cls.students.push(req.user.id);
      await cls.save();
    }
    const populated = await Class.findById(cls._id)
      .populate('teacherId', 'name')
      .populate('courseId', 'name code');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      courseName: populated.courseId?.name || '',
      studentCount: populated.students?.length || 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get students of a specific class (Teacher only)
exports.getClassStudents = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate('students', 'name');
    if (!cls) return res.status(404).json({ msg: "Class not found" });
    
    // Check if user is the teacher of this class
    if (cls.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(cls.students);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all available classes (for student browsing)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ status: 'Upcoming' })
      .populate('teacherId', 'name')
      .populate('courseId', 'name code')
      .sort({ day: 1 });
    const result = classes.map(c => ({
      ...c.toObject(),
      teacherName: c.teacherId?.name || 'Faculty Member',
      courseName: c.courseId?.name || '',
      studentCount: c.students?.length || 0,
      isEnrolled: c.students.map(s => s.toString()).includes(req.user.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
