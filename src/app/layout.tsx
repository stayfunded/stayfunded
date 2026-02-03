// src/app/layout.tsx
import "../app/globals.css";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://stayfunded.io"),
  title: {
    default: "StayFunded — A daily operating system for prop firm accounts",
    template: "%s | StayFunded",
  },
  description:
    "StayFunded is a daily operating system for trading prop firm accounts correctly — Today, Playbooks, and Accountability. Built to increase your chances of passing evaluations, keeping funded accounts, and getting paid (without promises). No signals. No trade calls.",
  openGraph: {
    title: "StayFunded — A daily operating system for prop firm accounts",
    description:
      "A daily operating system for trading prop firm accounts correctly — Today, Playbooks, and Accountability. Increase your chances of passing evaluations, keeping funded accounts, and getting paid (without promises). No signals. No trade calls.",
    type: "website",
    siteName: "StayFunded",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayFunded — A daily operating system for prop firm accounts",
    description:
      "A daily operating system for trading prop firm accounts correctly — Today, Playbooks, and Accountability. Increase your chances of passing evaluations, keeping funded accounts, and getting paid (without promises). No signals. No trade calls.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
