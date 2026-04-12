import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JD Bothma's homepage",
  description: "That's right, a homepage. And a blog. Like it's 1999 or something.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="w-full border-b border-black/10 dark:border-white/20">
            <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold hover:underline">
                JD Bothma
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
                <Link href="/blog" className="text-sm hover:underline">
                  Blog
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
