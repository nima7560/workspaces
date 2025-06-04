import express from "express";
import { login } from "../controllers/loginController.js";
import { registerUser } from "../controllers/registerController.js";
import {
  registerGovtLand,
  getAllGovtLand,
  getGovtLandById,
  deleteGovtLandById,
  getAllLandRecords,
} from "../controllers/govtLandController.js";
import { getAllTransactions } from "../controllers/transactionController.js";
import upload from "../middleware/govtUpload.js";

const router = express.Router();

// Login Route
router.post("/login", login);

// Register User Route
router.post("/register", registerUser);

// Register Govt Land Route (POST)
router.post(
  "/govtland/register",
  upload.fields([
    { name: "ownershipProof", maxCount: 1 },
    { name: "thramCopy", maxCount: 1 },
    { name: "surveyReport", maxCount: 1 },
    { name: "taxClearance", maxCount: 1 },
  ]),
  registerGovtLand
);

// Route to GET all government land records
router.get("/govtland", getAllGovtLand);

// Route to GET a specific government land record by ID
router.get("/govtland/:id", getGovtLandById);

// Route to DELETE a specific government land record by ID
router.delete("/govtland/:id", deleteGovtLandById);

// Add route for fetching transactions
router.get("/transactions", getAllTransactions);

// Add route for fetching land records
router.get("/land-records", getAllLandRecords);

export default router;
