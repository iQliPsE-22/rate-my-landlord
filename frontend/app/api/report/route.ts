import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// Define Report schema inline since it's simple
const ReportSchema = new mongoose.Schema(
  {
    review_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "dismissed", "actioned"], default: "pending" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { review_id, reason } = body;

    if (!review_id || !reason) {
      return NextResponse.json({ error: "Missing review_id or reason" }, { status: 400 });
    }

    await Report.create({
      review_id,
      reason: reason.trim(),
      status: "pending",
    });

    return NextResponse.json({ success: true, message: "Report submitted" });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
