import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shelvian — Authentication",
  description: "Log in or sign up for Shelvian",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
