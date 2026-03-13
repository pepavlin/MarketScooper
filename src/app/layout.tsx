import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketScooper - AI Market Gap Research Engine",
  description:
    "Discover real market opportunities by analyzing discussions, complaints, and willingness-to-pay signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b">
          <div className="container mx-auto flex h-14 items-center px-4">
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-lg font-bold">
                MarketScooper
              </a>
              <a
                href="/opportunities"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Opportunities
              </a>
              <a
                href="/admin"
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Admin
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
