import express from "express";

import {
  addAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/address.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addAddress);

router.get("/", protect, getAddresses);

router.delete("/:id", protect, deleteAddress);

export default router;
