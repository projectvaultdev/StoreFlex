import express from "express";

import {
  addRecentlyViewed,
  getRecentlyViewed,
} from "../controllers/recentlyViewed.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addRecentlyViewed);

router.get("/", protect, getRecentlyViewed);

export default router;
