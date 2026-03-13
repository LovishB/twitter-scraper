import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { FetchButton } from "@/components/fetch-button";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twitter Scraper",
  description: "Fetch, filter, and respond to tweets with AI",
};

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[#eff3f4] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[53px] max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-[#0f1419] transition-opacity hover:opacity-70"
        >
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-[#0f1419]">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">Scraper</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#536471] transition-all hover:bg-[#0f1419]/[0.04] hover:text-[#0f1419]"
          >
            Latest Tweets
          </Link>
          <Link
            href="/keywords"
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#536471] transition-all hover:bg-[#0f1419]/[0.04] hover:text-[#0f1419]"
          >
            Keywords
          </Link>
          <FetchButton />
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-white font-sans text-[#0f1419] antialiased`}
      >
        <Nav />
        <main className="mx-auto max-w-5xl px-4">{children}</main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0f1419",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
