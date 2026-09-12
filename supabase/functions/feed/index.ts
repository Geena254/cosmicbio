import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function esc(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clean(text?: string | null) {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const topics = (url.searchParams.get("topics") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const site = url.searchParams.get("site") ?? "https://cosmicbio.lovable.app";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let query = supabase
      .from("publications")
      .select("id,title,abstract,source,first_seen_at,tags,source_url")
      .order("first_seen_at", { ascending: false })
      .limit(50);

    if (topics.length) query = query.overlaps("tags", topics);

    const { data, error } = await query;
    if (error) throw error;

    const items = (data ?? [])
      .map(
        (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(`${site}/publication/${p.id}`)}</link>
      <guid isPermaLink="false">${esc(p.id)}</guid>
      <pubDate>${new Date(p.first_seen_at).toUTCString()}</pubDate>
      <category>${esc(p.source)}</category>
      <description>${esc(clean(p.abstract) || "No abstract available.")}</description>
    </item>`,
      )
      .join("\n");

    const title = topics.length
      ? `NASA Bioscience Explorer — ${topics.join(", ")}`
      : "NASA Bioscience Explorer — new studies";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(site)}</link>
    <description>New NASA space bioscience studies as they are added.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (err) {
    return new Response(`Feed unavailable: ${err instanceof Error ? err.message : err}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
