import Project from "../models/Project.js";
const projectMemberAuthorize = () => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const projectId = req.body.project;
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (
        !project.projectOwner.equals(userId) &&
        !project.projectMembers.some((member) => member.equals(userId))
      ) {
        return res
          .status(403)
          .json({ message: "Not allowed to create tasks for this project" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

export default projectMemberAuthorize;
