import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kala-Kriti — AI-Powered Marketplace for Indian Artisans",
  description:
    "Discover authentic Indian handicrafts. AI-powered platform connecting traditional artisans with modern buyers through voice and image-based product listing.",
  keywords: [
    "Indian handicrafts",
    "artisan marketplace",
    "handmade crafts",
    "traditional art",
    "AI marketplace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased font-sans`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
