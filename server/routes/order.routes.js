import express from "express";

import {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  cancelOrder,
  updateTracking,
  completeRefund,
  rejectReturn,
  approveReturn,
  requestReturn,
  trackOrder,
  updateTrackingDetails,
  updateShippingStatus,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/:id", protect, getOrder);

router.put("/cancel/:id", protect, cancelOrder);

router.get(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getAllOrders,
);

router.put(
  "/tracking/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateTracking,
);

router.put("/return-request/:id", protect, requestReturn);

router.put(
  "/approve-return/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  approveReturn,
);

router.put(
  "/reject-return/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  rejectReturn,
);

router.put(
  "/complete-refund/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  completeRefund,
);

router.put(
  "/shipping-status/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateShippingStatus,
);

router.put(
  "/tracking/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateTrackingDetails,
);

router.get("/track/:id", protect, trackOrder);

export default router;
