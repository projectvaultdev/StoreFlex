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
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createProduct,
);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.put(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateProduct,
);

router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  deleteProduct,
);

router.get("/featured", getFeaturedProducts);

router.get("/related/:id", getRelatedProducts);

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
  "/low-stock",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getLowStockProducts,
);

router.delete(
  "/bulk-delete",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  bulkDeleteProducts,
);

router.get("/bought-together/:id", getBoughtTogetherProducts);

router.get("/top-selling", getTopSellingProducts);

router.get("/latest", getLatestProducts);

router.get("/trending", getTrendingProducts);

router.get("/recently-viewed", protect, getRecentlyViewedProducts);

router.get("/compare", compareProducts);

router.post(
  "/:id/faq",
  protect,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  addFAQ,
);

router.get("/:id/faq", getFAQs);

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

router.post("/:id/report", protect, reportProduct);

router.get(
  "/reported",
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

export default router;
