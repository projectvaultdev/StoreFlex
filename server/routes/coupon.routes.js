import express from "express";

import { createCoupon, applyCoupon } from "../controllers/coupon.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createCoupon,
);

router.post("/apply", protect, applyCoupon);

export default router;
