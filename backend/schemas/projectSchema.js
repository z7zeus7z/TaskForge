import { z } from "zod";

const projectSchema = z.object({
  projectName: z.string().trim().min(1, "Project name cannot be empty"),
  projectDescription: z
    .string()
    .trim()
    .min(1, "Project description cannot be empty"),
  projectStartDate: z.string().min(1, "Start date is required"),
  projectEndDate: z.string().min(1, "End date is required"),
});

export { projectSchema };
