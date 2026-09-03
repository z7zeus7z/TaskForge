import { z } from "zod";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title cant be empty"),
  description: z.string().trim().min(1, "Description cant be empty"),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignedTo: z.string().trim().optional(),
  project: z.string().trim(),
  dueDate: z.string().trim().min(1, "Due Date cant be empty"),
});

export default taskSchema;
