import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Landlord from "@/models/Landlord";
import Review from "@/models/Review";
import { generateSlug, calculateAggregateScore } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { landlord_name, city, pincode, tenancy_period, ratings, red_flags, text } = body;

    // Validate required fields
    if (!landlord_name || !city || !ratings) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate ratings
    const axes = ["deposit_return", "maintenance", "behaviour", "rent_fairness"];
    for (const axis of axes) {
      const val = ratings[axis];
      if (!val || val < 1 || val > 5) {
        return NextResponse.json({ error: `Invalid rating for ${axis}` }, { status: 400 });
      }
    }

    // Find or create landlord
    const slug = generateSlug(landlord_name, city, pincode);
    let landlord = await Landlord.findOne({
      slug: { $regex: new RegExp(`^${generateSlug(landlord_name, city)}`) },
    });

    if (!landlord) {
      landlord = await Landlord.create({
        name: landlord_name.trim(),
        slug,
        city: city.trim(),
        pincodes: pincode ? [pincode.trim()] : [],
        review_count: 0,
        aggregate_score: { overall: 0, deposit_return: 0, maintenance: 0, behaviour: 0, rent_fairness: 0 },
        red_flag_counts: { withheld_deposit: 0, no_maintenance: 0, harassment: 0, illegal_entry: 0, arbitrary_hike: 0, ghost_landlord: 0 },
      });
    } else {
      // Add pincode if new
      if (pincode && !landlord.pincodes.includes(pincode.trim())) {
        landlord.pincodes.push(pincode.trim());
      }
    }

    // Create review
    const review = await Review.create({
      landlord_id: landlord._id,
      city: city.trim(),
      pincode: pincode?.trim() || "",
      tenancy_period: tenancy_period?.trim() || "",
      ratings,
      red_flags: red_flags || [],
      text: text?.trim() || "",
      is_verified_tenant: false,
      is_flagged: false,
    });

    // Recalculate aggregate scores
    const allReviews = await Review.find({ landlord_id: landlord._id, is_flagged: false });
    const newAggregate = calculateAggregateScore(allReviews);

    // Recalculate red flag counts
    const flagCounts: Record<string, number> = {
      withheld_deposit: 0, no_maintenance: 0, harassment: 0,
      illegal_entry: 0, arbitrary_hike: 0, ghost_landlord: 0,
    };
    for (const r of allReviews) {
      for (const flag of r.red_flags) {
        if (flag in flagCounts) flagCounts[flag]++;
      }
    }

    landlord.aggregate_score = newAggregate;
    landlord.red_flag_counts = flagCounts as typeof landlord.red_flag_counts;
    landlord.review_count = allReviews.length;
    await landlord.save();

    return NextResponse.json({
      success: true,
      slug: landlord.slug,
      review_id: review._id,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
