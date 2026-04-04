import type { SupabaseClient } from "@supabase/supabase-js";
import type { CollectedOnboardingData } from "./types";

export async function saveOnboardingToFarmerProfile(
  supabase: SupabaseClient,
  userId: string,
  data: CollectedOnboardingData
): Promise<{ error: Error | null }> {
  const { data: existing, error: fetchErr } = await supabase
    .from("farmer_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) {
    return { error: new Error(fetchErr.message) };
  }

  const payload = {
    name: data.name,
    location: data.location,
    address: data.location,
    crop_type: data.crop_type,
    primary_need: data.primary_need,
  };

  if (existing) {
    const { error } = await supabase.from("farmer_profiles").update(payload).eq("user_id", userId);
    return { error: error ? new Error(error.message) : null };
  }

  const { error } = await supabase.from("farmer_profiles").insert({
    user_id: userId,
    ...payload,
    phone: "—",
    land_size: 1,
  });

  return { error: error ? new Error(error.message) : null };
}
