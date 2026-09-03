import express from "express";
import validate from "../middleware/validate.js";
import { projectSchema } from "../schemas/projectSchema.js";
import {
  createProject,
  addMember,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
const router = express.Router();

router.post("/projects", validate(projectSchema), createProject);
router.post("/projects/:projectId/members", addMember);
router.get("/projects", getProjects);
router.get("/projects/:projectId", getProjectById);
router.patch("/projects/:projectId", updateProject);
router.delete("/projects/:projectId", deleteProject);
export default router;
