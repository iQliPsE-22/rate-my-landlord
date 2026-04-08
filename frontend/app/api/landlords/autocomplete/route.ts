import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Landlord from "@/models/Landlord";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ landlords: [] });
    }

    // Build query
    const query: Record<string, unknown> = {};
    const $or: Record<string, unknown>[] = [];

    function escapeRegex(text: string) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    const regex = { $regex: escapeRegex(q), $options: "i" };
    $or.push({ name: regex });
    $or.push({ address: regex });
    $or.push({ phone_number: regex });
    $or.push({ city: regex });

    query.$or = $or;

    const landlords = await Landlord.find(query)
      .select("name city address phone_number slug")
      .sort({ review_count: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ landlords });
  } catch (error) {
    console.error("Error in autocomplete:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
