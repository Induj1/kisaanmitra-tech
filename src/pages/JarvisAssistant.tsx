import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import {
  Activity,
  BarChart4,
  Bot,
  Calendar,
  Cloud,
  Droplets,
  Leaf,
  Navigation,
  ShieldCheck,
  Send,
  ShoppingCart,
  Sparkles,
  Tractor,
  Wand2,
  Mic,
  MicOff,
} from "lucide-react";

// Supabase Edge Function endpoints
const SUPABASE_CHAT_ENDPOINT = `${SUPABASE_URL}/functions/v1/chatbot`;
const SUPABASE_WHISPER_ENDPOINT = `${SUPABASE_URL}/functions/v1/whisper`;

type ChatAuthor = "assistant" | "user";

interface ChatMessage {
  role: ChatAuthor;
  text: string;
  ts: number;
  status?: "typing";
}

const toolbelt = [
  { title: "Farm Planner", description: "Create tasks, rotations, and inputs per field.", route: "/farm-planner", icon: Tractor },
  { title: "Weather + Alerts", description: "Hyperlocal forecast and risk alerts.", route: "/weather", icon: Cloud },
  { title: "Mandi Prices", description: "Live mandi prices and sell/hold guidance.", route: "/market-prices", icon: BarChart4 },
  { title: "Crop Calendar", description: "Seasonal sowing windows and reminders.", route: "/crop-calendar", icon: Calendar },
  { title: "Crop Analysis", description: "Upload images or metrics for AI crop health.", route: "/crop-analysis", icon: Leaf },
  { title: "Marketplace", description: "Buy agri inputs and sell produce.", route: "/marketplace", icon: ShoppingCart },
  { title: "Loans", description: "Check eligibility and apply for agri credit.", route: "/loans", icon: Droplets },
  { title: "Ask Expert", description: "Chat with agronomy advisors.", route: "/ask-expert", icon: Bot },
];

const quickPrompts = [
  "Plan my next 90 days for cotton in Maharashtra with irrigation and fertilizer reminders.",
  "Check mandi prices for wheat near Jaipur and tell me if I should sell today.",
  "Give me a sowing and input plan for paddy on 3 acres in coastal Karnataka.",
  "Look at today and next 3 days weather for my saved location and warn me about spraying.",
  "Create a crop calendar for mustard and set up alerts for pests and irrigation.",
  "Summarize feedback from my farm tasks and suggest what to improve this week.",
];

const JarvisAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Hey, I am Jarvis — your bilingual farm copilot. Ask me anything: plan crops, check mandi prices, run crop analysis, or open tools for you.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak latest assistant reply for a voice-first flow
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.status);
    if (lastAssistant) {
      const utterance = new SpeechSynthesisUtterance(lastAssistant.text);
      utterance.lang = "en-IN";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [messages]);

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const replaceTyping = (text: string) => {
    setMessages((prev) => {
      const withoutTyping = prev.filter((m) => m.status !== "typing");
      return [...withoutTyping, { role: "assistant", text, ts: Date.now() }];
    });
  };

  const fetchAssistantReply = async (prompt: string) => {
    const requestBody = { message: prompt, language: "english", cropData: {} };
    let data: any = null;

    try {
      const res = await supabase.functions.invoke("chatbot", { body: requestBody });
      data = res.data;
      if (res.error) {
        throw res.error;
      }
    } catch (invokeErr) {
      console.warn("supabase.functions.invoke chatbot failed, trying direct REST", invokeErr);
      const res = await fetch(SUPABASE_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, error: `Non-JSON response: ${text}` };
      }
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || `Supabase status ${res.status}`);
      }
    }

    if (!data || !data.success) {
      throw new Error(data?.error || "Unable to get a response right now.");
    }

    return data.data?.text || "I could not understand that, try rephrasing.";
  };

  const handleSend = async (preset?: string) => {
    if (isSending) return;
    const text = (preset ?? input).trim();
    if (!text) return;

    pushMessage({ role: "user", text, ts: Date.now() });
    pushMessage({ role: "assistant", text: "Thinking with your tools...", ts: Date.now(), status: "typing" });
    setInput("");
    setIsSending(true);

    try {
      const reply = await fetchAssistantReply(text);
      replaceTyping(reply);
    } catch (err: any) {
      replaceTyping(
        "I could not reach OpenAI right now. Please try again in a bit or open a tool directly from the right panel."
      );
    } finally {
      setIsSending(false);
    }
  };

  const startRecording = async () => {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        try {
          const transcript = await transcribeAudio(blob);
          if (transcript) {
            setInput(transcript);
            handleSend(transcript);
          }
      } catch (err: any) {
        setRecordingError(err?.message || "Could not transcribe. Try again.");
      }
    };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setRecordingError(err?.message || "Microphone not available");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
  };

  const transcribeAudio = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    // Chunked base64 conversion to avoid call stack overflow on large blobs
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const chunkSize = 10240;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);

    const res = await supabase.functions.invoke("whisper", {
      body: { audioBase64: base64, mimeType: blob.type || "audio/webm" },
    });

    if (res.error) {
      throw new Error(res.error.message || "Whisper transcription failed.");
    }

    const data = res.data;
    if (!data?.success) {
      const detail = typeof data?.raw === "string" ? ` Raw: ${data.raw}` : "";
      throw new Error((data?.error || "Whisper transcription failed.") + detail);
    }

    return data.data?.text as string;
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-amber-300" />
              <p className="text-sm uppercase tracking-wide text-emerald-100">Jarvis for Farmers</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Bot className="h-8 w-8" />
              Conversation-first control for every tool you have
            </h1>
            <p className="text-emerald-100 max-w-3xl">
              Ask in any language. Jarvis can open and drive features like crop planning, mandi prices, weather, crop
              analysis, marketplace, and more — no menus needed.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/15 text-white border border-white/20">Weather + alerts</Badge>
              <Badge className="bg-white/15 text-white border border-white/20">Mandi prices</Badge>
              <Badge className="bg-white/15 text-white border border-white/20">Crop plans</Badge>
              <Badge className="bg-white/15 text-white border border-white/20">Marketplace</Badge>
              <Badge className="bg-white/15 text-white border border-white/20">Feedback + tasks</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Talk to Jarvis
                </CardTitle>
                <CardDescription>Ask for plans, prices, weather, or to open any dashboard tool.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  Uses OpenAI + your Supabase tools
                </Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  Multilingual
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="secondary"
                    size="sm"
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900"
                    onClick={() => handleSend(prompt)}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {prompt}
                  </Button>
                ))}
              </div>

              <div className="border rounded-lg p-4 h-[440px] overflow-y-auto bg-gradient-to-b from-white to-emerald-50/60">
                <div className="space-y-3">
                  {messages.map((message, idx) => (
                    <div
                      key={`${message.ts}-${idx}`}
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          message.role === "assistant"
                            ? "bg-emerald-50 text-emerald-900"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 text-xs opacity-75">
                          {message.role === "assistant" ? (
                            <>
                              <Bot className="h-3 w-3" />
                              <span>Jarvis</span>
                            </>
                          ) : (
                            <>
                              <Activity className="h-3 w-3" />
                              <span>You</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(message.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {message.status === "typing" ? "Thinking..." : message.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  className={`h-14 w-14 ${isRecording ? "animate-pulse" : ""}`}
                  onClick={() => (isRecording ? stopRecording() : startRecording())}
                  title={isRecording ? "Stop recording" : "Hold to speak"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Jarvis to plan crops, check prices, pull weather, or open a tool..."
                  className="min-h-14"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="h-14 w-14 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSend()}
                  disabled={isSending || !input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              {recordingError && <p className="text-sm text-red-600">{recordingError}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-emerald-600" />
                Tool hand-off
              </CardTitle>
              <CardDescription>Jarvis can open and drive these features for you.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {toolbelt.map((tool) => (
                <Link to={tool.route} key={tool.route} className="group">
                  <div className="p-4 rounded-xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-emerald-700">{tool.title}</p>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-900">
                        Open
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                What Jarvis can do
              </CardTitle>
              <CardDescription className="text-emerald-50">
                One conversation to orchestrate planning, pricing, and operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Wand2 className="h-4 w-4 mt-1" />
                <p className="text-sm">Generate crop plans and push tasks into Farm Planner.</p>
              </div>
              <div className="flex items-start gap-3">
                <BarChart4 className="h-4 w-4 mt-1" />
                <p className="text-sm">Compare mandi prices and suggest sell/hold for your crops.</p>
              </div>
              <div className="flex items-start gap-3">
                <Cloud className="h-4 w-4 mt-1" />
                <p className="text-sm">Check weather and schedule safe spray/irrigation windows.</p>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="h-4 w-4 mt-1" />
                <p className="text-sm">Run crop analysis and flag pest/disease risks.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-4 w-4 mt-1" />
                <p className="text-sm">Buy inputs or list produce directly from the conversation.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default JarvisAssistant;
