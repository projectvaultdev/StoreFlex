import express from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  moveToCart,
  removeSaveForLater,
  getSaveForLater,
  moveToSaveForLater,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/", protect, updateCartItem);

router.delete("/:productId", protect, removeCartItem);

router.delete("/", protect, clearCart);

router.post("/save-for-later/:productId", protect, moveToSaveForLater);

router.get("/save-for-later", protect, getSaveForLater);

router.delete("/save-for-later/:productId", protect, removeSaveForLater);

router.post("/move-to-cart/:productId", protect, moveToCart);

export default router;
