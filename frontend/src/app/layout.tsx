import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import TourismChatbot from "@/components/TourismChatbot";


export const metadata: Metadata = {
  title: { default: "Pollachi & Palani Tourism", template: "%s | Tamil Tourism" },
  description: "Discover Pollachi & Palani — Tamil Nadu's green gateway and sacred summit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen">
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <TourismChatbot />   {/* 👈 ADD THIS LINE */}
  </ThemeProvider>
</body>

    </html>
  );
}
