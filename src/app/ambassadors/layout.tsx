import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shelvian — For Ambassadors",
  description: "Browse shifts, pick your schedule, and get paid within 24 hours. Join Shelvian as an ambassador.",
};

export default function AmbassadorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
