import mongoose, { Schema, Document } from "mongoose";

export interface ReviewDocument extends Document {
  landlord_id: mongoose.Types.ObjectId;
  city: string;
  pincode: string;
  tenancy_period: string;
  ratings: {
    deposit_return: number;
    maintenance: number;
    behaviour: number;
    rent_fairness: number;
  };
  red_flags: string[];
  text: string;
  is_verified_tenant: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    landlord_id: { type: Schema.Types.ObjectId, ref: "Landlord", required: true, index: true },
    city: { type: String, required: true },
    pincode: { type: String, default: "" },
    tenancy_period: { type: String, default: "" },
    ratings: {
      deposit_return: { type: Number, required: true, min: 1, max: 5 },
      maintenance: { type: Number, required: true, min: 1, max: 5 },
      behaviour: { type: Number, required: true, min: 1, max: 5 },
      rent_fairness: { type: Number, required: true, min: 1, max: 5 },
    },
    red_flags: [{ type: String }],
    text: { type: String, default: "" },
    is_verified_tenant: { type: Boolean, default: false },
    is_flagged: { type: Boolean, default: false },
    flag_reason: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.models.Review || mongoose.model<ReviewDocument>("Review", ReviewSchema);
