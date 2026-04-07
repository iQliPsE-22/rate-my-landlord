import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Landlord from "@/models/Landlord";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const city = searchParams.get("city")?.trim();
    const pincode = searchParams.get("pincode")?.trim();

    if (!q && !city && !pincode) {
      return NextResponse.json({ error: "Provide at least one search parameter" }, { status: 400 });
    }

    // Build query
    const query: Record<string, unknown> = {};

    function escapeRegex(text: string) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    if (q) {
      // Case-insensitive regex search on name
      query.name = { $regex: escapeRegex(q), $options: "i" };
    }

    if (city && city !== "All Cities") {
      query.city = { $regex: escapeRegex(city), $options: "i" };
    }

    if (pincode) {
      query.pincodes = pincode;
    }

    const landlords = await Landlord.find(query)
      .sort({ review_count: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ landlords });
  } catch (error) {
    console.error("Error searching landlords:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
