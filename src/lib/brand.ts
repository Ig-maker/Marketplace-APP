import { createSupabaseServerClient } from "./supabase-server";

export interface BrandProfile {
  brandName: string | null;
  companyWebsite: string | null;
}

export async function getBrandProfile(userId: string): Promise<BrandProfile> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("brand_registrations")
      .select("brand_name, company_website")
      .eq("id", userId)
      .single();

    return {
      brandName: data?.brand_name ?? null,
      companyWebsite: data?.company_website ?? null,
    };
  } catch {
    return { brandName: null, companyWebsite: null };
  }
}

/** Derive logo URL from company website using logo API */
export function getBrandLogoUrl(companyWebsite: string | null): string | null {
  if (!companyWebsite?.trim()) return null;
  try {
    const url = new URL(companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`);
    const domain = url.hostname.replace(/^www\./, "");
    if (!domain) return null;
    return `https://logo.ifetchly.com/api/logo?domain=${domain}`;
  } catch {
    return null;
  }
}
