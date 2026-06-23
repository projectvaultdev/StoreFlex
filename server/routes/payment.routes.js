import express from "express";

import {
  createPaymentOrder,
  paymentSuccess,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createPaymentOrder);

router.post("/success", protect, paymentSuccess);

export default router;
