import express from "express";

import {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOTP,
  verifyOTP,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);
router.post("/send-otp", protect, sendOTP);
router.post("/verify-otp", protect, verifyOTP);

// Profile
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);

export default router;
