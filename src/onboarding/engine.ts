import { locationConfirmQuestion, t } from "./messages";
import type {
  ChatMessage,
  CollectedOnboardingData,
  OnboardingAction,
  OnboardingLang,
  OnboardingState,
  OnboardingStep,
  PartialOnboardingData,
} from "./types";

export const CROP_OPTIONS = ["Wheat", "Rice", "Vegetables", "Other"] as const;
export const NEED_OPTIONS = ["Crop problem", "Daily guidance", "Market prices", "Loans"] as const;

export const QUICK_LOCATION = { YES: "Yes", CHANGE: "Change" } as const;
export const QUICK_HI_YES = "Haan";
export const QUICK_HI_CHANGE = "Change";

function uid(): string {
  return crypto.randomUUID();
}

function bot(text: string): ChatMessage {
  return { id: uid(), role: "bot", text, ts: Date.now() };
}

function user(text: string): ChatMessage {
  return { id: uid(), role: "user", text, ts: Date.now() };
}

export function createInitialState(lang: OnboardingLang = "hi-en"): OnboardingState {
  return {
    step: "ask_name",
    lang,
    data: {},
    messages: [bot(t(lang, "welcome"))],
    detectedLocationLabel: null,
    detectedLat: null,
    detectedLng: null,
  };
}

/** Treat default signup crop as "not chosen yet" for onboarding. */
function cropNeedsOnboarding(crop?: string | null): boolean {
  if (!crop?.trim()) return true;
  const c = crop.trim().toLowerCase();
  return c === "general" || c === "other";
}

export interface GeoHint {
  label: string;
  lat: number;
  lng: number;
}

export interface OnboardingDraftSlice {
  step: OnboardingStep;
  lang: OnboardingLang;
  data: PartialOnboardingData;
  messages: ChatMessage[];
  detectedLocationLabel: string | null;
  detectedLat: number | null;
  detectedLng: number | null;
}

/**
 * Build initial chat state from profile + optional local draft + GPS hint.
 * Resume: prefer unfinished draft from localStorage.
 */
export function bootstrapOnboardingState(
  lang: OnboardingLang,
  options: {
    profile?: Partial<CollectedOnboardingData> & { primary_need?: string | null };
    draft?: OnboardingDraftSlice | null;
    geo?: GeoHint | null;
  }
): OnboardingState {
  const { profile = {}, draft, geo } = options;

  if (draft && draft.messages.length > 0 && draft.step !== "complete") {
    return {
      step: draft.step,
      lang: draft.lang ?? lang,
      data: { ...draft.data },
      messages: [...draft.messages],
      detectedLocationLabel: draft.detectedLocationLabel ?? geo?.label ?? null,
      detectedLat: draft.detectedLat ?? geo?.lat ?? null,
      detectedLng: draft.detectedLng ?? geo?.lng ?? null,
    };
  }

  const name = profile.name?.trim();
  const loc = profile.location?.trim();
  const crop = profile.crop_type?.trim();
  const need = profile.primary_need?.trim();
  const cropOk = crop && !cropNeedsOnboarding(crop);

  if (name && loc && cropOk && need) {
    return {
      step: "complete",
      lang,
      data: { name, location: loc, crop_type: crop!, primary_need: need },
      messages: [
        bot(t(lang, "welcome")),
        user(name),
        bot(locationConfirmQuestion(lang, loc)),
        user(QUICK_LOCATION.YES),
        bot(t(lang, "ask_crop")),
        user(crop!),
        bot(t(lang, "ask_need")),
        user(need),
        bot(t(lang, "complete")),
      ],
      detectedLocationLabel: loc,
      detectedLat: geo?.lat ?? null,
      detectedLng: geo?.lng ?? null,
    };
  }

  const base = createInitialState(lang);
  if (geo) {
    base.detectedLocationLabel = geo.label;
    base.detectedLat = geo.lat;
    base.detectedLng = geo.lng;
  }

  if (!name) {
    return base;
  }

  const messages: ChatMessage[] = [bot(t(lang, "welcome")), user(name)];
  const data: PartialOnboardingData = { name };
  let step: OnboardingStep = "confirm_location";
  const place =
    geo?.label ||
    loc ||
    (geo ? `${geo.lat.toFixed(3)}, ${geo.lng.toFixed(3)}` : "…");

  messages.push(bot(locationConfirmQuestion(lang, place)));

  if (loc) {
    const yesLabel = lang === "en" ? QUICK_LOCATION.YES : QUICK_HI_YES;
    messages.push(user(yesLabel));
    data.location = loc;
    step = "ask_crop";
    messages.push(bot(t(lang, "ask_crop")));
    if (cropOk) {
      messages.push(user(crop!));
      data.crop_type = crop!;
      step = "ask_need";
      messages.push(bot(t(lang, "ask_need")));
      if (need) {
        messages.push(user(need));
        data.primary_need = need;
        step = "complete";
        messages.push(bot(t(lang, "complete")));
      }
    }
  }

  return {
    ...base,
    step,
    data,
    messages,
    detectedLocationLabel: geo?.label ?? loc ?? base.detectedLocationLabel,
    detectedLat: geo?.lat ?? base.detectedLat,
    detectedLng: geo?.lng ?? base.detectedLng,
  };
}

