const Task = require("../models/task");
// const { validateObjectId } = require("../utils/validation");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res
      .status(200)
      .json({ tasks, status: true, msg: "Tasks found successfully.." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ status: false, msg: "Invalid task ID" });
    } else {
      return res
        .status(500)
        .json({ status: false, msg: "Internal Server Error" });
    }
  }
};

const getTask = async (req, res) => {
  try {
    // if (!validateObjectId(req.params.taskId)) {
    //   return res.status(400).json({ status: false, msg: "Task id not valid" });
    // }
    console.log(req.user.id);

    const task = await Task.findOne({
      user: req.user.id,
      _id: req.params.taskId,
    });
    if (!task) {
      return res.status(404).json({ status: false, msg: "No task found.." });
    }
    res
      .status(200)
      .json({ task, status: true, msg: "Task found successfully.." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ status: false, msg: "Invalid task ID" });
    } else {
      return res
        .status(500)
        .json({ status: false, msg: "Internal Server Error" });
    }
  }
};

const postTask = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res
        .status(400)
        .json({ status: false, msg: "Description of task not found" });
    }
    console.log(req.user.id);
    const task = await Task.create({ user: req.user.id, description });
    res
      .status(201) // Use 201 Created for successful creation
      .json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

const putTask = async (req, res) => {
  try {
    const { description, status } = req.body; // Get description and status from request body
    if (!description) {
      return res
        .status(400)
        .json({ status: false, msg: "Description of task not found" });
    }

    // if (!validateObjectId(req.params.taskId)) {
    //   return res.status(400).json({ status: false, msg: "Task id not valid" });
    // }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res
        .status(403)
        .json({ status: false, msg: "You can't update task of another user" });
    }

    // Update task with description and status
    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { description, status }, // Include status in the update object
      { new: true }
    );
    res
      .status(200)
      .json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ status: false, msg: "Invalid task ID" });
    } else {
      return res
        .status(500)
        .json({ status: false, msg: "Internal Server Error" });
    }
  }
};
const deleteTask = async (req, res) => {
  try {
    // if (!validateObjectId(req.params.taskId)) {
    //   return res.status(400).json({ status: false, msg: "Task id not valid" });
    // }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res
        .status(403)
        .json({ status: false, msg: "You can't delete task of another user" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ status: false, msg: "Invalid task ID" });
    } else {
      return res
        .status(500)
        .json({ status: false, msg: "Internal Server Error" });
    }
  }
};

module.exports = { getTasks, getTask, postTask, putTask, deleteTask };
