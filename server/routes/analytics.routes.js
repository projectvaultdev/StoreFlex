import express from "express";

import {
  categoryAnalytics,
  orderStatusAnalytics,
  userGrowthAnalytics,
} from "../controllers/analytics.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get(
  "/category",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  categoryAnalytics,
);

router.get(
  "/order-status",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  orderStatusAnalytics,
);

router.get(
  "/user-growth",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  userGrowthAnalytics,
);

export default router;
