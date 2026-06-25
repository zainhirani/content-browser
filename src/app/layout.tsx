import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Content Browser",
  description: "Browse, search, and stream a catalog of titles.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <header className="sticky top-0 z-20 border-b border-white/10 bg-surface/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-brand"
              >
                ▶ Content Browser
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;