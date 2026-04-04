import { create } from "zustand";
import {
  bootstrapOnboardingState,
  createInitialState,
  reduceOnboarding,
  type GeoHint,
  type OnboardingDraftSlice,
} from "@/onboarding/engine";
import type { CollectedOnboardingData, OnboardingAction, OnboardingLang, OnboardingState } from "@/onboarding/types";

function draftSlice(s: OnboardingState): OnboardingDraftSlice {
  return {
    step: s.step,
    lang: s.lang,
    data: s.data,
    messages: s.messages,
    detectedLocationLabel: s.detectedLocationLabel,
    detectedLat: s.detectedLat,
    detectedLng: s.detectedLng,
  };
}

function storageKey(userId: string) {
  return `kisaan-onboarding-v1-${userId}`;
}

export function persistOnboardingDraft(userId: string, state: OnboardingState) {
  if (state.step === "complete") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify({ draft: draftSlice(state) }));
  } catch {
    /* ignore */
  }
}

export function loadOnboardingDraft(userId: string): OnboardingDraftSlice | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { draft?: OnboardingDraftSlice };
    return parsed.draft ?? null;
  } catch {
    return null;
  }
}

export function clearOnboardingDraft(userId: string) {
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    /* ignore */
  }
}

interface OnboardingStore extends OnboardingState {
  bootstrapped: boolean;
  bootstrap: (
    userId: string,
    lang: OnboardingLang,
    profile: Partial<CollectedOnboardingData> & { primary_need?: string | null },
    geo: GeoHint | null
  ) => void;
  dispatch: (action: OnboardingAction) => void;
  resetFlow: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...bootstrapOnboardingState("hi-en", {}),
  bootstrapped: false,

  bootstrap: (userId, lang, profile, geo) => {
    const draft = loadOnboardingDraft(userId);
    const next = bootstrapOnboardingState(lang, { profile, draft, geo });
    set({ ...next, bootstrapped: true });
  },

  dispatch: (action) => {
    set((s) => ({ ...reduceOnboarding(s, action) }));
  },

  resetFlow: () => {
    const lang = get().lang;
    set({ ...createInitialState(lang), bootstrapped: true });
  },
}));

export function isOnboardingDataComplete(
  data: Partial<CollectedOnboardingData>
): data is CollectedOnboardingData {
  return !!(
    data.name?.trim() &&
    data.location?.trim() &&
    data.crop_type?.trim() &&
    data.primary_need?.trim()
  );
}
