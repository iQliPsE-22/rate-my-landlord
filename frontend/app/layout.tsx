import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rate My Landlord India — Know Your Landlord Before You Sign",
  description:
    "Anonymous landlord reviews for Indian tenants. Search landlord ratings, submit reviews, and protect the next tenant. Glassdoor for landlords.",
  keywords: "landlord review, tenant review india, rate landlord, landlord rating, rental review india",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)" }}>
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(250,250,249,0.92)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl">🏠</span>
              <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>
                RateMyLandlord
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase" style={{ background: "var(--accent-surface)", color: "var(--accent)", border: "1px solid #FDBA74" }}>
                India
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/search?q="
                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-stone-100"
                style={{ color: "var(--text-secondary)" }}
              >
                Search
              </Link>
              <Link
                href="/submit"
                className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all duration-200 hover:bg-[#9A3412]"
                style={{ background: "var(--accent)" }}
              >
                Write a Review
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer — minimal, editorial */}
        <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Rate My Landlord India</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Built for tenants, by tenants. © 2026</p>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <Link href="/submit" className="transition-colors duration-200 hover:text-stone-900">
                  Submit Review
                </Link>
                <Link href="/search?q=" className="transition-colors duration-200 hover:text-stone-900">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