export function reduceOnboarding(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "RESET":
      return createInitialState(state.lang);

    case "SET_LANG": {
      return { ...state, lang: action.lang };
    }

    case "HYDRATE":
      return {
        ...state,
        step: action.state.step,
        data: { ...action.state.data },
        messages: [...action.state.messages],
        detectedLocationLabel: action.state.detectedLocationLabel,
        detectedLat: action.state.detectedLat,
        detectedLng: action.state.detectedLng,
      };

    case "LOCATION_DETECTED": {
      if (state.step !== "confirm_location" || state.messages.length < 2) {
        return {
          ...state,
          detectedLocationLabel: action.label,
          detectedLat: action.lat,
          detectedLng: action.lng,
        };
      }
      const msgs = [...state.messages];
      const lastBotIdx = [...msgs].map((m, i) => ({ m, i })).filter((x) => x.m.role === "bot").pop()?.i;
      if (lastBotIdx != null && msgs[lastBotIdx].text.includes("📍")) {
        msgs[lastBotIdx] = bot(locationConfirmQuestion(state.lang, action.label));
      }
      return {
        ...state,
        detectedLocationLabel: action.label,
        detectedLat: action.lat,
        detectedLng: action.lng,
        messages: msgs,
      };
    }

    case "USER_TEXT": {
      const text = action.text.trim();
      if (!text) return state;

      switch (state.step) {
        case "ask_name": {
          const data = { ...state.data, name: text };
          const place =
            state.detectedLocationLabel ||
            (state.detectedLat != null && state.detectedLng != null
              ? `${state.detectedLat.toFixed(3)}, ${state.detectedLng.toFixed(3)}`
              : "…");
          return {
            ...state,
            step: "confirm_location",
            data,
            messages: [...state.messages, user(text), bot(locationConfirmQuestion(state.lang, place))],
          };
        }
        case "edit_location": {
          const data = { ...state.data, location: text };
          return {
            ...state,
            step: "ask_crop",
            data,
            messages: [...state.messages, user(text), bot(t(state.lang, "ask_crop"))],
          };
        }
        case "ask_crop_other": {
          const data = { ...state.data, crop_type: text };
          return {
            ...state,
            step: "ask_need",
            data,
            messages: [...state.messages, user(text), bot(t(state.lang, "ask_need"))],
          };
        }
        default:
          return state;
      }
    }

    case "QUICK_REPLY": {
      const v = action.value;
      switch (state.step) {
        case "confirm_location": {
          const yes =
            v === QUICK_LOCATION.YES ||
            v === QUICK_HI_YES ||
            v.toLowerCase() === "yes" ||
            v === "Haan";
          const change =
            v === QUICK_LOCATION.CHANGE ||
            v === QUICK_HI_CHANGE ||
            v.toLowerCase() === "change";

          if (yes) {
            const label =
              state.detectedLocationLabel ||
              (state.detectedLat != null && state.detectedLng != null
                ? `${state.detectedLat.toFixed(3)}, ${state.detectedLng.toFixed(3)}`
                : "Unknown");
            const data = { ...state.data, location: label };
            return {
              ...state,
              step: "ask_crop",
              data,
              messages: [...state.messages, user(v), bot(t(state.lang, "ask_crop"))],
            };
          }
          if (change) {
            return {
              ...state,
              step: "edit_location",
              messages: [...state.messages, user(v), bot(t(state.lang, "location_change_prompt"))],
            };
          }
          return state;
        }
        case "ask_crop": {
          if (v === "Other") {
            return {
              ...state,
              step: "ask_crop_other",
              messages: [...state.messages, user(v), bot(t(state.lang, "ask_crop_other"))],
            };
          }
          const data = { ...state.data, crop_type: v };
          return {
            ...state,
            step: "ask_need",
            data,
            messages: [...state.messages, user(v), bot(t(state.lang, "ask_need"))],
          };
        }
        case "ask_need": {
          const data = { ...state.data, primary_need: v };
          return {
            ...state,
            step: "complete",
            data,
            messages: [...state.messages, user(v), bot(t(state.lang, "complete"))],
          };
        }
        default:
          return state;
      }
    }

    default:
      return state;
  }
}

export interface StepUIHints {
  showTextInput: boolean;
  quickReplies: string[];
  placeholder: string;
}

export function getStepHints(step: OnboardingStep, lang: OnboardingLang): StepUIHints {
  const placeholder = lang === "en" ? "Type here…" : "Yahan likho…";

  switch (step) {
    case "ask_name":
      return { showTextInput: true, quickReplies: [], placeholder };
    case "confirm_location":
      return {
        showTextInput: false,
        quickReplies:
          lang === "en"
            ? [QUICK_LOCATION.YES, QUICK_LOCATION.CHANGE]
            : [QUICK_HI_YES, QUICK_LOCATION.CHANGE],
        placeholder,
      };
    case "edit_location":
    case "ask_crop_other":
      return { showTextInput: true, quickReplies: [], placeholder };
    case "ask_crop":
      return {
        showTextInput: false,
        quickReplies: [...CROP_OPTIONS],
        placeholder,
      };
    case "ask_need":
      return {
        showTextInput: false,
        quickReplies: [...NEED_OPTIONS],
        placeholder,
      };
    case "complete":
      return { showTextInput: false, quickReplies: [], placeholder };
    default:
      return { showTextInput: false, quickReplies: [], placeholder };
  }
}
