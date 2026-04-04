/** Onboarding state machine types (web). */

export type OnboardingLang = "hi-en" | "en";

export type OnboardingStep =
  | "ask_name"
  | "confirm_location"
  | "edit_location"
  | "ask_crop"
  | "ask_crop_other"
  | "ask_need"
  | "complete";

export interface CollectedOnboardingData {
  name: string;
  location: string;
  crop_type: string;
  primary_need: string;
}

export type PartialOnboardingData = Partial<CollectedOnboardingData>;

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  ts: number;
}

export interface OnboardingState {
  step: OnboardingStep;
  lang: OnboardingLang;
  data: PartialOnboardingData;
  messages: ChatMessage[];
  /** Human-readable place from GPS / geocode */
  detectedLocationLabel: string | null;
  detectedLat: number | null;
  detectedLng: number | null;
}

export type OnboardingAction =
  | { type: "USER_TEXT"; text: string }
  | { type: "QUICK_REPLY"; value: string }
  | { type: "LOCATION_DETECTED"; label: string; lat: number; lng: number }
  | { type: "SET_LANG"; lang: OnboardingLang }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: Pick<OnboardingState, "step" | "data" | "messages" | "detectedLocationLabel" | "detectedLat" | "detectedLng"> };
