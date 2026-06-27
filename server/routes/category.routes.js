import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createCategory,
);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.put(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateCategory,
);

router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteCategory,
);

router.get("/category/:categoryId", getProductsByCategory);

export default router;
