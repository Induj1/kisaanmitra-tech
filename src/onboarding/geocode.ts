/**
 * Reverse geocode for onboarding location bubble.
 * Uses Nominatim — respect usage policy in production (cache, rate limit, or proxy).
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}&format=json`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        // Nominatim requires a valid UA; browsers send their own — OK for dev.
      },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { display_name?: string };
    const raw = data.display_name || "";
    const short = raw.split(",").slice(0, 3).join(",").trim();
    return short || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  } catch {
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  }
}
