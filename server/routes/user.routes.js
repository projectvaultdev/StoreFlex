import express from "express";
import {
  blockUser,
  getProfile,
  getUser,
  getUsers,
  unblockUser,
  updateRole,
} from "../controllers/user.controller.js";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Get current user profile
router.get("/profile", protect, getProfile);

// Get all users with pagination and search (admin only)
// Query params: page, limit, search, role
router.get("/", protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getUsers);

// Get single user (admin only)
router.get("/:id", protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getUser);

// Update user role (SUPER_ADMIN only)
router.put("/:id/role", protect, authorize(ROLES.SUPER_ADMIN), updateRole);

// Update user details (admin only)
router.put(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateUser,
);

// Delete user (admin only)
router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteUser,
);

// Block user (admin only)
router.put(
  "/:id/block",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  blockUser,
);

// Unblock user (admin only)
router.put(
  "/:id/unblock",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  unblockUser,
);

export default router;
