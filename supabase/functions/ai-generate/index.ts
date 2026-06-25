import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load API keys from app_settings
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("openai_api_key, gemini_api_key")
      .eq("id", 1)
      .maybeSingle();

    if (settingsError) throw settingsError;

    const openaiKey = settings?.openai_api_key || "";
    const geminiKey = settings?.gemini_api_key || "";

    if (!openaiKey && !geminiKey) {
      return new Response(
        JSON.stringify({
          error: "No AI API keys configured. The admin must add an OpenAI or Gemini API key in the Admin Control Panel before AI generation is available.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      provider = "openai",
      model = "gpt-4o",
      system_prompt = "You are a helpful assistant.",
      user_prompt = "",
      temperature = 0.7,
      max_tokens = 2048,
    } = body;

    if (!user_prompt || typeof user_prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "user_prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let generatedText = "";
    let usedProvider = "";

    // Try OpenAI first (or if explicitly requested and key exists)
    if (provider === "openai" && openaiKey) {
      usedProvider = "openai";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: model || "gpt-4o",
          messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: user_prompt },
          ],
          temperature,
          max_tokens,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        // Fall back to Gemini if OpenAI fails
        if (geminiKey) {
          usedProvider = "gemini";
        } else {
          return new Response(
            JSON.stringify({ error: `OpenAI API error (${response.status}): ${errBody}` }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        const data = await response.json();
        generatedText = data.choices?.[0]?.message?.content || "";
      }
    }

    // Use Gemini if provider is gemini, or as fallback
    if ((provider === "gemini" || usedProvider === "gemini") && geminiKey && !generatedText) {
      usedProvider = "gemini";
      const geminiModel = model.includes("gemini") ? model : "gemini-1.5-flash";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: system_prompt }] },
            contents: [{ parts: [{ text: user_prompt }] }],
            generationConfig: { temperature, maxOutputTokens: max_tokens },
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        return new Response(
          JSON.stringify({ error: `Gemini API error (${response.status}): ${errBody}` }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: "No content was generated. Please check the API keys in the Admin Panel." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        content: generatedText,
        provider: usedProvider,
        model,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
