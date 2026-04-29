import type { Profile } from "@/types/database";

export type ProfileDraft = Pick<
  Profile,
  "brand_name" | "full_name" | "phone" | "pix_key" | "primary_category"
>;

export function isProfileComplete(profile: ProfileDraft | null) {
  return Boolean(profile?.full_name.trim() && profile?.primary_category.trim());
}
