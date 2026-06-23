import express from "express";

import { addReview, getReviews } from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addReview);

router.get("/:productId", getReviews);

export default router;
