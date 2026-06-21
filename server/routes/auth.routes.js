import express from "express";

import {
  register,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshAccessToken);

export default router;
