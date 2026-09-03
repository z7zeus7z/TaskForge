import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
const createProject = async (req, res, next) => {
  try {
    const {
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
    } = req.body;

    const projectOwner = req.user.userId;
    const newProject = await Project.create({
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
      projectOwner,
      projectStatus: "active",
      projectMembers: [],
      projectTasks: [],
    });
    return res
      .status(201)
      .json({ message: "Project created successfully", newProject });
  } catch (error) {
    console.error("Error in createProject Controller", error);
    next(error);
  }
};
const addMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.body.userId;
    const ownerId = req.user.userId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!project.projectOwner.equals(ownerId)) {
      return res.status(403).json({ message: "Only owner can add members" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMember = project.projectMembers.some((member) =>
      member.equals(userId),
    );
    if (isMember) {
      return res.status(409).json({ message: "User is already a member" });
    }
    project.projectMembers.push(userId);
    const updatedProject = await project.save();
    await updatedProject.populate("projectMembers", "fname lname email");
    await updatedProject.populate("projectOwner", "fname lname email");
    return res
      .status(200)
      .json({ message: "Member added to project", updatedProject });
  } catch (error) {
    console.error("Error in addMember ", error);
    next(error);
  }
};
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const projects = await Project.find({
      $or: [{ projectOwner: userId }, { projectMembers: userId }],
    })
      .populate("projectOwner", "fname lname email")
      .populate("projectMembers", "fname lname email")
      .populate({
        path: "projectTasks",
        populate: {
          path: "assignedTo",
          select: "fname lname email",
        },
      });

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error in getProjects Controller", error);
    next(error);
  }
};
const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user.userId;
    const project = await Project.findById(projectId)
      .populate("projectOwner", "fname lname email")
      .populate("projectMembers", "fname lname email")
      .populate({
        path: "projectTasks",
        populate: { path: "assignedTo", select: "fname lname email" },
      });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isOwner = project.projectOwner._id.equals(userId);
    const isMember = project.projectMembers.some((member) =>
      member._id.equals(userId),
    );
    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "You do not have access to this project" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error in getProjectById Controller", error);
    next(error);
  }
};
const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
      projectStatus,
    } = req.body;

    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!project.projectOwner.equals(userId)) {
      return res.status(403).json({
        message: "Only the project owner can edit the project",
      });
    }

    project.projectName = projectName;
    project.projectDescription = projectDescription;
    project.projectStartDate = projectStartDate;
    project.projectEndDate = projectEndDate;
    project.projectStatus = projectStatus;

    const updatedProject = await project.save();

    await updatedProject.populate("projectOwner", "fname lname email");

    await updatedProject.populate("projectMembers", "fname lname email");

    await updatedProject.populate({
      path: "projectTasks",
      populate: {
        path: "assignedTo",
        select: "fname lname email",
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error in updateProject Controller", error);
    next(error);
  }
};
const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!project.projectOwner.equals(userId)) {
      return res.status(403).json({
        message: "Only the project owner can delete the project",
      });
    }

    await Task.deleteMany({
      project: projectId,
    });

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({
      message: "Project and its tasks deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProject Controller", error);
    next(error);
  }
};
export {
  createProject,
  addMember,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
