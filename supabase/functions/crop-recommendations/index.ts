
import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CropRecommendation {
  cropName: string;
  confidence: number;
  soilSuitability: string;
  waterRequirement: string;
  seasonalFit: string;
}

interface RequestBody {
  latitude: number;
  longitude: number;
  area?: number; // in hectares
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Get request body
    const requestData: RequestBody = await req.json();
    const { latitude, longitude, area = 1 } = requestData;

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing crop recommendations for location: ${latitude}, ${longitude} with area: ${area}ha`);

    // In a real implementation, here we would:
    // 1. Call an external API or ML model for crop recommendations
    // 2. Consider soil data, weather patterns, and historical crop performance
    // 3. Return personalized recommendations
    
    // For this example, we'll return mock recommendations based on location
    // In the future, we could integrate with real agricultural APIs
    
    // Simple mock logic to vary recommendations slightly based on location
    const locationHash = Math.abs((latitude * 10) + longitude) % 100;
    
    const mockCrops = [
      { name: "Wheat", baseConfidence: 92 },
      { name: "Barley", baseConfidence: 87 },
      { name: "Maize", baseConfidence: 75 },
      { name: "Rice", baseConfidence: 70 },
      { name: "Soybeans", baseConfidence: 65 },
      { name: "Cotton", baseConfidence: 60 }
    ];
    
    // Generate recommendations with location-based variations
    const recommendations: CropRecommendation[] = mockCrops
      .map(crop => {
        // Add some variation based on location
        const confidenceVariation = (((locationHash + crop.name.length) % 20) - 10);
        const confidence = Math.min(99, Math.max(50, crop.baseConfidence + confidenceVariation));
        
        return {
          cropName: crop.name,
          confidence,
          soilSuitability: confidence > 85 ? "High" : confidence > 70 ? "Medium" : "Low",
          waterRequirement: ["Rice", "Maize"].includes(crop.name) ? "High" : 
                          ["Wheat", "Soybeans"].includes(crop.name) ? "Moderate" : "Low",
          seasonalFit: confidence > 85 ? "Excellent" : confidence > 75 ? "Good" : "Fair"
        };
      })
      // Sort by confidence
      .sort((a, b) => b.confidence - a.confidence)
      // Take top 3
      .slice(0, 3);
    
    // Log the recommendations we're sending back
    console.log(`Returning ${recommendations.length} crop recommendations`);
    
    return new Response(
      JSON.stringify({ recommendations, location: { latitude, longitude } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Error processing crop recommendations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
