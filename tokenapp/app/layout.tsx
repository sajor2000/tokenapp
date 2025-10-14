import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/lib/project-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CLIF-CAT | Clinical Logic-Informed Foundation Model Tokenization",
    template: "%s | CLIF-CAT"
  },
  description: "Physician-driven tokenization platform for ICU foundation models. Set clinical thresholds, preserve medical logic, and prevent statistical artifacts in healthcare AI. Designed for intensivists and medical data scientists.",
  keywords: [
    "clinical tokenization",
    "ICU foundation models",
    "medical AI",
    "healthcare machine learning",
    "clinical binning",
    "medical data preprocessing",
    "sepsis thresholds",
    "ICU critical values",
    "physician-driven AI",
    "clinical decision support",
    "ECDF",
    "medical data science",
    "anchor-first binning"
  ],
  authors: [{ name: "CLIF-CAT Team" }],
  creator: "CLIF-CAT",
  publisher: "CLIF-CAT",

  // Open Graph
  openGraph: {
    title: "CLIF-CAT | Clinical Tokenization for ICU AI",
    description: "Preserve clinical logic in foundation models. Physician-defined thresholds ensure AI learns medical reasoning, not statistical artifacts.",
    type: "website",
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "CLIF-CAT | Clinical Tokenization for ICU AI",
    description: "Physician-driven tokenization preserves medical logic in foundation models",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Category
  category: 'healthcare',
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
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
