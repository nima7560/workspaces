import mongoose from "mongoose";

const govtLandSchema = new mongoose.Schema(
  {
    landType: { type: String, required: true },
    location: { type: String, required: true },
    landSize: { type: String, required: true },
    boundaryDetails: { type: String, required: true },

    ownerName: { type: String, required: true },
    cid: { type: String, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovtLand", govtLandSchema);
