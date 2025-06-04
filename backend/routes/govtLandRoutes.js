import express from "express";
import multer from "multer";
import {
  getAllGovtLand,
  getGovtLandById,
  deleteGovtLandById,
  getAllLandRecords,
  updateGovtLandById,
  buyGovtLand,
  getLandsForSale, // Import the new controller
} from "../controllers/govtLandController.js";

const router = express.Router();
const upload = multer();

// Define routes for govtLand
router.get("/", getAllGovtLand);
router.get("/land-records", getAllLandRecords);
router.get("/for-sale", getLandsForSale);
router.get("/:id", getGovtLandById);
router.delete("/:id", deleteGovtLandById);
router.patch("/:id", updateGovtLandById);
router.post("/buy", upload.single("image"), buyGovtLand);

export default router;
