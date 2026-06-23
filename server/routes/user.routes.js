import express from "express";
import {
  blockUser,
  getProfile,
  getUser,
  getUsers,
  unblockUser,
  updateRole,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.get("/", protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getUsers);

router.get("/:id", protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getUser);

router.put("/role/:id", protect, authorize(ROLES.SUPER_ADMIN), updateRole);

router.put(
  "/block/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  blockUser,
);

router.put(
  "/unblock/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  unblockUser,
);

export default router;
