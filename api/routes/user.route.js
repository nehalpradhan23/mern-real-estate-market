import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
// API to update user profile
// update after verifying user
router.post("/update/:id", verifyToken, updateUser);

export default router;
