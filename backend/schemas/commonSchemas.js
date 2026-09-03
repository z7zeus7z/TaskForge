import z from "zod";
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters ")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export default passwordSchema;
