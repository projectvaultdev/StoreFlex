import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createProduct,
);

router.delete("/:id", protect, authorize(ROLES.SUPER_ADMIN), deleteUser);

export default router;
