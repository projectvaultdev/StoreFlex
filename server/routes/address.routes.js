import express, { Router } from "express";
import {
  addAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/address.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, addAddress);

router.get("/", protect, getAddresses);

router.delete("/:id", protect, deleteAddress);

export default Router;
