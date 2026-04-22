const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Performance = require("./models/Performance");
const Assignment = require("./models/Assignment");
const Attendance = require("./models/Attendance");
const Course = require("./models/Course");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Performance.deleteMany({});
    await Assignment.deleteMany({});
    await Attendance.deleteMany({});
    await Course.deleteMany({});

    // Create Teacher
    const teacherSalt = await bcrypt.genSalt(10);
    const teacherPassword = await bcrypt.hash("teacher123", teacherSalt);
    const teacher = await User.create({
      name: "Dr. Sarah Wilson",
      email: "teacher@test.com",
      password: "teacher123", // Model pre-save will hash this if I use .create, but wait...
      // Actually my model has a pre-save hook, so I should just pass plain text if I use .create or save()
      role: "teacher"
    });

    // Create Students
    const student1 = await User.create({
      name: "Alice Smith",
      email: "alice@test.com",
      password: "password123",
      role: "student"
    });

    const student2 = await User.create({
      name: "Bob Jones",
      email: "bob@test.com",
      password: "password123",
      role: "student"
    });

    const student3 = await User.create({
      name: "Charlie Brown",
      email: "charlie@test.com",
      password: "password123",
      role: "student"
    });

    // Create Performance Records
    // Alice: Low Risk
    await Performance.create({
      studentId: student1._id,
      attendance: 95,
      assignmentScore: 88,
      examScore: 92,
      studyHours: 6,
      trend: 1,
      goodPoints: ["Excellent Attendance", "Strong Exam Scores"],
      badPoints: [],
      riskLevel: "Low"
    });

    // Bob: High Risk
    await Performance.create({
      studentId: student2._id,
      attendance: 65,
      assignmentScore: 45,
      examScore: 40,
      studyHours: 2,
      trend: -1,
      goodPoints: [],
      badPoints: ["Low Attendance", "Poor Exam Scores", "Decreasing Trend"],
      riskLevel: "High"
    });

    // Charlie: Medium Risk
    await Performance.create({
      studentId: student3._id,
      attendance: 78,
      assignmentScore: 65,
      examScore: 68,
      studyHours: 4,
      trend: 0,
      goodPoints: ["Decent Attendance"],
      badPoints: ["Weak Assignment Scores"],
      riskLevel: "Medium"
    });

    // Create mock assignments
    await Assignment.create([
      { studentId: student1._id, title: "Calculus Homework 1", marks: 95, status: "completed" },
      { studentId: student2._id, title: "Calculus Homework 1", marks: 40, status: "completed" },
      { studentId: student2._id, title: "Physics Lab Report", marks: 0, status: "pending" }
    ]);

    // Create mock attendance
    await Attendance.create([
      { studentId: student1._id, status: "Present", date: new Date() },
      { studentId: student2._id, status: "Absent", date: new Date() }
    ]);

    // Create Courses and enroll students
    const allStudentIds = [student1._id, student2._id, student3._id];
    await Course.create([
      {
        name: "Advanced Calculus",
        description: "In-depth study of calculus concepts including limits, derivatives, and integrals.",
        teacherId: teacher._id,
        students: allStudentIds
      },
      {
        name: "Quantum Mechanics",
        description: "Foundations of quantum theory, wave functions, and Schrödinger's equation.",
        teacherId: teacher._id,
        students: allStudentIds
      },
      {
        name: "Data Structures",
        description: "Analysis of fundamental data structures including arrays, trees, graphs, and hash maps.",
        teacherId: teacher._id,
        students: allStudentIds
      },
      {
        name: "World History",
        description: "A survey of major world events and civilizations from ancient times to the present.",
        teacherId: teacher._id,
        students: allStudentIds
      },
      {
        name: "Modern Literature",
        description: "Reading and analysis of significant works from 20th-century world literature.",
        teacherId: teacher._id,
        students: allStudentIds
      }
    ]);
    console.log("📚 Courses seeded and students enrolled!");

    console.log("Seeding complete! 🌱");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
