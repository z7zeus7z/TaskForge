import express from "express";
import {
  createTask,
  updateTaskStatus,
} from "../controllers/tasksController.js";
import validate from "../middleware/validate.js";
import taskSchema from "../schemas/taskSchemas.js";
import projectMemberAuthorize from "../middleware/projectMemberMiddleware.js";
const router = express.Router();

router.post(
  "/tasks",
  validate(taskSchema),
  projectMemberAuthorize(),
  createTask,
);
router.patch("/tasks/:taskId/status", updateTaskStatus);
export default router;
