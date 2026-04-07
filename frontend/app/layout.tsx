import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentersGuard | Search & Results",
  description:
    "Anonymous landlord reviews and transparency in housing. Search landlord ratings, submit reviews, and protect the next tenant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("light", inter.variable, manrope.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
        
        {/* Top Navigation Shell */}
        <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-[0px_24px_48px_-12px_rgba(19,27,46,0.08)]">
          <div className="flex justify-between items-center px-6 md:px-12 h-20 max-w-[1440px] mx-auto">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-indigo-900 dark:text-indigo-100 font-headline">RentersGuard</Link>
            <div className="hidden md:flex gap-8 items-center font-headline font-semibold tracking-tight">
              <Link href="/search?q=" className="text-slate-600 dark:text-slate-400 hover:text-indigo-900 transition-colors duration-300">Browse Properties</Link>
              <Link href="/search?q=" className="text-slate-600 dark:text-slate-400 hover:text-indigo-900 transition-colors duration-300">Landlord Directory</Link>
              <Link href="/submit" className="text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-700 pb-1">Write a Review</Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden lg:block relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary/30 transition-all font-body text-sm" placeholder="Search landlords..." type="text" />
              </div>
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-semibold text-sm scale-100 active:scale-95 transition-all duration-150">Sign In</button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 w-full pt-32 pb-24">{children}</main>

        {/* Footer Shell */}
        <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1440px] mx-auto">
            <div className="font-headline font-bold text-slate-900 dark:text-slate-100 mb-6 md:mb-0 text-xl">RentersGuard</div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-['Inter'] tracking-wide">
              <Link className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all" href="#">Terms of Service</Link>
              <Link className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all" href="#">Privacy Policy</Link>
              <Link className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all" href="#">Landlord Guidelines</Link>
            </div>
            <div className="mt-8 md:mt-0 text-slate-500 dark:text-slate-400 text-xs">
                © 2026 RentersGuard. Transparency in Housing.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
