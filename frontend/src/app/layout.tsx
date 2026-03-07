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
      <body className="min-h-screen overflow-x-hidden">

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <Navbar />

          {/* 🔥 ADD THIS pb-28 */}
          <main className="pb-28">
            {children}
          </main>

          <Footer />
          <TourismChatbot />

        </ThemeProvider>

      </body>
    </html>
  );
}