import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  land: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  buyerInfo: {
    name: { type: String },
    email: { type: String },
  },
  sellerInfo: {
    name: { type: String },
    email: { type: String },
  },
  landInfo: {
    location: { type: String },
    size: { type: String },
  },
  documentUrl: { type: String },
  reason: { type: String },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
