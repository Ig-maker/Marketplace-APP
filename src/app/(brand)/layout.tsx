import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
