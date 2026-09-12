import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM = `You are a research guide for the NASA Bioscience Knowledge Explorer.
You answer questions using ONLY the study excerpts supplied in the user message.
Rules:
- Cite studies inline by their number, like [3], whenever you use them.
- If the excerpts do not answer the question, say so plainly and suggest a better search term.
- Never invent findings, numbers, authors or studies.
- Be concise: a short direct answer, then bullet points with the evidence.
- When useful, add a short "What this could mean on Earth" note aimed at farmers and growers.
- Reply in clean markdown, no preamble.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { question } = await req.json();
    if (typeof question !== "string" || question.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Please ask a longer question." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const terms = question
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 6);

    const filter = terms.length
      ? terms.map((t) => `title.ilike.%${t}%,abstract.ilike.%${t}%`).join(",")
      : "title.ilike.%space%";

    const { data: matches } = await supabase
      .from("publications")
      .select("id,title,year,source,source_url,abstract,tags,organism")
      .or(filter)
      .limit(12);

    const studies = matches ?? [];
    if (!studies.length) {
      return new Response(
        JSON.stringify({
          answer: "No studies in the library matched that question. Try different keywords.",
          sources: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const context = studies
      .map(
        (s, i) =>
          `[${i + 1}] ${s.title} (${s.year ?? "year unknown"}, ${s.source})\n${
            (s.abstract ?? "").slice(0, 700) || "No abstract available."
          }`,
      )
      .join("\n\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Question: ${question}\n\nStudy excerpts:\n${context}` },
        ],
      }),
    });

    if (!res.ok) {
      const details = await res.text();
      console.error(`AI gateway failed [${res.status}]: ${details}`);
      const message =
        res.status === 429
          ? "Too many questions right now. Please wait a moment and try again."
          : res.status === 402
          ? "The AI credits for this workspace have run out."
          : "The research assistant could not answer right now.";
      return new Response(JSON.stringify({ error: message }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    return new Response(
      JSON.stringify({
        answer: json?.choices?.[0]?.message?.content ?? "No answer was returned.",
        sources: studies.map((s, i) => ({
          n: i + 1,
          id: s.id,
          title: s.title,
          year: s.year,
          url: s.source_url,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ask-research failed:", message);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
