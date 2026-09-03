import z from "zod";
import passwordSchema from "./commonSchemas.js";

const registerSchema = z.object({
  fname: z.string().trim().min(1, "First name is required"),
  lname: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export { registerSchema, loginSchema };
