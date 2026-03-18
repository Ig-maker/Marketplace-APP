import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getBrandProfile, getBrandLogoUrl } from "@/lib/brand";
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

  const brand = user.role === "brand" ? await getBrandProfile(user.id) : null;
  const brandLogoUrl = brand?.companyWebsite ? getBrandLogoUrl(brand.companyWebsite) : null;

  return (
    <BrandDashboardShell
      user={user}
      brandName={brand?.brandName ?? null}
      brandLogoUrl={brandLogoUrl}
    >
      {children}
    </BrandDashboardShell>
  );
}
