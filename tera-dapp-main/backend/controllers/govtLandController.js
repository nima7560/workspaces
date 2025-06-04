import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

// Define the GovtLand schema
const govtLandSchema = new mongoose.Schema({
  landType: { type: String, required: true },
  location: { type: String, required: true },
  landSize: { type: String, required: true },
  boundaryDetails: { type: String, required: true },
  ownerName: { type: String, required: true },
  cid: { type: String, required: true }, // changed from cidNumber
  contactNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  ownershipType: { type: String, required: true },
  coOwners: { type: [String], default: [] },
  ownershipProof: { type: String },
  thramCopy: { type: String },
  surveyReport: { type: String },
  taxClearance: { type: String },
  registrationDate: { type: Date, default: Date.now },
  thramNumber: { type: String, required: true },
  isForSale: { type: Boolean, default: false },
  price: { type: Number },
});

// Create the GovtLand model
const GovtLand = mongoose.model("GovtLand", govtLandSchema);

// Function to register a new GovtLand record
export const registerGovtLand = async (req, res) => {
  try {
    const { body } = req;

    console.log("JSON Body Received:", body);

    const newGovtLand = new GovtLand({
      landType: body.landType,
      location: body.location,
      landSize: body.landSize,
      boundaryDetails: body.boundaryDetails,
      ownerName: body.ownerName,
      cid: body.cid,
      contactNumber: body.contactNumber,
      emailAddress: body.emailAddress,
      ownershipType: body.ownershipType,
      coOwners: body.coOwners,
      thramNumber: body.thramNumber,
      ownershipProof: "",
      thramCopy: "",
      surveyReport: "",
      taxClearance: "",
    });

    const savedGovtLand = await newGovtLand.save();

    res.status(201).json({
      message: "Govt Land registered successfully (JSON only)!",
      data: savedGovtLand,
    });
  } catch (error) {
    console.error("Error registering govt land (JSON only):", error);
    res.status(500).json({
      message: "Error registering govt land (JSON only).",
      error: error.message,
    });
  }
};

// Controller to register land
export const registerLand = async (req, res) => {
  try {
    const {
      landType,
      location,
      landSize,
      boundaryDetails,
      ownerName,
      cid,
      contactNumber,
      emailAddress,
      ownershipType,
      coOwners,
      thramNumber,
    } = req.body;

    // Create a new land record
    const newLand = new GovtLand({
      landType,
      location,
      landSize,
      boundaryDetails,
      ownerName,
      cid,
      contactNumber,
      emailAddress,
      ownershipType,
      coOwners,
      thramNumber,
    });

    await newLand.save();
    res
      .status(201)
      .json({ message: "Land registered successfully", land: newLand });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering land", error: error.message });
  }
};

// Function to fetch all GovtLand records
export const getAllGovtLand = async (req, res) => {
  try {
    const govtLands = await GovtLand.find({});

    // Transform data to match frontend expectations
    const transformedLands = govtLands.map((land) => ({
      id: land._id,
      owner: land.ownerName,
      landType: land.landType,
      location: land.location,
      landSize: land.landSize,
      boundaryDetails: land.boundaryDetails,
      cid: land.cid,
      contactNumber: land.contactNumber,
      emailAddress: land.emailAddress,
      ownershipType: land.ownershipType,
      coOwners: land.coOwners,
      thramNumber: land.thramNumber,
      ownershipProof: land.ownershipProof,
      thramCopy: land.thramCopy,
      surveyReport: land.surveyReport,
      taxClearance: land.taxClearance,
      date: land.registrationDate,
    }));

    res.status(200).json({
      message: "Successfully fetched all Govt Land records",
      data: transformedLands,
    });
  } catch (error) {
    console.error("Error fetching Govt Land records:", error);
    res.status(500).json({
      message: "Failed to fetch Govt Land records",
      error: error.message,
    });
  }
};

// Function to fetch a single GovtLand record by ID
export const getGovtLandById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const govtLand = await GovtLand.findById(id);

    if (!govtLand) {
      return res.status(404).json({ message: "Govt Land record not found" });
    }

    res.status(200).json({
      message: "Successfully fetched Govt Land record",
      data: govtLand,
    });
  } catch (error) {
    console.error("Error fetching Govt Land record by ID:", error);
    res.status(500).json({
      message: "Failed to fetch Govt Land record by ID",
      error: error.message,
    });
  }
};

