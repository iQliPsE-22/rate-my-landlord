export interface RatingAxes {
  deposit_return: number;
  maintenance: number;
  behaviour: number;
  rent_fairness: number;
}

export interface AggregateScore extends RatingAxes {
  overall: number;
}

export interface RedFlagCounts {
  [key: string]: number;
  withheld_deposit: number;
  no_maintenance: number;
  harassment: number;
  illegal_entry: number;
  arbitrary_hike: number;
  ghost_landlord: number;
}

export interface ILandlord {
  _id: string;
  name: string;
  slug: string;
  city: string;
  address?: string;
  phone_number?: string;
  pincodes: string[];
  review_count: number;
  aggregate_score: AggregateScore;
  red_flag_counts: RedFlagCounts;
  reviews?: IReview[];
  created_at: string;
  updated_at: string;
}

export interface IReview {
  _id: string;
  landlord_id: string;
  city: string;
  pincode: string;
  tenancy_period: string;
  ratings: RatingAxes;
  red_flags: string[];
  text: string;
  is_verified_tenant: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: string;
}

export interface IReport {
  _id: string;
  review_id: string;
  reason: string;
  status: "pending" | "dismissed" | "actioned";
  created_at: string;
}

export const RED_FLAGS = [
  { id: "withheld_deposit", label: "Withheld Deposit", emoji: "💰" },
  { id: "no_maintenance", label: "Ignored Maintenance", emoji: "🔧" },
  { id: "harassment", label: "Harassment", emoji: "⚠️" },
  { id: "illegal_entry", label: "Entered Without Notice", emoji: "🚪" },
  { id: "arbitrary_hike", label: "Arbitrary Rent Hike", emoji: "📈" },
  { id: "ghost_landlord", label: "Unreachable / Ghost", emoji: "👻" },
] as const;

export type RedFlagId = (typeof RED_FLAGS)[number]["id"];

export const RATING_LABELS: Record<keyof RatingAxes, string> = {
  deposit_return: "Deposit Return",
  maintenance: "Maintenance",
  behaviour: "Behaviour",
  rent_fairness: "Rent Fairness",
};

export const CITIES = [
  "Delhi NCR",
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Indore",
  "Kochi",
  "Goa",
  "Other",
];
