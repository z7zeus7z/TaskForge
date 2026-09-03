import express from "express";
import { getUsers, getProfile } from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/users", getUsers);
router.get("/profile", authMiddleware, getProfile);
export default router;
