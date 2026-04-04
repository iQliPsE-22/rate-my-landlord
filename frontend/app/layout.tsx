import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl">🏠</span>
              <span className="font-bold text-lg text-zinc-900 group-hover:text-violet-600 transition-colors">
                RateMyLandlord
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-violet-600/10 border border-violet-600/20 text-violet-700 text-xs font-medium">
                INDIA
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/search?q="
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 font-medium"
              >
                Search
              </Link>
              <Link
                href="/submit"
                className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
              >
                Write a Review
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
              <p>© 2026 Rate My Landlord India. Built for tenants, by tenants.</p>
              <div className="flex items-center gap-6">
                <Link href="/submit" className="hover:text-zinc-900 transition-colors font-medium">
                  Submit Review
                </Link>
                <Link href="/search?q=" className="hover:text-zinc-900 transition-colors font-medium">
                  Search Landlords
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
