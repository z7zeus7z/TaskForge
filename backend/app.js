import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoute from "./routes/taskRoute.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, projectRoutes);
app.use("/api", authMiddleware, userRoutes);
app.use("/api", authMiddleware, taskRoute);
app.use(errorHandler);
export default app;
