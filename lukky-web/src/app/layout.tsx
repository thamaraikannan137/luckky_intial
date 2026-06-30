import type { Metadata } from "next";
import ThemeRegistry from "@/theme/ThemeRegistry";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";
import "@/styles/reference.css";

export const metadata: Metadata = {
  title: "Lukky Enterprises",
  description: "Signage & fabrication management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