// Function to delete a GovtLand record by ID
export const deleteGovtLandById = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedLand = await GovtLand.findByIdAndDelete(id);

    if (!deletedLand) {
      return res.status(404).json({ message: "Govt Land record not found" });
    }

    res.status(200).json({
      message: "Govt Land record deleted successfully",
      data: deletedLand,
    });
  } catch (error) {
    console.error("Error deleting Govt Land record by ID:", error);
    res.status(500).json({
      message: "Failed to delete Govt Land record",
      error: error.message,
    });
  }
};

// PATCH: Update a GovtLand record by ID (partial update)
export const updateGovtLandById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const updateFields = req.body;
    // Remove fields that should not be updated directly (if any)
    delete updateFields._id;
    delete updateFields.id;
    // Update the record
    const updatedLand = await GovtLand.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!updatedLand) {
      return res.status(404).json({ message: "Govt Land record not found" });
    }
    res.status(200).json({
      message: "Govt Land record updated successfully",
      data: updatedLand,
    });
  } catch (error) {
    console.error("Error updating Govt Land record by ID:", error);
    res.status(500).json({
      message: "Failed to update Govt Land record",
      error: error.message,
    });
  }
};

// Fetch all land records
export const getAllLandRecords = async (req, res) => {
  try {
    const landRecords = await GovtLand.find();
    res.status(200).json(landRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch land records" });
  }
};

// Function to handle land purchase and transfer ownership
export const buyGovtLand = async (req, res) => {
  console.log("buyGovtLand controller called");
  try {
    // For multipart/form-data, fields are in req.body, files in req.file/req.files
    const {
      landId,
      bank,
      journalNumber,
      buyerName,
      buyerCid,
      buyerContact,
      buyerEmail,
    } = req.body;
    // Debug log to verify incoming fields
    console.log("Buy request body:", req.body);
    // Validate required fields
    if (!landId || !buyerName || !buyerCid) {
      return res.status(400).json({
        message: "Missing required fields for purchase.",
        received: req.body,
      });
    }
    // Find the land record
    const land = await GovtLand.findById(landId);
    if (!land) {
      return res.status(404).json({ message: "Land record not found." });
    }
    // Save transaction log
    const transaction = new Transaction({
      id: landId,
      owner: buyerName,
      land: landId,
      date: new Date().toISOString(),
      status: "Completed",
      type: "Buy",
      buyerInfo: {
        name: buyerName,
        email: buyerEmail || "",
      },
      sellerInfo: {
        name: land.ownerName,
        email: land.emailAddress,
      },
      landInfo: {
        location: land.location,
        size: land.landSize,
      },
      documentUrl: "",
      reason: "Land purchase and ownership transfer",
    });
    await transaction.save();
    // Transfer ownership
    land.ownerName = buyerName;
    land.cid = buyerCid;
    land.contactNumber = buyerContact || land.contactNumber;
    land.emailAddress = buyerEmail || land.emailAddress;
    land.ownershipType = "Private";
    await land.save();
    res.status(200).json({
      message: "Land ownership transferred successfully.",
      data: land,
      transaction,
    });
  } catch (error) {
    console.error("Error during land purchase/ownership transfer:", error);
    res.status(500).json({
      message: "Failed to complete land purchase.",
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
  }
};

// Controller to fetch only lands for sale
export const getLandsForSale = async (req, res) => {
  try {
    const landsForSale = await GovtLand.find({ isForSale: true });
    // Transform data for frontend
    const transformed = landsForSale.map((land) => ({
      id: land._id,
      owner: land.ownerName,
      landType: land.landType,
      location: land.location,
      landSize: land.landSize,
      boundaryDetails: land.boundaryDetails,
      cid: land.cid,
      contactNumber: land.contactNumber,
      emailAddress: land.emailAddress,
      ownershipType: land.ownershipType,
      coOwners: land.coOwners,
      thramNumber: land.thramNumber,
      ownershipProof: land.ownershipProof,
      thramCopy: land.thramCopy,
      surveyReport: land.surveyReport,
      taxClearance: land.taxClearance,
      date: land.registrationDate,
      isForSale: land.isForSale,
      price: land.price,
    }));
    res.status(200).json({
      message: "Lands for sale fetched successfully",
      data: transformed,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lands for sale",
      error: error.message,
    });
  }
};
