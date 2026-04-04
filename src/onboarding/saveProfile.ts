import type { SupabaseClient } from "@supabase/supabase-js";
import type { CollectedOnboardingData } from "./types";

export async function saveOnboardingToFarmerProfile(
  supabase: SupabaseClient,
  userId: string,
  data: CollectedOnboardingData
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("farmer_profiles")
    .update({
      name: data.name,
      location: data.location,
      address: data.location,
      crop_type: data.crop_type,
      primary_need: data.primary_need,
    })
    .eq("user_id", userId);

  return { error: error ? new Error(error.message) : null };
}
