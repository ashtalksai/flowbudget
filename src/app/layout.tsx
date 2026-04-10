import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://flowbudget.ashketing.com"),
  title: "FlowBudget — Personal Finance Tracker",
  description: "Income smoothing, debt payoff planning, and smart transaction categorization for EU freelancers.",
  openGraph: {
    title: "FlowBudget — Personal Finance Tracker",
    description: "Income smoothing, debt payoff planning, and smart transaction categorization for EU freelancers.",
    url: "https://flowbudget.ashketing.com",
    siteName: "FlowBudget",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
