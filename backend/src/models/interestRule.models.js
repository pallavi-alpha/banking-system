import mongoose, { Schema } from "mongoose";

const InterestRuleSchema = new mongoose.Schema({
  date: { type: String, required: true },
  ruleId: { type: String, required: true },
  rate: { type: Number, min: 0.01, max: 100, required: true },
});

export const InterestRule = mongoose.model("InterestRule", InterestRuleSchema);
