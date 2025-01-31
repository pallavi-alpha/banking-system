import mongoose, { Schema } from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    account: { type: String, required: true },
    type: { type: String, enum: ["D", "W"], required: true },
    amount: { type: Number, min: 0.01, required: true },
    txnId: { type: String, unique: true, required: true },
    balance: { type: Number, min: 0, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", TransactionSchema);
