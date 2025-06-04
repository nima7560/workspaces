import express from "express";
import { saveContact } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", saveContact);

export default router;
