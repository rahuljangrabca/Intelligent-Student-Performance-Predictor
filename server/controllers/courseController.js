const Course = require("../models/Course");

// Get courses (Student view: enrolled; Teacher view: owned)
exports.getCourses = async (req, res) => {
  try {
    let courses;
    if (req.user.role === 'teacher') {
      courses = await Course.find({ teacherId: req.user.id }).populate('teacherId', 'name');
    } else {
      courses = await Course.find({ students: req.user.id }).populate('teacherId', 'name');
    }
    // Attach teacherName for simpler frontend access
    const result = courses.map(c => ({
      ...c.toObject(),
      teacherName: c.teacherId?.name || 'Faculty Member',
      studentCount: c.students?.length || 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all available courses (for student browsing)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name');
    const result = courses.map(c => ({
      ...c.toObject(),
      teacherName: c.teacherId?.name || 'Faculty Member',
      studentCount: c.students?.length || 0,
      isEnrolled: c.students.map(s => s.toString()).includes(req.user.id)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create Course (Teacher Only)
exports.createCourse = async (req, res) => {
  try {
    const { name, code, description, syllabusStatus } = req.body;
    const newCourse = new Course({
      name,
      code: code || '',
      description,
      syllabusStatus: syllabusStatus || 'Pending',
      teacherId: req.user.id
    });
    await newCourse.save();
    const populated = await Course.findById(newCourse._id).populate('teacherId', 'name');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      studentCount: 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update Course (Teacher Only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { name, code, description, syllabusStatus } = req.body;
    if (name) course.name = name;
    if (code !== undefined) course.code = code;
    if (description !== undefined) course.description = description;
    if (syllabusStatus) course.syllabusStatus = syllabusStatus;

    await course.save();
    const populated = await Course.findById(course._id).populate('teacherId', 'name');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      studentCount: populated.students?.length || 0
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete Course (Teacher Only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: "Course deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Student self-enroll in a course
exports.enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (!course.students.includes(req.user.id)) {
      course.students.push(req.user.id);
      await course.save();
    }
    const populated = await Course.findById(course._id).populate('teacherId', 'name');
    res.json({
      ...populated.toObject(),
      teacherName: populated.teacherId?.name || 'Faculty Member',
      studentCount: populated.students?.length || 0,
      isEnrolled: true
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
