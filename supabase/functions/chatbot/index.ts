import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const message = body?.message ?? null;
    const cropData = body?.cropData ?? null;
    const language = (body?.language || 'english').toString().toLowerCase();

    if (!message && !cropData) {
      return new Response(JSON.stringify({ success: false, error: 'Missing message or cropData in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(JSON.stringify({ success: false, error: 'OPENAI_API_KEY is not configured in function environment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const languageLabel = language === 'hindi' ? 'Hindi' : language === 'kannada' ? 'Kannada' : 'English';
    const scriptInstruction = language === 'hindi' 
      ? 'Write your response in Devanagari script (हिंदी में), NOT in Roman/English letters.' 
      : language === 'kannada' 
        ? 'Write your response in Kannada script (ಕನ್ನಡದಲ್ಲಿ), NOT in Roman/English letters.'
        : '';

    const systemPrompt = `You are an expert agricultural assistant for smallholder farmers in India. You MUST respond ONLY in ${languageLabel} language. ${scriptInstruction} Provide concise, practical advice. Avoid medical/legal advice beyond general guidance.`;

    // Build user content
    let userContent = '';
    if (message) {
      userContent = String(message);
    } else {
      userContent = `Analyze the following crop data and provide concise, practical suggestions. Data: ${JSON.stringify(cropData)}`;
    }

    // Call OpenAI Chat Completions
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return new Response(JSON.stringify({ success: false, error: `OpenAI API error: ${res.status} ${res.statusText}`, detail: errText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const assistantText = data?.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ success: true, data: { text: assistantText, version: 'openai-chatbot-v1' } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
