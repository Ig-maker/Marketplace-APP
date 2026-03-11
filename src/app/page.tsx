import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DEFAULT_REDIRECT } from "@/lib/constants";

export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? DEFAULT_REDIRECT : "/login");
}
