import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MediVox AI — Intelligent Hospital Management",
    template: "%s | MediVox AI",
  },
  description:
    "AI-powered hospital management SaaS with intelligent voice receptionist, automated appointment booking, and secure electronic patient records.",
  keywords: [
    "hospital management",
    "AI receptionist",
    "appointment booking",
    "telemedicine",
    "SaaS",
    "healthcare",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "MediVox AI",
    title: "MediVox AI — Intelligent Hospital Management",
    description:
      "Multi-tenant hospital management platform with AI voice receptionist.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
