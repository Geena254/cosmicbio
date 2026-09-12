const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an agronomy advisor for the NASA Bioscience Knowledge Explorer.
You translate space bioscience research (plant growth, controlled environments, stress tolerance,
nutrients, light, water use) into practical farming guidance, with a primary focus on Kenya
(counties, agro-ecological zones, long rains March-May and short rains October-December,
smallholder realities, low-cost inputs) and secondary relevance worldwide.

Rules:
- Be concrete and actionable: sowing windows, spacing, depth, watering, soil, pests, harvest timing.
- Prefer low-cost, locally available practices. Use metric units and KES only when prices are essential.
- Never invent statistics, study results, subsidy programmes, prices or institutions. If uncertain, say so.
- Note when guidance is general and should be checked with a local extension officer.
- Reply in clear markdown with short headings and bullet points. No preamble.`;

function buildPrompt(mode: string, payload: Record<string, unknown>): string {
  const p = payload ?? {};
  switch (mode) {
    case "planting-advisor":
      return `Give a planting and growth plan.
Crop: ${p.crop}
Location: ${p.location}
Season / planting time: ${p.season}
Growing setup: ${p.setup}
Land size: ${p.area}
Extra notes from the farmer: ${p.notes || "none"}

Cover: best sowing window, seed selection, spacing and depth, soil preparation and fertility,
water schedule, common pests and diseases with low-cost control, growth milestones week by week,
expected harvest timing, and two or three techniques borrowed from space/controlled-environment
crop research that could improve results here.`;
    case "earth-application":
      return `A NASA bioscience study is summarised below. Explain what it means for farmers on Earth,
especially smallholder farmers in Kenya.

Title: ${p.title}
Abstract: ${p.abstract}
Key findings: ${Array.isArray(p.findings) ? (p.findings as string[]).join("; ") : p.findings}

Cover: what the finding suggests for field or greenhouse growing, which crops and conditions it
is most relevant to, practical steps a farmer or agronomist could try, and the limits of applying
space research to open fields. Be honest where the link is speculative.`;
    case "crop-hub":
      return `Produce a Kenya crop guide for: ${p.crop}.
Cover: main growing regions and counties, planting calendar for long and short rains, recommended
varieties by zone (generic descriptions if specific variety names are uncertain), soil and fertility,
water and drought management, key pests and diseases, harvesting and storage, and how findings from
space plant-biology research (stress tolerance, root growth, nutrient delivery, lighting) relate.`;
    case "controlled-environment":
      return `Give practical guidance on controlled-environment growing for: ${p.topic}.
Audience: farmers and agri-entrepreneurs in Kenya working with modest budgets.
Cover: how the technique works, what it needs (materials, water, power, space), realistic costs in
general terms, crops best suited, step-by-step setup, common mistakes, and the space-farming research
ideas behind it.`;
    default:
      return String(p.prompt ?? "Give general agronomy guidance for smallholder farmers in Kenya.");
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(mode, payload) },
        ],
      }),
    });

    if (res.status === 429) {
      return new Response(
        JSON.stringify({ error: "Too many requests right now. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (res.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits are exhausted. Please top up to keep using the advisor." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!res.ok) {
      const detail = await res.text();
      console.error("AI gateway error", res.status, detail);
      return new Response(JSON.stringify({ error: "The advisor could not answer right now." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("agri-advisor failure", err);
    return new Response(JSON.stringify({ error: "Unexpected error. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
