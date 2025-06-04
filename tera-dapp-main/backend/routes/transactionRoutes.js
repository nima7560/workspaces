import express from "express";
import { getAllTransactions } from "../controllers/transactionController.js";

const router = express.Router();

// Top-level transactions route
router.get("/", getAllTransactions);

export default router;
