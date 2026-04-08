import mongoose, { Schema, Document } from "mongoose";

export interface LandlordDocument extends Document {
  name: string;
  slug: string;
  city: string;
  address?: string;
  phone_number?: string;
  pincodes: string[];
  review_count: number;
  aggregate_score: {
    overall: number;
    deposit_return: number;
    maintenance: number;
    behaviour: number;
    rent_fairness: number;
  };
  red_flag_counts: {
    withheld_deposit: number;
    no_maintenance: number;
    harassment: number;
    illegal_entry: number;
    arbitrary_hike: number;
    ghost_landlord: number;
  };
  created_at: Date;
  updated_at: Date;
}

const LandlordSchema = new Schema<LandlordDocument>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true, index: true },
    address: { type: String },
    phone_number: { type: String },
    pincodes: [{ type: String, index: true }],
    review_count: { type: Number, default: 0 },
    aggregate_score: {
      overall: { type: Number, default: 0 },
      deposit_return: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      behaviour: { type: Number, default: 0 },
      rent_fairness: { type: Number, default: 0 },
    },
    red_flag_counts: {
      withheld_deposit: { type: Number, default: 0 },
      no_maintenance: { type: Number, default: 0 },
      harassment: { type: Number, default: 0 },
      illegal_entry: { type: Number, default: 0 },
      arbitrary_hike: { type: Number, default: 0 },
      ghost_landlord: { type: Number, default: 0 },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Text index for search
LandlordSchema.index({ name: "text", city: "text", address: "text", phone_number: "text" });

export default mongoose.models.Landlord || mongoose.model<LandlordDocument>("Landlord", LandlordSchema);
