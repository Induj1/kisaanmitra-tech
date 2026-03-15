import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const audioBase64 = body?.audioBase64;
    const mimeType = body?.mimeType || "audio/webm";

    if (!audioBase64) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing audioBase64 in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "OPENAI_API_KEY is not configured in function environment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const buffer = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
    const file = new File([buffer], mimeType.includes("wav") ? "audio.wav" : "audio.webm", { type: mimeType });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: formData,
    });

    const rawText = await resp.text();
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "OpenAI Whisper returned non-JSON", raw: rawText }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ success: false, error: parsed?.error || "OpenAI Whisper error", raw: parsed }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
