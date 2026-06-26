import express from "express";
import { getDashboard } from "../controllers/admin.controller.js";
import { createStaffAccount } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// GET /api/v1/admin/dashboard
// Returns: totalProducts, totalCategories, totalOrders, totalUsers, totalRevenue, lowStockProducts, recentOrders
router.get(
  "/dashboard",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getDashboard,
);

// POST /api/v1/admin/staff - create staff/manager/admin by allowed roles
router.post(
  "/staff",
  protect,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  createStaffAccount,
);

export default router;
