import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { reverseGeocode } from "@/onboarding/geocode";
import { getStepHints } from "@/onboarding/engine";
import { saveOnboardingToFarmerProfile } from "@/onboarding/saveProfile";
import type { OnboardingAction, OnboardingLang } from "@/onboarding/types";
import {
  clearOnboardingDraft,
  isOnboardingDataComplete,
  persistOnboardingDraft,
  useOnboardingStore,
} from "@/stores/onboardingStore";
import { TypingIndicator } from "./TypingIndicator";
import { QuickReplyBar } from "./QuickReplyBar";
import { Mic, Send, Languages, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPING_MS_MIN = 380;
const TYPING_MS_MAX = 720;

function typingDelay() {
  return TYPING_MS_MIN + Math.random() * (TYPING_MS_MAX - TYPING_MS_MIN);
}

export const OnboardingChat: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [saving, setSaving] = useState(false);

  const bootstrapped = useOnboardingStore((s) => s.bootstrapped);
  const messages = useOnboardingStore((s) => s.messages);
  const step = useOnboardingStore((s) => s.step);
  const lang = useOnboardingStore((s) => s.lang);
  const data = useOnboardingStore((s) => s.data);
  const bootstrap = useOnboardingStore((s) => s.bootstrap);
  const dispatch = useOnboardingStore((s) => s.dispatch);
  const resetFlow = useOnboardingStore((s) => s.resetFlow);

  const runAction = useCallback(
    async (action: OnboardingAction) => {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, typingDelay()));
      dispatch(action);
      setIsTyping(false);
    },
    [dispatch]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: row, error } = await supabase
        .from("farmer_profiles")
        .select("name,location,crop_type,primary_need")
        .eq("user_id", userId)
        .single();

      if (error || !row) {
        toast({ variant: "destructive", title: "Profile load failed", description: error?.message });
        return;
      }

      let geo: { label: string; lat: number; lng: number } | null = null;
      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              if (cancelled) {
                resolve();
                return;
              }
              const { latitude, longitude } = pos.coords;
              const label = await reverseGeocode(latitude, longitude);
              geo = { label, lat: latitude, lng: longitude };
              resolve();
            },
            () => resolve(),
            { enableHighAccuracy: false, timeout: 12_000, maximumAge: 60_000 }
          );
        });
      }

      if (cancelled) return;
      const currentLang = useOnboardingStore.getState().lang;
      bootstrap(userId, currentLang, row, geo);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap once per mount
  }, [userId]);

  useEffect(() => {
    if (!bootstrapped) return;
    persistOnboardingDraft(userId, useOnboardingStore.getState());
  }, [bootstrapped, userId, messages, step, data, lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const saveOnceRef = useRef(false);
  useEffect(() => {
    if (step !== "complete" || !isOnboardingDataComplete(data) || saveOnceRef.current) return;
    saveOnceRef.current = true;
    let cancelled = false;
    (async () => {
      const { data: existing } = await supabase
        .from("farmer_profiles")
        .select("primary_need")
        .eq("user_id", userId)
        .maybeSingle();
      if (existing?.primary_need?.trim()) {
        clearOnboardingDraft(userId);
        navigate("/dashboard", { replace: true });
        return;
      }

      setSaving(true);
      const { error } = await saveOnboardingToFarmerProfile(supabase, userId, data);
      if (cancelled) return;
      if (error) {
        saveOnceRef.current = false;
        toast({
          variant: "destructive",
          title: "Save failed",
          description: error.message,
        });
        setSaving(false);
        return;
      }
      clearOnboardingDraft(userId);
      toast({ title: "Ho gaya! 🎉", description: "Profile saved." });
      navigate("/dashboard", { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [step, data, userId, navigate, toast]);

  const hints = getStepHints(step, lang);

  const submitText = async () => {
    const t = input.trim();
    if (!t || isTyping || step === "complete") return;
    setInput("");
    await runAction({ type: "USER_TEXT", text: t });
  };

  const onQuickReply = async (value: string) => {
    if (isTyping || step === "complete") return;
    await runAction({ type: "QUICK_REPLY", value });
  };

  const toggleLang = () => {
    const next: OnboardingLang = lang === "hi-en" ? "en" : "hi-en";
    dispatch({ type: "SET_LANG", lang: next });
    toast({ title: "Language", description: next === "en" ? "English" : "Hinglish" });
  };

  const startVoice = () => {
    const W = window as unknown as {
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
        onerror: (() => void) | null;
        start: () => void;
      };
    };
    const SR = W.webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Voice", description: "Speech recognition not supported in this browser." });
      return;
    }
    const rec = new SR();
    rec.lang = lang === "en" ? "en-IN" : "hi-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${text}` : text));
    };
    rec.onerror = () => toast({ variant: "destructive", title: "Mic error" });
    rec.start();
    toast({ title: "Sun raha hoon…", description: "Speak now." });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#e5ddd5] dark:bg-zinc-900">
      <header className="flex shrink-0 items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground shadow">
        <div>
          <p className="text-sm font-semibold">KisaanMitra</p>
          <p className="text-xs opacity-90">Quick setup — chat style</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="icon" variant="secondary" className="h-9 w-9" onClick={toggleLang} title="Language">
            <Languages className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-9 w-9"
            onClick={() => {
              saveOnceRef.current = false;
              resetFlow();
              clearOnboardingDraft(userId);
            }}
            title="Start over"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex px-2", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm",
                m.role === "user"
                  ? "rounded-br-md bg-[#dcf8c6] text-gray-900 dark:bg-green-800 dark:text-white"
                  : "rounded-bl-md bg-white text-gray-900 dark:bg-zinc-800 dark:text-zinc-100"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {step !== "complete" && (
        <>
          <QuickReplyBar options={hints.quickReplies} onSelect={onQuickReply} disabled={isTyping} />
          {hints.showTextInput && (
            <div className="flex gap-2 border-t bg-background p-3">
              <Button type="button" size="icon" variant="outline" onClick={startVoice} disabled={isTyping}>
                <Mic className="h-4 w-4" />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hints.placeholder}
                className="min-h-10 flex-1 resize-none"
                rows={1}
                disabled={isTyping}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submitText();
                  }
                }}
              />
              <Button type="button" size="icon" onClick={() => void submitText()} disabled={isTyping || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {step === "complete" && saving && (
        <p className="border-t bg-background py-3 text-center text-sm text-muted-foreground">Saving…</p>
      )}
    </div>
  );
};
