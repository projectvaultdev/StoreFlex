import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRelatedProducts,
  toggleFeaturedProduct,
  softDeleteProduct,
  restoreProduct,
  getLowStockProducts,
  bulkDeleteProducts,
  getBoughtTogetherProducts,
  getTopSellingProducts,
  getLatestProducts,
  getTrendingProducts,
  getRecentlyViewedProducts,
  compareProducts,
  deleteFAQ,
  updateFAQ,
  getFAQs,
  addFAQ,
  removeReport,
  getReportedProducts,
  reportProduct,
  getProductsByCategory,
  getBrands,
  getPriceRange,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Public read-only routes
router.get("/latest", getLatestProducts);
router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/filters/brands", getBrands);
router.get("/filters/price-range", getPriceRange);
router.get("/category/:categoryId", getProductsByCategory);

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  upload.array("images", 10),
  createProduct,
);

router.put(
  "/featured/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  toggleFeaturedProduct,
);

router.put(
  "/delete/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  softDeleteProduct,
);

router.put(
  "/restore/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  restoreProduct,
);

router.get(
  "/admin/low-stock",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getLowStockProducts,
);

router.delete(
  "/admin/bulk-delete",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  bulkDeleteProducts,
);

router.get(
  "/admin/reported",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getReportedProducts,
);

router.delete(
  "/:id/report/:reportId",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  removeReport,
);

// Protected user routes
router.get("/recently-viewed", protect, getRecentlyViewedProducts);

router.post("/:id/report", protect, reportProduct);

// FAQ routes (admin specific for create/update/delete)
router.post(
  "/:id/faq",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  addFAQ,
);

router.put(
  "/:id/faq/:faqId",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateFAQ,
);

router.delete(
  "/:id/faq/:faqId",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteFAQ,
);

// Product specific comparison & related routes
router.get("/compare", compareProducts);
router.get("/related/:id", getRelatedProducts);
router.get("/bought-together/:id", getBoughtTogetherProducts);

// General search route
router.get("/", getProducts);

// Get FAQs for a product (public)
router.get("/:id/faq", getFAQs);

// Core product routes (must be last)
router.get("/:id", getProduct);

router.put(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  upload.array("images", 10),
  updateProduct,
);

router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteProduct,
);

export default router;
