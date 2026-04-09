import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
        {/* Top Navigation Shell */}
        <Header />

        {/* Main content */}
        <main className="flex-1 w-full pt-16 sm:pt-24 pb-12 sm:pb-24">{children}</main>

        {/* Footer Shell */}
        <footer className="bg-slate-50 dark:bg-slate-950 w-full py-8 sm:py-12 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto">
            <div className="font-headline font-bold text-slate-900 dark:text-slate-100 mb-6 md:mb-0 text-xl">
              RentersGuard
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-['Inter'] tracking-wide">
              <Link
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all"
                href="#"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-slate-500 dark:text-slate-400 hover:underline hover:text-indigo-700 transition-all"
                href="#"
              >
                Landlord Guidelines
              </Link>
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
