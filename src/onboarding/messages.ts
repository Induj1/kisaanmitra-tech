import type { OnboardingLang, OnboardingStep } from "./types";

const MSGS: Record<
  OnboardingLang,
  Record<
    OnboardingStep | "welcome" | "location_change_prompt" | "crop_other_prompt" | "complete",
    string
  >
> = {
  "hi-en": {
    welcome: "Namaste 🙏 Welcome! Aapka naam kya hai?",
    ask_name: "Aapka naam?",
    confirm_location: "", // filled with dynamic location
    edit_location: "Theek hai! Apna gaanv / shehar likho 📍",
    ask_crop: "Aap kya ugate ho?",
    ask_crop_other: "Kaunsi fasal? Chhota sa jawab 👇",
    ask_need: "Aapko kis type ki madad chahiye?",
    complete: "Setup complete 👍 Aap ready ho!",
    location_change_prompt: "Theek hai! Apna gaanv / shehar likho 📍",
  },
  en: {
    welcome: "Hi 🙏 Welcome! What's your name?",
    ask_name: "Your name?",
    confirm_location: "",
    edit_location: "Sure! Type your village or city 📍",
    ask_crop: "What do you grow?",
    ask_crop_other: "Which crop? Short answer 👇",
    ask_need: "What kind of help do you need?",
    complete: "All set 👍 You're ready!",
    location_change_prompt: "Sure! Type your village or city 📍",
  },
};

export function t(lang: OnboardingLang, key: keyof typeof MSGS["en"]): string {
  return MSGS[lang][key] ?? MSGS.en[key];
}

export function locationConfirmQuestion(lang: OnboardingLang, place: string): string {
  if (lang === "en") {
    return `Is this your location? 📍 ${place}`;
  }
  return `Yeh aapka location hai? 📍 ${place}`;
}
