import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Map friendly language name -> DeepL language code
const LANG_MAP: Record<string, { source?: string; target: string }> = {
  English: { source: "EN", target: "EN-US" },
  "English (US)": { source: "EN", target: "EN-US" },
  "English (UK)": { source: "EN", target: "EN-GB" },
  Spanish: { source: "ES", target: "ES" },
  French: { source: "FR", target: "FR" },
  German: { source: "DE", target: "DE" },
  Italian: { source: "IT", target: "IT" },
  Portuguese: { source: "PT", target: "PT-PT" },
  "Portuguese (Brazil)": { source: "PT", target: "PT-BR" },
  "Chinese (Simplified)": { source: "ZH", target: "ZH-HANS" },
  "Chinese (Traditional)": { source: "ZH", target: "ZH-HANT" },
  Japanese: { source: "JA", target: "JA" },
  Korean: { source: "KO", target: "KO" },
  Indonesian: { source: "ID", target: "ID" },
  Russian: { source: "RU", target: "RU" },
  Dutch: { source: "NL", target: "NL" },
  Turkish: { source: "TR", target: "TR" },
  Polish: { source: "PL", target: "PL" },
  Ukrainian: { source: "UK", target: "UK" },
  Swedish: { source: "SV", target: "SV" },
  Danish: { source: "DA", target: "DA" },
  Norwegian: { source: "NB", target: "NB" },
  Finnish: { source: "FI", target: "FI" },
  Czech: { source: "CS", target: "CS" },
  Greek: { source: "EL", target: "EL" },
  Romanian: { source: "RO", target: "RO" },
  Hungarian: { source: "HU", target: "HU" },
  Bulgarian: { source: "BG", target: "BG" },
  Slovak: { source: "SK", target: "SK" },
  Slovenian: { source: "SL", target: "SL" },
  Estonian: { source: "ET", target: "ET" },
  Latvian: { source: "LV", target: "LV" },
  Lithuanian: { source: "LT", target: "LT" },
  Arabic: { source: "AR", target: "AR" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("DEEPL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "DEEPL_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { text, sourceLang, targetLang } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetEntry = LANG_MAP[targetLang];
    if (!targetEntry) {
      return new Response(
        JSON.stringify({ error: `Unsupported target language: ${targetLang}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const params = new URLSearchParams();
    params.append("text", text);
    params.append("target_lang", targetEntry.target);
    if (sourceLang && sourceLang !== "auto") {
      const srcEntry = LANG_MAP[sourceLang];
      if (srcEntry?.source) params.append("source_lang", srcEntry.source);
    }

    // Free-tier keys end in ":fx" and must use api-free.deepl.com
    const endpoint = apiKey.endsWith(":fx")
      ? "https://api-free.deepl.com/v2/translate"
      : "https://api.deepl.com/v2/translate";

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: "DeepL API error", detail: errText }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    const translation = data.translations?.[0]?.text ?? "";
    const detected = data.translations?.[0]?.detected_source_language ?? null;

    return new Response(JSON.stringify({ translation, detected }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
