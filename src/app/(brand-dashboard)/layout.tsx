import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { BrandDashboardShell } from "@/components/brand-dashboard-shell";

export default async function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <BrandDashboardShell user={user}>{children}</BrandDashboardShell>;
}
