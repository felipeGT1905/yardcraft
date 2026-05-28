import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

import { BRAND } from "@/lib/brand";

// Manrope: body / UI / buttons / labels — pairs with Cormorant Garamond for editorial luxury.
const ycSans = Manrope({
  variable: "--font-yc-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ycSerif = Cormorant_Garamond({
  variable: "--font-yc-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "YardCraft",
    template: "%s • YardCraft",
  },
  description: `${BRAND.tagline}. Luxury landscaping and outdoor living transformations across Northern Virginia.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${ycSans.variable} ${ycSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
