import Task from "../models/Task.js";
import Project from "../models/Project.js";
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      project,
      dueDate,
    } = req.body;
    const createdBy = req.user.userId;
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      project,
      dueDate,
      createdBy,
    });
    await task.populate("assignedTo", "fname lname email");
    projectDoc.projectTasks.push(task._id);
    await projectDoc.save();

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error in createTask Controller", error);
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const allowedStatus = ["todo", "in-progress", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.status = status;
    await task.save();
    await task.populate("assignedTo", "fname lname email");
    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error in updateTaskStatus controller", error);
    next(error);
  }
};

export { createTask, updateTaskStatus };
