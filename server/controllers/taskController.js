const Task = require("../models/Task");

// Get all tasks for logged in student
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const newTask = new Task({
      studentId: req.user.id,
      title,
      dueDate
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Toggle task status
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Simple toggle for demo
    task.status = task.status === "Completed" ? "Pending" : "Completed";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
