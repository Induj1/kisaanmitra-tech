
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body safely: accept either { cropData } for structured analysis
    // or { message } for free-text conversational queries. Optionally include "language".
    let cropData: any = null;
    let userMessage: string | null = null;
    let body: any = null;

    try {
      body = await req.json();
      cropData = body?.cropData ?? null;
      userMessage = body?.message ?? null;

      if (!cropData && !userMessage) {
        throw new Error('Missing cropData or message in request body');
      }

      console.log("Received request body:", body);
    } catch (parseError: any) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid request format: ${parseError?.message ?? String(parseError)}`
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key is missing. Please set the OPENAI_API_KEY secret in the Supabase project settings."
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Accept optional language parameter (english | hindi | kannada)
    const language = (body?.language || cropData?.language || 'english').toString().toLowerCase();

    // Helper: language label for prompts
    const languageLabel = language === 'hindi' ? 'Hindi' : language === 'kannada' ? 'Kannada' : 'English';

    // System prompt for both conversational and structured requests
    const systemPromptBase = `You are an expert agricultural assistant for smallholder farmers in India. Provide concise, practical, and actionable advice about crops, weather, markets, and government schemes. Always answer in the user's requested language: ${languageLabel}. If asked for structured analysis, return STRICT JSON as requested. Be mindful of safety and avoid providing medical or legal advice beyond high-level guidance.`;

    // If a free-text message is provided, handle as a conversational query
    if (userMessage) {
      console.log('Handling free-text conversational query');
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPromptBase },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenAI API error response:", errorText);
          if (response.status === 401 || response.status === 403) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid OpenAI API key. Please check and update your OPENAI_API_KEY in the Supabase project settings."
              }),
              {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const assistantText = data?.choices?.[0]?.message?.content ?? '';

        return new Response(JSON.stringify({ success: true, data: { text: assistantText } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } catch (chatError: any) {
        console.error('Error during OpenAI chat request:', chatError);
        return new Response(JSON.stringify({ success: false, error: `OpenAI chat error: ${chatError?.message ?? String(chatError)}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
    }

    // Otherwise, fall through to structured cropData analysis
    try {
      // Build the structured analysis user prompt
      const userPrompt = `Analyze this crop cultivation data and provide the following (use STRICT JSON output):\n\nCrop Specifics:\n- Type: ${cropData.crop_type}\n- Land Size: ${cropData.land_size}\n- Sowing Date: ${cropData.sowing_date}\n- Cultivation Method: ${cropData.cultivation_method}\n- Watering Method: ${cropData.watering_method}\n\nKey Observations and Analysis:\n1) Provide 3-4 specific strengths in the current cultivation approach\n2) Identify 3-4 critical areas for improvement\n3) Offer targeted, practical recommendations for enhancing crop yield and sustainability\n4) Assess overall agricultural practices with a comprehensive score (0-100)\n\nResponse Format (STRICT JSON):\n{\n  "positives": ["..."],\n  "improvements": ["..."],\n  "recommendations": ["..."],\n  "overallScore": number\n}\n\nNote: Provide realistic, data-driven insights based on the specific crop type and cultivation details.`;

      console.log('Sending structured analysis request to OpenAI');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPromptBase },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error response:', errorText);
        if (response.status === 401 || response.status === 403) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid OpenAI API key. Please check and update your OPENAI_API_KEY in the Supabase project settings.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data?.choices?.[0]?.message?.content ?? '';

      let analysisJson: any;
      try {
        // Clean the response text to extract JSON
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const cleanedText = jsonMatch ? jsonMatch[0] : analysisText;

        analysisJson = JSON.parse(cleanedText);

        // Validate that the JSON has the expected structure
        if (!analysisJson.positives || !analysisJson.improvements || typeof analysisJson.recommendations === 'undefined' || typeof analysisJson.overallScore === 'undefined') {
          throw new Error('Missing required fields in OpenAI response');
        }
      } catch (parseError: any) {
        console.error('Error parsing OpenAI JSON response:', parseError, 'Raw response:', analysisText);
        // Fallback response if JSON parsing fails
        analysisJson = {
          positives: [
            'Your choice of crop type is appropriate for the region.',
            "The land size you're working with is adequate for this type of cultivation.",
            'Your approach shows commitment to agricultural best practices.'
          ],
          improvements: [
            'Consider optimizing your watering schedule based on crop needs.',
            'Review your cultivation method for potential efficiency improvements.', 
            'Soil testing could provide valuable insights for better outcomes.'
          ],
          recommendations: [
            'Implement crop rotation to improve soil health.',
            'Consider organic alternatives to chemical fertilizers.', 
            'Monitor weather patterns closely to optimize planting and harvesting times.',
            'Consult with local agricultural extension services for region-specific advice.'
          ],
          overallScore: 65
        };
      }

      return new Response(JSON.stringify({ success: true, data: analysisJson }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    } catch (openaiError: any) {
      console.error('Error during structured OpenAI request:', openaiError);
      return new Response(JSON.stringify({ success: false, error: `OpenAI error: ${openaiError?.message ?? String(openaiError)}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }
  } catch (error: any) {
    console.error('Error in crop analysis:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || String(error) || "An unknown error occurred"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
