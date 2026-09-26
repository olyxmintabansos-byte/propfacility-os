import type { Metadata } from "next";
import "./globals.css";
import { FacilityProvider } from "@/context/FacilityContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PropFacility OS | Skyscraper BAS Chiller & Lease Studio",
  description: "Enterprise Commercial Real Estate Skyscraper Facility BAS Telemetry by Antigravity (Titan #27)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#141210] text-stone-200 antialiased selection:bg-amber-500 selection:text-black">
        <FacilityProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </main>
        </FacilityProvider>
      </body>
    </html>
  );
}