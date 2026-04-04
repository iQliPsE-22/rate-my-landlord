import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Landlord from "@/models/Landlord";
import Review from "@/models/Review";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const landlord = await Landlord.findOne({ slug }).lean();

    if (!landlord) {
      return NextResponse.json({ error: "Landlord not found" }, { status: 404 });
    }

    const reviews = await Review.find({ landlord_id: landlord._id, is_flagged: false })
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json({ landlord, reviews });
  } catch (error) {
    console.error("Error fetching landlord:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
