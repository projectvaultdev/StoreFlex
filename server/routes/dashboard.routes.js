import express from "express";

import {
  getDashboardData,
  getDashboardStats,
  monthlySales,
  recentOrders,
  topProducts,
} from "../controllers/dashboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Main comprehensive dashboard endpoint
router.get(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getDashboardData,
);

router.get(
  "/stats",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getDashboardStats,
);

router.get(
  "/monthly-sales",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  monthlySales,
);

router.get(
  "/top-products",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  topProducts,
);

router.get(
  "/recent-orders",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  recentOrders,
);

export default router;
