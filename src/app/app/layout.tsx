import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";

export default async function AppAreaLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await getAuthState();

  if (!authState.user) {
    redirect("/login");
  }

  if (!authState.isProfileComplete) {
    redirect("/onboarding");
  }

  return children;
}
