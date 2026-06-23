import express from "express";

import { downloadInvoice } from "../controllers/invoice.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protect, downloadInvoice);

export default router;
