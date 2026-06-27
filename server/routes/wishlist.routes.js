import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);

router.post("/", addToWishlist);

router.delete("/:productId", removeFromWishlist);

export default router;
